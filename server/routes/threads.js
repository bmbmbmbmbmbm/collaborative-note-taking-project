const express = require('express');
const db = require('../database');

const router = express.Router();

function filterSpecial(entry) {
    filtered = JSON.stringify(entry).replace(/'/g, "\\" + "\'");
    return filtered;
}

router.get('/view/:id', function(req, res) {
    if(req.params.id === "0") {
        let defaultThread = require("./DefaultThread.json");
        res.status(200).json(defaultThread);
    } else {
        res.status(403).json({
            "title": "Thread doesn't exist",
            "content": "Sorry about that",
            "user": "n/a",
            "comments": []
        });
    }
})

router.post('/create', async function(req, res) {
    try{
        const { username, thread } = req.body;
        const filteredThread = filterSpecial(thread);
        const user = await db.promise().query(`SELECT user_id FROM users WHERE username='${username}'`);
        const insert = `INSERT INTO threads(thread, user_id, created, last_reply) VALUES('${filteredThread}', ${user[0][0].user_id}, NOW(), NOW());`
        await db.promise().query(insert);
        res.status(200).json({"message": "created thread"});
    } catch(err) {
        console.log(err);
        res.status(404);
    }
});

router.put('/update/:id', async function(req, res) {
    try {
        const { username, reply } = req.body;
        const thread = await db.promise().query(`SELECT thread FROM threads WHERE thread_id=${req.params.id}`)[0][0];

    } catch(err) {
        console.log(err);
        res.status(404);
    }
});

module.exports = router;