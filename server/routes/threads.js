const express = require('express');
const db = require('../database');
const auth = require('../verify');
const v = require('../validation.js')

const router = express.Router();

router.post('/create', auth.verifyToken, async function (req, res) {
    try {
        const { title, unitCode, content } = req.body;
        const userId = req.userId;
        if (v.validTitle(title) && v.validUnitCode(unitCode) && v.validContent(content)) {
            const unit = await db.query(`SELECT code FROM units WHERE code='${unitCode}'`);
            if (unit[0].length === 1) {
                const newTitle = v.addTags(title);
                const insert = `INSERT INTO threads(title, thread, created, last_reply, user_id, unit_code, positive, negative) 
                                VALUES ('${newTitle}', '${JSON.stringify({ "content": v.addTags(content) })}', NOW(), NOW(), ${userId}, '${unitCode}', 0 , 0)`;
                await db.query(insert);
                const id = await db.query(`SELECT id FROM threads WHERE title='${newTitle}' AND user_id=${userId} ORDER BY created DESC`);
                if (id[0].length > 0) {
                    res.status(200).json({ id: id[0][id[0].length - 1].id });
                } else {
                    res.status(500).json({ message: "failed to create thread" });
                }
            } else {
                res.status(400).json({ message: "invalid unit" })
            }
        } else {
            res.status(400).json({ message: "invalid thread details" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
})

router.post('/add-reply', auth.verifyToken, async function (req, res) {
    try {
        const { content, threadId, commentId } = req.body;
        const userId = req.userId;
        if (v.validContent(content) && v.validId(threadId)) {
            const select = `SELECT id FROM threads WHERE id=${threadId}`;
            const thread = await db.query(select);
            const newContent = v.addTags(content);
            if (v.validId(commentId)) {
                const select2 = `SELECT id, thread_id FROM replies WHERE id=${commentId}`;
                const comment = await db.query(select2);
                if (comment[0].length === 1 && thread[0].length === 1) {
                    if (comment[0][0].thread_id === thread[0][0].id) {
                        const insert = `INSERT INTO replies(reply, replyTo, user_id, thread_id, created) 
                                        VALUES ('${JSON.stringify({ "content": newContent })}', ${commentId}, ${userId}, ${threadId}, NOW());`
                        await db.query(insert);
                        res.status(200).json({ message: "added reply" });
                    } else {
                        res.status(400).json({ message: "thread or comment does not exist" });
                    }
                } else {
                    res.status(400).json({ message: "thread or comment does not exist" });
                }
            } else {
                if (thread[0].length === 1) {
                    const insert = `INSERT INTO replies(reply, user_id, thread_id, created) 
                                    VALUES ('${JSON.stringify({ "content": newContent })}', ${userId}, ${threadId}, NOW());`
                    await db.query(insert);
                    res.status(200).json({ message: "added reply" });
                } else {
                    res.status(400).json({ message: "thread does not exist" });
                }
            }
        } else {
            res.status(400).json({ message: "thread or comment does not exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});

router.get('/dashboard/:id', auth.verifyToken, async function (req, res) {
    try {
        const user = req.params.id;
        if (v.validUsername(user)) {
            const userRecord = await db.query(`SELECT * FROM users WHERE username='${user}'`)
            if (userRecord[0].length !== 0) {
                const query = `SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, units.title AS unit_title, units.code FROM threads INNER JOIN units 
                               ON units.code=threads.unit_code WHERE user_id=${userRecord[0][0].id}`
                var threads = await db.query(query);
                v.removeTagsFromTitles(threads);
                res.status(200).json(threads[0]);
            } else {
                res.status(400).json({ message: 'invalid credentials' });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});

router.get('/:id/view', auth.verifyToken, async function (req, res) {
    try {
        const unitCode = req.params.id;
        const userId = req.userId;
        if (v.validUnitCode(unitCode)) {
            const enrolments = await db.query(`SELECT unit_code FROM enrolments WHERE user_id=${userId}`);
            if (enrolments[0].length > 0) {
                var hasEnrolled = false;
                for (var i = 0; i < enrolments[0].length; ++i) {
                    if (enrolments[0][i].unit_code === unitCode) {
                        hasEnrolled = true;
                        break;
                    }
                }
                if (hasEnrolled) {
                    const record = await db.query(`SELECT * FROM units WHERE code='${unitCode}'`);
                    if (record[0].length > 0) {
                        const userThreads = await db.query(`SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, users.username FROM threads INNER JOIN users ON threads.user_id=users.id WHERE unit_code='${unitCode}'`);
                        res.status(200).json(userThreads[0]);
                    } else {
                        res.status(400).json({ message: "unit does not exist" });
                    }
                }
                else {
                    res.status(400).json({ message: "not enrolled in unit" })
                }
            } else {
                res.status(400).json({ messsage: "not enrolled in units" })
            }
        } else {
            res.status(400).json({ message: "unit does not exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});

router.get('/view/:id', auth.verifyToken, async function (req, res) {
    try {
        const userId = req.userId;
        if (v.validId(req.params.id)) {
            const select = `SELECT threads.title, threads.thread, threads.created, threads.last_reply, threads.unit_code, users.username 
                            FROM threads INNER JOIN users ON threads.user_id=users.id WHERE threads.id=${req.params.id};`;
            var record = await db.query(select);
            const enrolled = await db.query(`SELECT unit_code FROM enrolments WHERE user_id=${userId}`);
            if (enrolled[0].length > 0) {
                var isEnrolled = false;
                for (var i = 0; i < enrolled[0].length; ++i) {
                    if (enrolled[0][i].unit_code === record[0][0].unit_code) {
                        isEnrolled = true;
                        break;
                    }
                }
                if (isEnrolled) {
                    record[0][0].thread.content = v.removeTags(record[0][0].thread.content);
                    v.removeTags(record[0][0].title)
                    res.status(200).json(record[0][0]);
                } else {
                    res.status(400).json({ message: "not enrolled in unit" });
                }
            } else {
                res.status(400).json({ message: "not enrolled in unit" });
            }

        } else {
            res.status(400).json({ message: "invalid thread identifier" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});

router.get('/view/:id/replies', auth.verifyToken, async function (req, res) {
    try {
        const threadId = req.params.id;
        const userId = req.userId;
        if (v.validId(threadId)) {
            const thread = await db.query(`SELECT unit_code FROM threads WHERE id=${threadId}`);
            if (thread[0].length === 1) {
                const enrolled = await db.query(`SELECT * FROM enrolments WHERE user_id=${userId} AND unit_code='${thread[0][0].unit_code}'`)
                if (enrolled[0].length === 1) {
                    const select1 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NULL`;
                    const comments = await db.query(select1);
                    v.removeTagsFromComments(comments);
                    const select2 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NOT NULL`;
                    const replies = await db.query(select2);
                    v.removeTagsFromComments(replies);
                    res.status(200).json({ comments: comments[0], replies: replies[0] });
                }
                else {
                    res.status(400).json({ message: "not enrolled in unit" });
                }
            } else {
                res.status(400).json({ message: "invalid thread identifier" });
            }
        } else {
            res.status(400).json({ message: "invalid thread identifier"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" })
    }
})

module.exports = router;