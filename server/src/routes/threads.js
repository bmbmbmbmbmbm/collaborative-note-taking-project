import { Router } from 'express'
import { query as _query } from '../data/database.js'
import verifyToken from '../verify.js'
import {
    validUnitCode, validId, validUsername,
    removeTagsFromTitles, removeTags, removeTagsFromComments
} from '../validation.js'
import { createThread, reply } from '../services/thread-service.js'

const router = Router()

router.post('/create', verifyToken, async (req, res) => {
    try {
        createThread(req)
        res.status(200)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.post('/add-reply', verifyToken, async (req, res) => {
    try {
        await reply(req)
        res.status(200)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.get('/dashboard/:id', verifyToken, async (req, res) => {
    try {
        const user = req.params.id
        if (validUsername(user)) {
            const userRecord = await _query(`SELECT * FROM users WHERE username='${user}'`)
            if (userRecord[0].length !== 0) {
                const query = `SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, units.title AS unit_title, units.code FROM threads INNER JOIN units 
                               ON units.code=threads.unit_code WHERE user_id=${userRecord[0][0].id}`
                const threads = await _query(query)
                removeTagsFromTitles(threads)
                res.status(200).json(threads[0])
            } else {
                res.status(400).json({ message: 'invalid credentials' })
            }
        } else {
            res.status(400).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        console.trace(err)
        res.status(400).json({ message: 'server error' })
    }
})

router.get('/:id/view', verifyToken, async (req, res) => {
    try {
        const unitCode = req.params.id
        const userId = req.userId
        if (validUnitCode(unitCode)) {
            const enrolments = await _query(`SELECT unit_code FROM enrolments WHERE user_id=${userId}`)
            if (enrolments[0].length > 0) {
                let hasEnrolled = false
                for (let i = 0; i < enrolments[0].length; ++i) {
                    if (enrolments[0][i].unit_code === unitCode) {
                        hasEnrolled = true
                        break
                    }
                }
                if (hasEnrolled) {
                    const record = await _query(`SELECT * FROM units WHERE code='${unitCode}'`)
                    if (record[0].length > 0) {
                        const userThreads = await _query(`SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, users.username FROM threads INNER JOIN users ON threads.user_id=users.id WHERE unit_code='${unitCode}'`)
                        res.status(200).json(userThreads[0])
                    } else {
                        res.status(400).json({ message: 'unit does not exist' })
                    }
                } else {
                    res.status(400).json({ message: 'not enrolled in unit' })
                }
            } else {
                res.status(400).json({ messsage: 'not enrolled in units' })
            }
        } else {
            res.status(400).json({ message: 'unit does not exist' })
        }
    } catch (err) {
        console.trace(err)
        res.status(400).json({ message: 'server error' })
    }
})

router.get('/view/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId
        if (validId(req.params.id)) {
            const select = `SELECT threads.title, threads.thread, threads.created, threads.last_reply, threads.unit_code, users.username 
                            FROM threads INNER JOIN users ON threads.user_id=users.id WHERE threads.id=${req.params.id};`
            const record = await _query(select)
            const enrolled = await _query(`SELECT unit_code FROM enrolments WHERE user_id=${userId}`)
            if (enrolled[0].length > 0) {
                let isEnrolled = false
                for (let i = 0; i < enrolled[0].length; ++i) {
                    if (enrolled[0][i].unit_code === record[0][0].unit_code) {
                        isEnrolled = true
                        break
                    }
                }
                if (isEnrolled) {
                    record[0][0].thread.content = removeTags(record[0][0].thread.content)
                    removeTags(record[0][0].title)
                    res.status(200).json(record[0][0])
                } else {
                    res.status(400).json({ message: 'not enrolled in unit' })
                }
            } else {
                res.status(400).json({ message: 'not enrolled in unit' })
            }
        } else {
            res.status(400).json({ message: 'invalid thread identifier' })
        }
    } catch (err) {
        console.trace(err)
        res.status(400).json({ message: 'server error' })
    }
})

router.get('/view/:id/replies', verifyToken, async (req, res) => {
    try {
        const threadId = req.params.id
        const userId = req.userId
        if (validId(threadId)) {
            const thread = await _query(`SELECT unit_code FROM threads WHERE id=${threadId}`)
            if (thread[0].length === 1) {
                const enrolled = await _query(`SELECT * FROM enrolments WHERE user_id=${userId} AND unit_code='${thread[0][0].unit_code}'`)
                if (enrolled[0].length === 1) {
                    const select1 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NULL`
                    const comments = await _query(select1)
                    removeTagsFromComments(comments)
                    const select2 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NOT NULL`
                    const replies = await _query(select2)
                    removeTagsFromComments(replies)
                    res.status(200).json({ comments: comments[0], replies: replies[0] })
                } else {
                    res.status(400).json({ message: 'not enrolled in unit' })
                }
            } else {
                res.status(400).json({ message: 'invalid thread identifier' })
            }
        } else {
            res.status(400).json({ message: 'invalid thread identifier' })
        }
    } catch (err) {
        console.trace(err)
        res.status(400).json({ message: 'server error' })
    }
})

export default router
