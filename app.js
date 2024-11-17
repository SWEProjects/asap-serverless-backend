const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config()
const {connectDB} = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuthRoutes');
const facultyAuthRoutes = require('./routes/facultyAuthRoutes');
const facultyManageRoutes = require('./routes/facultyManageRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const resetRoutes = require('./routes/resetRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const QrRoutes = require('./routes/QrRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes.js');
const tokenRoutes = require('./routes/tokenRoutes.js');
const studentManageRoutes = require('./routes/studentManageRoutes')
const commonManageRoutes = require('./routes/commonManageRoutes')
const reportRoutes = require('./routes/reportRoutes')
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
app.use('/attendance', attendanceRoutes)
app.use('/token', tokenRoutes)
app.use('/manage/student', studentManageRoutes)
app.use('/manage', commonManageRoutes)
app.use('/report', reportRoutes)

module.exports.handler = serverless(app);