const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const selectBatch = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const sid = decoded.studentId;
            const {batchId} = req.body;
            if (!batchId) {
                return res.status(400).json({ message: 'Please provide batch' });
            }
            await db.query('BEGIN')
            await db.query('UPDATE students SET s_batch = $1 WHERE sid = $2  ', [batchId, sid])
            await db.query('COMMIT')
            res.status(201).json({ message: 'Batch assigned successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const selectCourses = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'JWT Token Required' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const sid = decoded.studentId;
            const {courseIds} = req.body;
            if (!courseIds || !courseIds.length) {
                return res.status(400).json({ message: 'Please provide course IDs' });
            }
            await db.query('BEGIN')
            await db.query('DELETE FROM students_courses WHERE sid = $1', [sid])
            await db.query('INSERT INTO students_courses (sid, cid) VALUES ($1, unnest($2::int[]))', [sid, courseIds])
            await db.query('COMMIT')
            res.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {selectBatch, selectCourses}