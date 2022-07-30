const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require('../database');
const v = require('../validation');

const router = express.Router();

router.post('/', async function (req, res) {
    try {
        const { email, password, subject_id } = req.body;
        if (v.validEmail(email, "@bath.ac.uk") && v.validPassword(password) && v.validId(subject_id)) {
            const subject = await db.promise().query(`SELECT id FROM subjects WHERE id=${subject_id}`)
            if(subject[0].length === 1) {
                bcrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        console.log(err)
                        res.status(404);
                    } else {
                        const insert = `INSERT INTO users(username, email, password, moderator, admin, subject_id) 
                                        VALUES('${email.substring(0, email.indexOf('@'))}', '${email}', '${hash}', FALSE, FALSE, ${subject_id})`
                        await db.promise().query(insert)
                        const record = await db.promise().query(`SELECT * FROM users WHERE username='${email.substring(0, email.indexOf('@'))}'`);
                        const id = record[0][0].id;
                        const username = record[0][0].username;
                        const token = jwt.sign({ id, username }, "aISxTgwXv6COzRBj4xK34NVvhe7PTqBjP7Tfh0ORcHTxuaAPWRtw2nCZCruQPq4NyxqMcIhPG1Nyq6skY4RXCkPrXQOkvcwEBxuD008mZlkCF4QXT38QqPpFHiQOSDGF")
                        req.session.user = record[0][0];
                        res.status(200).json({ token: token });
                    }
                })
            } else {
                res.status(400);
            }
        } else {
            res.status(400);
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }

})

module.exports = router;