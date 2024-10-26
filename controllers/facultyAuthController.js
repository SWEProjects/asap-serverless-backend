const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
const loginFaculty = async (req, res) => {
    try {
        const { collegeId , password } = req.body;
        if (!collegeId || !password) {
            return res.status(400).json({ message: 'Please provide collegeId and password' });
        }
        const result = await db.query('SELECT * FROM faculties WHERE f_college_id = $1', [collegeId]);
        if (result.rows.length && await bcrypt.compare(password, result.rows[0].f_password)) {
            const token = jwt.sign({ facultyId: result.rows[0].fid }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                success: true,
                message: 'Faculty Login Success',
                token: token,
                facultyId : result.rows[0].fid
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
        if (!firstName ||!collegeId ||!password) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const checkFaculty = await db.query('SELECT * FROM faculties WHERE f_college_id = $1',[collegeId]);
        if (checkFaculty.rows.length) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
            await db.query('BEGIN')
            const faculty = await db.query('INSERT INTO faculties (f_first_name, f_last_name, f_college_id, f_password) VALUES ($1,$2,$3,$4) RETURNING fid',[firstName, lastName || null, collegeId ,hashedPassword]);
            const token = jwt.sign({ facultyId: faculty.rows[0].fid }, JWT_SECRET, { expiresIn: '1h' });
            await db.query('COMMIT')
            return res.status(200).json({
                success : true,
                message: 'Faculty Registration Success',
                token:token
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginFaculty, registerFaculty};