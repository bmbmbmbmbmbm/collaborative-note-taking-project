const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/', async function(req, res) {
    const { email, password } = req.body;
    if(email && password) {
        console.log(email);
        if(email.substring(email.indexOf('@')) === "@bath.ac.uk") {
            try{
                await db.promise().query(`INSERT INTO USERS VALUES('${username}', '${password}', FALSE, FALSE)`);
                res.status(201).json({ msg: 'Created user'});
            } catch(err) {
                console.log(err);
                res.status(404);
            }
        } else {
            res.status(400).send("Invalid email");
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