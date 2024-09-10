const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const loginStudent = async (req, res) => {
    try {
        const { collegeId , password, secret } = req.body;
        const result = await db.query('SELECT * FROM students WHERE s_college_id = $1 AND s_device_id = $2', [collegeId, secret]);
        if (result.rows.length && await bcrypt.compare(password, result.rows[0].s_password)) {
            return res.status(200).json({
                success: true,
                message: 'Student Login Success'
            });
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerStudent = async (req, res) => {
    try {
        const { firstName, lastName, rollNumber, semester, collegeId, password, secret } = req.body;
        const checkStudent = await db.query('SELECT * FROM students WHERE s_college_id = $1',[collegeId]);
        if (checkStudent.rows.length) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
            await db.query('INSERT INTO students (s_first_name, s_last_name, s_college_id, s_password, s_device_id, s_roll_number, s_semester) VALUES ($1,$2,$3,$4,$5,$6,$7)',[firstName, lastName, collegeId ,hashedPassword, secret, rollNumber, semester]);
            return res.status(200).json({
                success : true,
                message: 'Student Registration Success'
            });
        } catch (e) {
            return res.status(400).json({ message: 'Student registration failed', error :e });
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginStudent, registerStudent};