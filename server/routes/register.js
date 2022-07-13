const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require('../database');

const router = express.Router();

router.post('/', async function (req, res) {
    try {
        const { email, password, subject_id } = req.body;
        await db.promise().query(`SELECT id FROM subjects WHERE id=${subject_id}`)

        if (email && password && subject_id > 0) {
            if (email.substring(email.indexOf('@')) === "@bath.ac.uk" && password.length > 6) {
                bcrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        console.log(err)
                        res.status(404);
                    } else {
                        await db.promise().query(`INSERT INTO users(username, email, password, moderator, admin, subject_id) VALUES('${email.substring(0, email.indexOf('@'))}', '${email}', '${hash}', FALSE, FALSE, ${subject_id})`)
                        const record = await db.promise().query(`SELECT * FROM users WHERE username='${email.substring(0, email.indexOf('@'))}'`);
                        const id = record[0][0].id;
                        const token = jwt.sign({ id }, "jwtSecret")
                        req.session.user = record[0][0];
                        res.status(200).json({ auth: true, token: token });
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

router.get('/', async function (req, res) {
    const results = await db.promise().query('SELECT * FROM USERS');
    console.log(results);
    res.status(200).send(results[0]);
})

module.exports = router;