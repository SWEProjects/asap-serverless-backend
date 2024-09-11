const db = require('../config/db');

const createSession = async (req, res) => {
    try {
        const { sessionCourse ,sessionDate, sessionTime} = req.body;
        if (!sessionCourse || !sessionDate || !sessionTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await db.query('INSERT INTO sessions (session_course, session_date, session_time) VALUES ($1, $2, $3)', [sessionCourse, sessionDate, sessionTime]);
    } catch (e) {

    }
}