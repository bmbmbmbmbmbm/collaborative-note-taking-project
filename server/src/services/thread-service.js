import { getUnitsByCode } from '../data/unit-repository.js'
import { validTitle, validUnitCode, validContent, validId } from '../validation.js'
import { createThread as addThread, getThreadById } from '../data/thread-repository.js'
import { addReplyToComment, addReplyToThread, getComment } from '../data/thread-replies-repository.js'

const service = 'thread-service'

async function createThread ({ userId, body }) {
    const { title, unitCode, content } = body
    if (!validTitle(title) || !validUnitCode(unitCode) || !validContent(content)) {
        throw new Error(`${service}::createThread() invalid title, code, or content`)
    }
    const unit = await getUnitsByCode(unitCode)
    if (!unit) {
        throw new Error(`${service}::createThread() invalid unit code`)
    }
    await addThread(title, content, userId, unitCode)
}

async function reply ({ userId, body }) {
    const { content, threadId, commentId } = body
    if (!validContent(content) || !validId(threadId)) {
        throw new Error(`${service}::reply() invalid content or id`)
    }
    const thread = await getThreadById(threadId)
    if (!thread) {
        throw new Error(`${service}::reply() thread does not exist`)
    } else if (validId(commentId)) {
        const comment = await getComment(commentId)
        if (!comment) {
            throw new Error(`${service}::reply() comment does not exist`)
        }
        if (comment.thread_id !== thread.id) {
            throw new Error(`${service}::reply() uh oh`)
        }
        await addReplyToComment(content, commentId, userId, threadId)
    } else {
        await addReplyToThread(content, userId, threadId)
    }
}

export {
    createThread,
    reply
}
