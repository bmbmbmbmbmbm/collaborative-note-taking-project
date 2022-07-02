const express = require('express');
const bcrypt = require('bcrypt')
const db = require('../database');

const router = express.Router();

router.post('/', async function(req, res) {
    try{ 
        const { email, password, subject_id } = req.body;
        await db.promise().query(`SELECT subject_id FROM subject WHERE subject_id=${subject_id}`)

        if(email && password && subject_id > 0) {
            if(email.substring(email.indexOf('@')) === "@bath.ac.uk" && password.length > 6) {
                bcrypt.hash(password, 10, async function(err, hash) {
                    if(err) {
                        console.log(err)
                        res.status(404);
                    } else {
                        await db.promise().query(`INSERT INTO users(username, email, password, moderator, admin, subject_id) VALUES('${email.substring(0, email.indexOf('@'))}', '${email}', '${hash}', FALSE, FALSE, ${subject_id})`)
                        res.status(200).json({ message: "created account" });
                    }
                })
                
            } else {
                res.status(400).json({ message: "Invalid credentials"});
            }
        } else {
            res.status(400).json({ message: "Invalid credentials"});
        }
    } catch(err) {
        console.log(err);
        res.status(404).json({ message: "server error"});
    }
    
})

router.get('/', async function(req, res) {
    const results = await db.promise().query('SELECT * FROM USERS');
    console.log(results);
    res.status(200).send(results[0]);
})

module.exports = router;