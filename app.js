const express = require('express');
require('dotenv').config()
const {connectDB} = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuthRoutes');
const facultyAuthRoutes = require('./routes/facultyAuthRoutes');
const facultyManageRoutes = require('./routes/facultyManageRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const resetRoutes = require('./routes/resetRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const QrRoutes = require('./routes/QrRoutes');
const serverless = require('serverless-http');
connectDB();

const app = express();
app.use(express.json());
app.use('/auth/student', studentAuthRoutes);
app.use('/auth/faculty', facultyAuthRoutes);
app.use('/session', sessionRoutes);
app.use('/manage/faculty', facultyManageRoutes);
app.use('/reset', resetRoutes)
app.use('/password', passwordRoutes)
app.use('/qr', QrRoutes)

module.exports.handler = serverless(app);