const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const createSession = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        try {
            const { sessionCourse ,sessionDate, sessionTime, sessionDept} = req.body;
            if (!sessionCourse || !sessionDate || !sessionTime || !sessionDept) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const checkCourseFaculty = await db.query('SELECT * FROM faculty_courses WHERE fid = $1 AND cid = $2',[fid, sessionCourse]);
        if (!checkCourseFaculty.rows.length) {
            return res.status(403).json({ message: 'Not authorized to create session for this course' });
        }
        const result = await db.query('INSERT INTO sessions (cid, sessiondate, sessiontime, did, fid) VALUES ($1, $2, $3, $4, $5) RETURNING sessid', [sessionCourse, sessionDate, sessionTime, sessionDept, fid]);
        return res.status(200).json({
            success : true,
            message: 'Session created successfully',
            sessionId : result.rows[0].sessid
        })
        } catch (e) {
            return res.status(500).json({ message: 'Failed to create session'})
        }
    } catch (e) {
        return res.status(403).json({ message: 'Not a Faculty' })
    }
}

module.exports = {createSession}