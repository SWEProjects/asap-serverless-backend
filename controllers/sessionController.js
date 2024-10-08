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

const openSession = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        if (!fid){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const checkSession = await db.query('SELECT * FROM sessions WHERE sessid = $1',[sessionId]);
            if (!checkSession.rows.length) {
                return res.status(403).json({ message: 'Session not found' });
            }
            if (checkSession.rows[0].is_active){
                return res.status(403).json({ message: 'Session is already open' });
            }
            await db.query('UPDATE sessions SET is_active = true WHERE sessid = $1', [sessionId]);
            return res.status(200).json({
                success : true,
                message: 'Session opened successfully'
            })
        } catch (e) { 
            return res.status(500).json({ message: 'Failed to open session'})
        }
    } catch (e) {
        return res.status(403).json({ message: 'Not a Faculty' })
    } 
}

const closeSession = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        if (!fid){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const checkSession = await db.query('SELECT * FROM sessions WHERE sessid = $1',[sessionId]);
            if (!checkSession.rows.length) {
                return res.status(403).json({ message: 'Session not found' });
            }
            if (!checkSession.rows[0].is_active){
                return res.status(403).json({ message: 'Session is already closed' });
            }
            await db.query('UPDATE sessions SET is_active = false WHERE sessid = $1', [sessionId]);
            return res.status(200).json({
                success : true,
                message: 'Session closed successfully'
            })
        } catch (e) { 
            return res.status(500).json({ message: 'Failed to close session' , e : e})
        }
    } catch (e) {
        return res.status(403).json({ message: 'Not a Faculty' })
    } 
}

const deleteSession = async (req,res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        if (!fid){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const checkSession = await db.query('SELECT * FROM sessions WHERE sessid = $1',[sessionId]);
            if (!checkSession.rows.length) {
                return res.status(403).json({ message: 'Session not found' });
            }
            await db.query('DELETE FROM sessions WHERE sessid = $1', [sessionId]);
            return res.status(200).json({
                success : true,
                message: 'Session deleted successfully'
            })
        } catch (e) { 
            return res.status(500).json({ message: 'Failed to delete session' , e : e})
        }
    } catch (e) {
        return res.status(403).json({ message: 'Not a Faculty' })
    } 
}

const editSession = async (req,res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        if (!fid) {
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        try {
            const {sessionId, sessionCourse ,sessionDate, sessionTime, sessionDept} = req.body;
            if (!sessionCourse || !sessionDate || !sessionTime || !sessionDept) {
                return res.status(400).json({ message: 'Missing required fields' });
            }


            const checkCourseFaculty = await db.query('SELECT * FROM faculty_courses WHERE fid = $1 AND cid = $2',[fid, sessionCourse]);
            if (!checkCourseFaculty.rows.length) {
                return res.status(403).json({ message: 'Not authorized to edit session for this course' });
            }


            const checkSession = await db.query('SELECT * FROM sessions WHERE sessid = $1',[sessionId]);
            if (!checkSession.rows.length) {
                return res.status(403).json({ message: 'Session not found' });
            }

            
            await db.query('UPDATE sessions SET cid = $1, sessiondate = $2, sessiontime = $3, did = $4 WHERE sessid = $5', [sessionCourse, sessionDate, sessionTime, sessionDept, sessionId]);
            return res.status(200).json({
                success : true,
                message: 'Session updated successfully'
            })
        } catch (e) {
            return res.status(500).json({ message: 'Failed to create session'})
        }
    } catch (e) {
        return res.status(403).json({ message: 'Not a Faculty' })
    }
}

module.exports = {createSession, openSession, closeSession, deleteSession, editSession}