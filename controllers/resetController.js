const db = require('../config/db');

const dbReset = async (req, res) => {
    try {
        await db.query('DELETE FROM students');
        await db.query('DELETE FROM faculties');
        res.json({ message: 'Database reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {dbReset}