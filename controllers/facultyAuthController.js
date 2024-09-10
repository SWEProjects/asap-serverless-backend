const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const loginFaculty = async (req, res) => {
    try {
        const { collegeId , password } = req.body;
        const result = await db.query('SELECT * FROM faculties WHERE f_college_id = $1', [collegeId]);
        if (result.rows.length && await bcrypt.compare(password, result.rows[0].f_password)) {
            return res.status(200).json({
                success: true,
                message: 'Faculty Login Success'
            });
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerFaculty = async (req, res) => {
    try {
        const { firstName, lastName, collegeId, password } = req.body;
        const checkFaculty = await db.query('SELECT * FROM faculties WHERE f_college_id = $1',[collegeId]);
        if (checkFaculty.rows.length) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
            await db.query('INSERT INTO faculties (f_first_name, f_last_name, f_college_id, f_password) VALUES ($1,$2,$3,$4)',[firstName, lastName, collegeId ,hashedPassword]);
            return res.status(200).json({
                success : true,
                message: 'Faculty Registration Success'
            });
        } catch (e) {
            return res.status(400).json({ message: 'Faculty registration failed', error :e });
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginFaculty, registerFaculty};