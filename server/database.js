const mysql = require('mysql2/promise');
require('dotenv').config();

console.log(process.env.MY_SQL_USERNAME)

module.exports = mysql.createPool({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USERNAME,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    debug: true
});