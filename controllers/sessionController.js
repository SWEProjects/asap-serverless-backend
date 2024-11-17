const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const prepareStudentListForAttendance = async (sessionId) => {
    try {
        if (!sessionId){
            return res.status(400).json({ message: 'Missing session ID' })
        }
        const sessions = await db.query('SELECT * from sessions WHERE sessid = $1', [sessionId])
        if (!sessions.rows.length){
            return res.status(404).json({ message: 'Session not found' })
        }
        const session = sessions.rows[0];
        db.query('INSERT INTO attendance (session_id, sid) SELECT $4, s.sid FROM students s JOIN students_courses sc ON s.sid = sc.sid WHERE s.s_batch = $1 AND s.s_branch = $2 AND sc.cid = $3;', [session.batch_id, session.did, session.cid, sessionId]);
    } catch (e) {
        throw Error({ error : e, message : 'Error while getting students'})
    }
}

const createSession = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        try {
            const { sessionCourse ,sessionDate, sessionTime, sessionDept, sessionBatch} = req.body;
            if (!sessionCourse || !sessionDate || !sessionTime || !sessionDept || !sessionBatch) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const checkCourseFaculty = await db.query('SELECT * FROM faculty_courses WHERE fid = $1 AND cid = $2',[fid, sessionCourse]);
        if (!checkCourseFaculty.rows.length) {
            return res.status(403).json({ message: 'Not authorized to create session for this course' });
        }
        const result = await db.query('INSERT INTO sessions (cid, sessiondate, did, fid, batch_id) VALUES ($1, $2, $3, $4, $5) RETURNING sessid', [sessionCourse, `${sessionDate} ${sessionTime}`, sessionDept, fid, sessionBatch]);
        const sessionId = result.rows[0].sessid;
        await prepareStudentListForAttendance(sessionId);
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

const getSessions = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        const facultyId = decoded.facultyId
        if (!facultyId){
            return res.status(403).json({ message: 'Not a Faculty' })
        }
        try {
            const sessions = await db.query(`SELECT s.sessid AS session_id, 
                                            f.f_first_name AS faculty_first_name, 
                                            f.f_last_name AS faculty_last_name, 
                                            s.sessiondate AS session_time, 
                                            c.c_name AS course_name, 
                                            c.c_code AS course_code,
                                            d.d_name AS dept_name,
                                            d.d_acronym AS dept_code,
                                            b.batch_name AS batch_name,
                                            b.current_sem AS session_sem,
                                            s.is_active AS session_open
                                            FROM sessions s 
                                            JOIN courses c ON s.cid = c.cid 
                                            JOIN departments d ON s.did = d.did 
                                            JOIN batch b ON s.batch_id = b.id 
                                            JOIN faculties f ON f.fid = s.fid`);
            const formattedSessions = sessions.rows.map(session => {
                const sessionDate = new Date(session.session_time);
                const formattedDate = sessionDate.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).replace(',','').toUpperCase();
                return { ...session, session_time: formattedDate };
            });
            const openSessions = formattedSessions.filter((session)=>session.session_open)
            const closedSessions = formattedSessions.filter((session)=>!session.session_open)
            const sortedSessions = [...openSessions,...closedSessions]
            res.status(200).json({status : 200, sessions : sortedSessions});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid JWT' });
    }
}

const getSession = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        const facultyId = decoded.facultyId
        if (!facultyId){
            return res.status(403).json({ message: 'Not a Faculty' })
        }
        try {
            const {sessionId} = req.body;
            if (!sessionId){
                return res.status(400).json({ message: 'Missing session ID' })
            }
            const sessions = await db.query(`SELECT s.sessid AS session_id, 
                f.f_first_name AS faculty_first_name, 
                f.f_last_name AS faculty_last_name, 
                s.sessiondate AS session_time, 
                c.c_name AS course_name, 
                c.c_code AS course_code,
                d.d_name AS dept_name,
                d.d_acronym AS dept_code,
                b.batch_name AS batch_name,
                b.current_sem AS session_sem,
                s.is_active AS session_open,
                s.cid AS course_id,
                s.did AS department_id,
                s.batch_id AS batch_id
                FROM sessions s 
                JOIN courses c ON s.cid = c.cid 
                JOIN departments d ON s.did = d.did 
                JOIN batch b ON s.batch_id = b.id 
                JOIN faculties f ON f.fid = s.fid
                WHERE s.sessid = $1`, [sessionId]);

            if (!sessions.rows.length){
                return res.status(404).json({ message: 'Session not found' })
            }

            const formattedSessions = sessions.rows.map(session => {
                const sessionDate = new Date(session.session_time);
                const formattedDate = sessionDate.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).replace(',','').toUpperCase();
                return { ...session, session_time: formattedDate };
            });
            const students = await db.query(`SELECT s.s_first_name AS first_name, 
                                        s.s_last_name AS last_name, 
                                        s.s_roll_number AS roll_number, 
                                        a.marked_at AS marked_at,
                                        a.semester AS semester
                                        FROM students s 
                                        JOIN students_courses sc ON s.sid = sc.sid 
                                        JOIN attendance a ON s.sid = a.sid AND a.session_id = $4 
                                        WHERE s.s_batch = $1 AND s.s_branch = $2 AND sc.cid = $3`, [formattedSessions[0].batch_id, formattedSessions[0].department_id, formattedSessions[0].course_id, sessionId]);
            const presentStudents = students.rows.filter((student)=>student.marked_at);
            const presentAmount = presentStudents.length;
            const totalAmount = students.rows.length
            return res.status(200).json({
                status : 200,
                session : formattedSessions[0],
                students : students.rows,
                presentAmount : presentAmount,
                totalAmount : totalAmount
            })
        } catch (e) {
            res.status(500).json({ message: error.message });
        }
    } catch (e) {
        return res.status(401).json({ message: 'Invalid JWT' });
    }
}

module.exports = {createSession, openSession, closeSession, deleteSession, editSession, getSessions, getSession}