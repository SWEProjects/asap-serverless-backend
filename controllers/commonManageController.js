const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const getBatches = async (req,res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const batches = await db.query('SELECT * FROM batch');
            res.status(200).json({status : 200, availableBatches : batches.rows});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid JWT' });
    }
}

const getAllCourses = async (req,res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const courses = await db.query('SELECT c_name AS course_name, c_code AS course_code, cid AS course_id FROM courses');
            res.status(200).json({status : 200, courses : courses.rows});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid JWT' });
    }
}

module.exports = {getBatches, getAllCourses}