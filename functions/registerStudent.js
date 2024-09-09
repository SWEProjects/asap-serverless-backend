const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // Ensure this is included if needed
};

exports.handler = async (event) => {
    try {
        // Parse the event body, assuming it's a JSON string
        const { firstName, lastName, collegeId, password, secret, rollNumber, semester, deviceId } = event.body;

        // Validate required fields
        if (!firstName || !collegeId || !password || !secret || !rollNumber || !semester || !deviceId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields'
                })
            };
        }

        // Initialize the PostgreSQL client
        const client = new Client(dbConfig);

        await client.connect(); // Connect to the database

        try {
            // Insert data into the students table
            const query = `
                INSERT INTO students (s_first_name, s_last_name, s_college_id, s_roll_number, s_password, s_device_id, s_semester)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;
            const values = [firstName, lastName || null, collegeId, rollNumber, password, deviceId, semester];

            await client.query(query, values);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Student added successfully'
                })
            };
        } catch (err) {
            console.error('Database query error:', err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Internal Server Error'
                })
            };
        } finally {
            await client.end(); // Close the connection
        }
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error'
            })
        };
    }
};
