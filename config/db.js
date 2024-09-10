const { Pool } = require('pg');
require('dotenv').config()
const pool = new Pool({
    connectionString: process.env.DB_URI,
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL connected');
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        process.exit(1);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    connectDB,
};