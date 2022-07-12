const express = require('express');
const db = require('../database');

const router = express.Router();

function filterSpecial(entry) {
    filtered = JSON.stringify(entry).replace(/'/g, "\\" + "\'");
    return filtered;
}

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