const db = require('../config/db');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const getReport = async (req,res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        const facultyId = decoded.facultyId;
        if (!facultyId){
            return res.status(403).json({ message: 'Not a Faculty' })
        }
        const {courseId, departmentId, batchId} = req.body;
        if (!courseId ||!departmentId ||!batchId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const students = await db.query(`SELECT st.s_first_name AS first_name,
                                        st.s_last_name AS last_name,
                                        st.s_roll_number AS roll_number,
                                        (SELECT COUNT(*) FROM attendance a 
                                        JOIN sessions se ON a.session_id = se.sessid 
                                        JOIN students s ON s.sid = a.sid 
                                        WHERE se.did = $2 AND se.cid = $1 AND se.batch_id = $3 AND s.sid = st.sid  AND a.marked_at IS NOT NULL) AS total_present
                                        FROM students st
                                        JOIN attendance a ON st.sid = a.sid 
                                        JOIN sessions se ON a.session_id = se.sessid
                                        WHERE se.cid = $1 AND se.did = $2 AND se.batch_id = $3`,[courseId, departmentId, batchId]);
        const sessions = await db.query(`SELECT COUNT(sessid) AS total_sessions 
                                        FROM sessions 
                                        WHERE cid = $1 AND did = $2 AND batch_id = $3`, [courseId, departmentId, batchId]);
        const totalSessions = sessions.rows[0].total_sessions;
        res.status(200).json({
            status : 200,
            students : students.rows,
            totalSessions : totalSessions
        })
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', e })
    }
}

const getReportForStudents = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token){
            return res.status(403).json({ message: 'No JWT Provided' })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        const studentId = decoded.studentId;
        if (!studentId){
            return res.status(403).json({ message: 'Not a Student' })
        }
        const coursesReport = await db.query(`SELECT c.c_name AS course_name,
                                            c.c_code AS course_code,
                                                (SELECT COUNT(*) 
                                                FROM sessions se
                                                WHERE se.cid = c.cid AND se.did = d.did AND se.batch_id = b.id) AS total_sessions,
                                                (SELECT COUNT(*) 
                                                FROM attendance a 
                                                JOIN sessions se ON a.session_id = se.sessid AND a.sid = $1
                                                WHERE se.cid = c.cid AND se.did = d.did AND se.batch_id = b.id AND s.sid = $1 AND a.marked_at IS NOT NULL) AS total_present
                                            FROM students s 
                                            JOIN batch b ON s.s_batch = b.id
                                            JOIN students_courses sc ON sc.sid = s.sid
                                            JOIN courses c ON sc.cid = c.cid
                                            JOIN departments d ON d.did = s.s_branch
                                            WHERE s.sid = $1`, [studentId]);
        res.status(200).json({
            status : 200,
            coursesReport : coursesReport.rows
        })
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', e })
    }
}

module.exports = { getReport, getReportForStudents }