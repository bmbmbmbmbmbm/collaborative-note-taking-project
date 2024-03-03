const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USERNAME,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true
})

async function query(statement) {
    try {
        const [result, _] = await pool.query(statement)
        return result
    } catch(e) {
        console.error(e)
    }
}

async function execute(statement) {
    try {
        const [result, _] = await pool.execute(statement)
        return result
    } catch(e) {
        console.error(e)
    }
}

module.exports = {
    query,
    execute
}