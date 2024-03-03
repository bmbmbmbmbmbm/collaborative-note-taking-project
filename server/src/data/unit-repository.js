import { query } from './database.js'

async function getUserUnits (userId) {
    return await query(`
        SELECT units.code, units.title FROM units 
        INNER JOIN enrolments ON units.code=enrolments.unit_code
        INNER JOIN users ON users.id=enrolments.user_id 
        WHERE users.id='${userId}';
    `)
}

async function getUnitsByCode (unitCode) {
    const units = await query(`SELECT code FROM units WHERE code='${unitCode}'`)
    return units[0]
}

export {
    getUserUnits,
    getUnitsByCode
}
