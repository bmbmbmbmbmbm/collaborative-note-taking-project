import { query, execute } from './database.js'

async function getUserByEmail (email) {
    const results = await query(`SELECT * FROM users WHERE email='${email}'`)
    return results[0]
}

async function getUserByName (username) {
    const results = await query(`SELECT * FROM users WHERE username='${username}'`)
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

async function removeUser (email) {
    return await execute(`UPDATE users SET toRemove=TRUE WHERE email='${email}';`)
}

export {
    getUserByEmail,
    getUserByName,
    getUsers,
    addUser,
    removeUser
}
