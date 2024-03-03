import { query } from './database.js'

async function getSubject (id) {
    const results = await query(`SELECT id FROM subjects WHERE id=${id}`)
    return results[0]
}

export {
    getSubject
}
