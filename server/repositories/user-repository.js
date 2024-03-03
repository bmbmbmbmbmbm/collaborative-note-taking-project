import { query, execute } from './database.js'

async function getUser (email) {
    const results = await query(`SELECT * FROM users WHERE email='${email}'`)
    return results[0]
}

async function getUsers (email) {
    return await query(`SELECT * FROM users WHERE email='${email}'`)
}

async function addUser (email, password, subjectId) {
    return await execute(`
        INSERT INTO users(username, email, password, moderator, admin, subject_id) 
        VALUES('${email.substring(0, email.indexOf('@'))}', '${email}', '${password}', FALSE, FALSE, ${subjectId})
    `)
}

export {
    getUser,
    getUsers,
    addUser
}
