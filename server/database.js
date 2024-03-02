const mysql = require('mysql2');
require('dotenv').config();

module.exports = mysql.createConnection({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USERNAME,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE
});