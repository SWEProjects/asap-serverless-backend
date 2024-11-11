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

const getCurrentCourses = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty', token : token })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const fid = decoded.facultyId;
            const courses = await db.query('SELECT c.cid AS course_id, c.c_name AS course_name, c.c_code AS course_code FROM faculty_courses fc JOIN courses c ON fc.cid = c.cid WHERE fc.fid = $1', [fid]);
            res.status(200).json({ courses: courses.rows });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editProfile = async (req,res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty', token : token })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const fid = decoded.facultyId;
            const {firstName, lastName, collegeId} = req.body;
            if (!firstName ||!lastName ||!collegeId) {
                return res.status(400).json({ message: 'Please provide required fields' });
            }
            await db.query('UPDATE faculties SET f_first_name = $1, f_last_name = $2, f_college_id = $3 WHERE fid = $4', [firstName, lastName, collegeId, fid]);
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            return res.status(403).json({ message: "Failed to update profile", error: error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {editCourses, editProfile, getCurrentCourses}