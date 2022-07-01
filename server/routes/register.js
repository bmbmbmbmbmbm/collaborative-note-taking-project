const express = require('express');
const bcrypt = require('bcrypt')
const db = require('../database');

const router = express.Router();

router.post('/', async function(req, res) {
    const { email, password, subject } = req.body;
    if(email && password) {
        if(email.substring(email.indexOf('@')) === "@bath.ac.uk" && password.length > 6) {
            const subId = await db.promise().query(`SELECT subject_id FROM subject WHERE subject=${subject};`)
            await db.promise().query(`INSERT INTO users(username, email, password, moderator, admin, subject_id) VALUES('${email.substring(0, email.indexOf('@'))}', '${email}', '${password}', FALSE, FALSE, ${subId})`)
            res.status(200).send({"message": "created account"});
        } else {
            res.status(400).send("Invalid credentials");
        }
    } else {
        res.status(400).send("Invalid");
    }
})

router.get('/', async function(req, res) {
    const results = await db.promise().query('SELECT * FROM USERS');
    console.log(results);
    res.status(200).send(results[0]);
})

module.exports = router;