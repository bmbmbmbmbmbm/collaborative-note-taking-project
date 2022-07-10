const express = require('express');
const db = require('../database');

const router = express.Router();

function filterSpecial(entry) {
    filtered = JSON.stringify(entry).replace(/'/g, "\\" + "\'");
    return filtered;
}

router.get('/view-all/:id', async function(req, res) {
    try{
        const user = req.params.id;
        const userRecord = await db.promise().query(`SELECT * FROM users WHERE username='${user}'`)
        if(userRecord[0].length !== 0) {
            const query = `SELECT threads.id, threads.title, threads.created, threads.last_reply, units.title FROM threads INNER JOIN units ON units.code=threads.unit_code WHERE user_id=${userRecord[0][0].id}`
            const threads = await db.promise().query(query);
            res.status(200).json(threads[0]);
        } else {
            res.status(400).json({message: 'user does not exist'});
        }
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

router.get('/view/:id', async function(req, res) {
    
})


module.exports = router;