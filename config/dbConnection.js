const mysql = require('mysql2');
const logger = require('../utils/pino');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    dateStrings: true
}).promise();


conn.connect().then(() => logger.info("DB Connected")).catch((error) => logger.error(error.message))



module.exports = conn;