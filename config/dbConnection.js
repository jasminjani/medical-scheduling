const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    dateStrings: true
}).promise();


// conn.connect().then(()=> console.log('DB Connected')).catch((err)=> console.log(err))


module.exports = conn;