const db = require('../config/db');


const loginStudent = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students');
        res.json({
            result : result.rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginStudent};