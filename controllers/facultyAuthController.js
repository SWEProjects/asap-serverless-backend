const db = require('../config/db');


const loginFaculty = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM faculties');
        res.json({
            result : result.rows,
            message: 'faculty Login'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {loginFaculty};