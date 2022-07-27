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

function filterThread(entry, removeTags) {
    console.log(entry);
    for (var i = 0; i < entry.length; ++i) {
        if (entry[i].type !== undefined) {
            entry.children = filterEntry(entry[i].children, removeTags);
        } else if (entry[i].text !== undefined) {
            entry[i].text = removeTags ? replaceTag(entry[i].text) : replaceWithTag(entry[i].text);
        }
    }
    return entry;
}

router.post('create', auth.verifyToken, async function (req, res) {
    try{
        const { username, title, unitCode, content } = req.body;
        if(username && username.length > 0 && title && title.length >= 6 && title.length <= 64 && unitCode && content && content.split(" ").length <= 1000) {
            const record = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
            if(record[0].length === 1) {
                const insert = `INSERT INTO threads(title, thread, created, last_reply, user_id, unit_code, positive, negative) 
                                VALUES ('${title}', '${content}', NOW(), NOW(), ${record[0][0].id}, '${unitCode}', 0 , 0)`;
                await db.promise().query(insert);
                res.status(200);
            } else {
                res.status(400);
            }
        } else {
            res.status(400);
        }
    } catch(err) {
        console.log(err);
        res.status(500);
    }
})

router.get('/view-all/:id', async function (req, res) {
    try {
        const user = req.params.id;
        if (user) {
            const userRecord = await db.promise().query(`SELECT * FROM users WHERE username='${user}'`)
            if (userRecord[0].length !== 0) {
                const query = `SELECT threads.id, threads.title, threads.created, threads.last_reply, units.title FROM threads INNER JOIN units ON units.code=threads.unit_code WHERE user_id=${userRecord[0][0].id}`
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

});


module.exports = router;