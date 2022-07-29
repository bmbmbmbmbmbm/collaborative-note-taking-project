const express = require('express');
const db = require('../database');
const auth = require('../verify');

const router = express.Router();

function replaceWithTag(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "<aaa>";
            case "\x08":
                return "<bbb>";
            case "\x09":
                return "<ccc>";
            case "\x1a":
                return "<ddd>";
            case "\n":
                return "<eee>";
            case "\r":
                return "<fff>";
            case "\"":
                return "<ggg>";
            case "'":
                return "<hhh>";
            case "\\":
                return "<iii>";
            case "%":
                return "<jjj>";
        }
    });
}

function replaceTag(str) {
    return str.replace(/<aaa>|<bbb>|<ccc>|<ddd>|<eee>|<fff>|<ggg>|<hhh>|<iii>|<jjj>/g, function (sub) {
        switch (sub) {
            case "<aaa>":
                return "\0";
            case "<bbb>":
                return "\x08";
            case "<ccc>":
                return "\x09";
            case "<ddd>":
                return "\x1a";
            case "<eee>":
                return "\n";
            case "<fff>":
                return "\r";
            case "<ggg>":
                return "\"";
            case "<hhh>":
                return "'";
            case "<iii>":
                return "\\";
            case "<jjj>":
                return "%";
        }
    })
}

router.post('/create', auth.verifyToken, async function (req, res) {
    try {
        const { title, unitCode, content } = req.body;
        const userId = req.userId;
        if (userId && title && title.length >= 6 && title.length <= 64 && unitCode && content && content.split(" ").length <= 1000) {
            const insert = `INSERT INTO threads(title, thread, created, last_reply, user_id, unit_code, positive, negative) 
                                VALUES ('${title}', '${JSON.stringify({ "content": replaceWithTag(content) })}', NOW(), NOW(), ${userId}, '${unitCode}', 0 , 0)`;
            await db.promise().query(insert);
            res.status(200);

        } else {
            res.status(400);
        }
    } catch (err) {
        console.log(err);
        res.status(500);
    }
})

router.post('/add-reply', auth.verifyToken, async function (req, res) {
    try {
        const { content, threadId, commentId } = req.body;
        const userId = req.userId;
        console.log(content.length, content.split(" ").length, +threadId);
        if (content.length > 0 && content.split(" ").length <= 1000 && Number.isInteger(+threadId)) {
            const select = `SELECT id FROM threads WHERE id=${threadId}`;
            const thread = await db.promise().query(select);
            if (Number.isInteger(+commentId)) {
                const select2 = `SELECT id, thread_id FROM replies WHERE id=${commentId}`;
                const comment = await db.promise().query(select2);
                if (comment[0].length === 1 && thread[0].length === 1) {
                    const insert = `INSERT INTO replies(reply, replyTo, user_id, thread_id, created) VALUES ('${JSON.stringify({ "content": content })}', ${commentId}, ${userId}, ${threadId}, NOW());`
                    await db.promise().query(insert);
                    res.status(200);
                } else {
                    res.status(400);
                }
            } else {
                const insert = `INSERT INTO replies(reply, user_id, thread_id, created) VALUES ('${JSON.stringify({ "content": content })}', ${userId}, ${threadId}, NOW());`
                await db.promise().query(insert);
                res.status(200);
            }
        } else {
            res.status(400);
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/view-all/:id', async function (req, res) {
    try {
        const user = req.params.id;
        if (user) {
            const userRecord = await db.promise().query(`SELECT * FROM users WHERE username='${user}'`)
            if (userRecord[0].length !== 0) {
                const query = `SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, units.title AS unit_title, units.code FROM threads INNER JOIN units 
                               ON units.code=threads.unit_code WHERE user_id=${userRecord[0][0].id}`
                const threads = await db.promise().query(query);
                res.status(200).json(threads[0]);
            } else {
                res.status(400).json({ message: 'user does not exist' });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }

    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/:id/view', async function (req, res) {
    try {
        const unitCode = req.params.id;
        if (unitCode) {
            const record = await db.promise().query(`SELECT * FROM units WHERE code='${unitCode}'`);
            if (record[0].length > 0) {
                const userThreads = await db.promise().query(`SELECT threads.id, threads.title, threads.created, threads.last_reply, threads.positive, threads.negative, users.username FROM threads INNER JOIN users ON threads.user_id=users.id WHERE unit_code='${unitCode}'`);
                res.status(200).json(userThreads[0]);
            } else {
                res.status(404);
            }
        } else {
            res.status(400).json({ message: "unit does not exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/view/:id', async function (req, res) {
    try {
        if (Number.isInteger(+req.params.id)) {
            const select = `SELECT threads.title, threads.thread, threads.created, threads.last_reply, threads.unit_code, users.username FROM threads INNER JOIN users ON threads.user_id=users.id WHERE threads.id=${req.params.id};`;
            var record = await db.promise().query(select);
            record[0][0].thread.content = replaceTag(record[0][0].thread.content);
            res.status(200).json(record[0][0]);
        } else {
            res.status(400);
        }
    } catch(err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/view/:id/replies', async function (req, res) {
    try {
        const threadId = req.params.id;
        if(Number.isInteger(+threadId)) {
            const select1 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NULL`;
            const comments = await db.promise().query(select1);
            const select2 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.thread_id=${threadId} AND replies.replyTo IS NOT NULL`;
            const replies = await db.promise().query(select2);
            res.status(200).json({comments: comments[0], replies: replies[0]});
        } else {
            res.status(400);
        }
    } catch(err) {
        console.log(err);
    }
})


module.exports = router;