import { execute } from './database.js'
import { addTags } from '../validation.js'

async function createThread (title, content, userId, unitCode) {
    await execute(`
        INSERT INTO threads(title, thread, created, last_reply, user_id, unit_code, positive, negative) 
        VALUES (
            '${addTags(title)}', 
            '${JSON.stringify({ content: addTags(content) })}', 
            NOW(), NOW(), 
            ${userId}, 
            '${unitCode}', 
            0, 
            0
        )
    `)
}

async function getThreadById (id) {
    const thread = execute(`SELECT id FROM threads WHERE id=${id}`)
    return thread[0]
}

export {
    createThread,
    getThreadById
}
