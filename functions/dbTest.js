const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,  // Add this if you're using a non-default port
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        try {
            await client.query('INSERT INTO students (s_first_name) VALUES ($1)', ['abc']);
            return 'abc';
        } catch (err) {
            return err;
        } finally {
            await client.end();
        }
    } catch (err) {
        return err;
    }
};
