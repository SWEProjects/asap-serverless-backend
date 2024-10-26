const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const loginStudent = async (req, res) => {
    try {
        const { collegeId , password, secret } = req.body;
        if (!collegeId || !password || !secret) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await db.query('SELECT * FROM students WHERE s_college_id = $1 AND s_device_id = $2', [collegeId, secret]);
        if (result.rows.length && await bcrypt.compare(password, result.rows[0].s_password)) {
            const token = jwt.sign({ studentId: result.rows[0].sid }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                success: true,
                message: 'Student Login Success',
                token: token,
                studentId: result.rows[0].sid
            });
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerStudent = async (req, res) => {
    try {
        const { firstName, lastName, rollNumber, collegeId, password, secret } = req.body;
        if (!firstName || !rollNumber || !collegeId || !password || !secret) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const checkStudent = await db.query('SELECT * FROM students WHERE s_college_id = $1',[collegeId]);
        if (checkStudent.rows.length) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
            await db.query('BEGIN')
            const student = await db.query('INSERT INTO students (s_first_name, s_last_name, s_college_id, s_password, s_device_id, s_roll_number) VALUES ($1,$2,$3,$4,$5,$6) RETURNING sid',[firstName, lastName || null, collegeId ,hashedPassword, secret, rollNumber]);
            const token = jwt.sign({ studentId: student.rows[0].sid }, JWT_SECRET, { expiresIn: '1h' });
            await db.query('COMMIT')
            return res.status(200).json({
                success : true,
                message: 'Student Registration Success',
                token:token,
                studentId: student.rows[0].sid
            });
        } catch (e) {
            await db.query('ROLLBACK')
            return res.status(400).json({ message: 'Student registration failed', error :e });
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginStudent, registerStudent};