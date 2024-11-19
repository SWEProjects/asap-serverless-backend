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
            const {batchId, branchId} = req.body;
            if (!batchId || !branchId) {
                return res.status(400).json({ message: 'Please provide batch and branch id' });
            }
            await db.query('BEGIN')
            await db.query('UPDATE students SET s_batch = $1, s_branch = $2 WHERE sid = $3  ', [batchId, branchId, sid])
            await db.query('COMMIT')
            res.status(201).json({ message: 'Batch and Branch assigned successfully' });
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
            res.status(200).json({ message: 'Course added successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCurrentCourses = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'Not a Student', token : token })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const sid = decoded.studentId;
            const courses = await db.query('SELECT c.cid AS course_id, c.c_name AS course_name, c.c_code AS course_code FROM students_courses sc JOIN courses c ON sc.cid = c.cid WHERE sc.sid = $1', [sid]);
            res.status(200).json({ courses: courses.rows });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {selectBatch, selectCourses, getCurrentCourses}