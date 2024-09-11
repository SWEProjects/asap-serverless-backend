const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const editCourses = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty', token : token })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const fid = decoded.facultyId;
            const {courseIds} = req.body;
            if (!courseIds || !courseIds.length) {
                return res.status(400).json({ message: 'Please provide course IDs' });
            }
            await db.query('BEGIN')
            await db.query('DELETE FROM faculty_courses WHERE fid = $1', [fid])
            await db.query('INSERT INTO faculty_courses (fid, cid) VALUES ($1, unnest($2::int[]))', [fid, courseIds])
            await db.query('COMMIT')
            res.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {editCourses}