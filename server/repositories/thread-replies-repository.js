import { execute, query } from './database.js'
import { addTags } from '../validation.js'

async function getComment (id) {
    const comment = await query(`SELECT * FROM replies WHERE id=${id}`)
    return comment[0]
}

async function addReplyToComment (content, commentId, userId, threadId) {
    await execute(`
        INSERT INTO replies(reply, replyTo, user_id, thread_id, created) 
        VALUES (
            '${JSON.stringify({ content: addTags(content) })}', 
            ${commentId}, 
            ${userId}, 
            ${threadId}, 
            NOW()
        );
    `)
}

async function addReplyToThread (content, userId, threadId) {
    await execute(`
        INSERT INTO replies(reply, user_id, thread_id, created) 
        VALUES (
            '${JSON.stringify({ content: addTags(content) })}', 
            ${userId}, 
            ${threadId}, 
            NOW()
        );
    `)
}

export {
    getComment,
    addReplyToComment,
    addReplyToThread
}
