const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

const JWT_SECRET = process.env.JWT_SECRET

const changePassword = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const isFaculty = decoded.facultyId?true:false;
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword ||!newPassword) {
                return res.status(400).json({ message: 'Please provide old and new passwords' });
            }
            if (isFaculty) {
                const faculty = await db.query('SELECT * FROM faculties WHERE fid = $1', [decoded.facultyId]);
                if (!faculty.rows.length) {
                    return res.status(403).json({ message: 'Invalid User' });
                }
                const isMatch = await bcrypt.compare(oldPassword, faculty.rows[0].f_password);
                if (isMatch){
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    await db.query('UPDATE faculties SET f_password = $1 WHERE fid = $2', [hashedPassword, decoded.facultyId]);
                    return res.status(200).json({success:true, message: 'Password changed successfully' });
                }
            } else {
                const student = await db.query('SELECT * FROM faculties WHERE fid = $1', [decoded.studentId]);
                if (!student.rows.length) {
                    return res.status(403).json({ message: 'Invalid User' });
                }
                const isMatch = await bcrypt.compare(oldPassword, student.rows[0].s_password);
                if (isMatch){
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    await db.query('UPDATE students SET s_password = $1 WHERE sid = $2', [hashedPassword, decoded.studentId]);
                    return res.status(200).json({success:true, message: 'Password changed successfully' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const resetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email' });
        }
        const faculty = await db.query('SELECT * FROM faculties WHERE f_college_id = $1', [email]);
        const student = await db.query('SELECT * FROM students WHERE s_college_id = $1', [email]);
        if (!faculty.rows.length && !student.rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = generateOTP();
        if (faculty.rows.length) {
            await db.query('UPDATE faculties SET f_otp = $1 WHERE f_college_id = $2', [otp, email]);
        } else {
            await db.query('UPDATE students SET s_otp = $1 WHERE s_college_id = $2', [otp, email]);
        }
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, 
            subject: 'OTP for password reset', 
            text: otp.toString(),
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports = {changePassword, resetPasswordEmail}