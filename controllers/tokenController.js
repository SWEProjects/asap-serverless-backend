const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(403).json({ message: 'Token is absent.'});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        const sid = decoded.studentId;
        if (fid){
            return res.status(200).json({ status:true, facultyId:fid });
        } else if (sid) {
            return res.status(200).json({ status:true, studentId:sid });
        }
        return res.status(403).json({ status: false });
    } catch (error) {
        res.status(500).json({ message: 'Invalid JWT' });
    }
}

module.exports = { validateToken }