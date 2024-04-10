const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_DATABASE || 'medical_scheduling',
    dateStrings: true
}).promise();


conn.connect().then(()=> console.log('DB Connected')).catch((err)=> console.log(err))


module.exports = conn;