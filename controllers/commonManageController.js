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
            const batches = await db.query('SELECT id AS batch_id, batch_name, current_sem, batch_start, batch_end FROM batch');
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

const getDepartments = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        try {
            const departments = await db.query('SELECT did AS department_id, d_acronym AS department_code, d_name AS department_name FROM departments');
            res.status(200).json({status : 200, departments : departments.rows});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid JWT' });
    }
}


module.exports = {getBatches, getAllCourses, getDepartments}