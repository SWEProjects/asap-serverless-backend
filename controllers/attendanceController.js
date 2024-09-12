const db = require('../config/db');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const CRYPTO_SECRET = process.env.CRYPTO_SECRET
const JWT_SECRET = process.env.JWT_SECRET

const markAttendanceByQR = async (req, res) => {
    try {
        const scannedTime = Date.now()
        const token = req.headers.authorization;
        if (!token){
            return res.status(401).json({ message: 'Not authorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const sid = decoded.studentId;
        if (!sid){
            return res.status(401).json({ message: 'Not a student' });
        }
        try {
            const {QRText} = req.body;
            if (!QRText) {
                return res.status(400).json({ message: 'Missing QR text' });
            }
            const [iv, encrypted] = QRText.split(':');
            const decipher = crypto.createDecipheriv('aes-256-cbc', CRYPTO_SECRET , Buffer.from(iv, 'hex'));
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            const QRTime = decrypted.split('$')[2];
            const isValidated = scannedTime - QRTime <= 10*1000;
            if (!isValidated) {
                return res.status(403).json({ message: 'QR code expired' });
            }
            const sessionId = decrypted.split('$')[0];
            const checkSession = await db.query('SELECT * FROM sessions WHERE sessid = $1 AND is_active = true',[sessionId]);
            if (!checkSession.rows.length) {
                return res.status(404).json({ message: 'Session not found or not active' });
            }
            const checkAttendance = await db.query('SELECT * FROM attendance WHERE session_id = $1 AND sid = $2',[sessionId, sid]);
            if (checkAttendance.rows.length) {
                return res.status(403).json({ message: 'Attendance already marked for this session' });
            }
            await db.query('INSERT INTO attendance (session_id, sid) VALUES ($1, $2)',[sessionId, sid]);
            return res.status(200).json({ success : true, message: 'Attendance marked successfully' });
        } catch (err) { 
            return res.status(500).json({ message: 'Unable to mark attendance, Please try again' });
        }
    } catch (err) {
        return res.status(401).json({message : 'Not authorized'})
    }
}

module.exports = {markAttendanceByQR}