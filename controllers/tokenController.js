const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(403).json({ message: 'No Token Provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Invalid Token Format' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const fid = decoded.facultyId;
    const sid = decoded.studentId;

    if (fid) {
      return res.status(200).json({ status: true, facultyId: fid });
    } else if (sid) {
      return res.status(200).json({ status: true, studentId: sid });
    }
    
    return res.status(403).json({ status: false, message: 'Invalid User' });
  } catch (error) {
    return res.status(500).json({ message: 'Invalid JWT', error: error.message });
  }
};

module.exports = { validateToken };
