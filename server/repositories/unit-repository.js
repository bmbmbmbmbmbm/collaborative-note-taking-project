import { query } from './database.js'

async function getUserUnits (userId) {
    return await query(`
        SELECT units.code, units.title FROM units 
        INNER JOIN enrolments ON units.code=enrolments.unit_code
        INNER JOIN users ON users.id=enrolments.user_id 
        WHERE users.id='${userId}';
    `)
}

export {
    getUserUnits
}
