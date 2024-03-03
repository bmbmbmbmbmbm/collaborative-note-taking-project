import { query } from './database.js'

async function getUnits (userId) {
    return await query(`
        SELECT units.code, units.title, users.subject_id FROM units 
        INNER JOIN enrolments ON units.code=enrolments.unit_code 
        INNER JOIN users ON enrolments.user_id=users.id 
        WHERE enrolments.user_id=${userId}
    `)
}

export {
    getUnits
}
