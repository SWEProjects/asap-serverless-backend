const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

module.exports = {changePassword}