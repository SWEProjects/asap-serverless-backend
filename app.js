const express = require('express');
require('dotenv').config()
const {connectDB} = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuthRoutes');
const facultyAuthRoutes = require('./routes/facultyAuthRoutes');
const serverless = require('serverless-http');
connectDB();

const app = express();
app.use(express.json());
app.use('/auth/student', studentAuthRoutes);
app.use('/auth/faculty', facultyAuthRoutes);

module.exports.handler = serverless(app);