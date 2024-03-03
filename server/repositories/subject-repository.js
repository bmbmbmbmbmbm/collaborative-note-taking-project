const { query } = require("../database")

async function getSubject(id) {
    const results = await query(`SELECT id FROM subjects WHERE id=${id}`);
    return results[0]
}

module.exports = {
    getSubject
}