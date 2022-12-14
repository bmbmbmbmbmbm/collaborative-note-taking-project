const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");
const auth = require("../verify");
const v = require("../validation")

const router = express.Router();

router.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        if (v.validEmail(email, "@bath.ac.uk") && v.validPassword(password)) {
            const select = `SELECT * FROM users WHERE email='${email}'`
            const record = await db.promise().query(select);
            if (record[0].length === 1) {
                bcrypt.compare(password, record[0][0].password, async (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: "server error"});
                    } else {
                        if (result === true) {
                            const id = record[0][0].id;
                            const username = record[0][0].username;
                            const token = jwt.sign({ id, username }, "aISxTgwXv6COzRBj4xK34NVvhe7PTqBjP7Tfh0ORcHTxuaAPWRtw2nCZCruQPq4NyxqMcIhPG1Nyq6skY4RXCkPrXQOkvcwEBxuD008mZlkCF4QXT38QqPpFHiQOSDGF")
                            await db.promise().query(`INSERT INTO session(user_id, start) VALUES (${record[0][0].id}, NOW())`);
                            console.log(token);
                            res.status(200).json({ token: token });
                        } else {
                            res.status(400).json({message: "invalid credentials"});
                        }
                    }
                })
            } else {
                res.status(400).json({message: "invalid credentials"});
            }
        } else {
            res.status(400).json({message: "invalid credentials"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "server error"});
    }
});

router.post('/register', async function (req, res) {
    try {
        const { email, password, subject_id } = req.body;
        if (v.validEmail(email, "@bath.ac.uk") && v.validPassword(password) && v.validId(subject_id)) {
            const subject = await db.promise().query(`SELECT id FROM subjects WHERE id=${subject_id}`);
            const user = await db.promise().query(`SELECT email FROM users WHERE email='${email}'`);
            if(subject[0].length === 1 && user[0].length === 0) {
                bcrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: "server error"});
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
                res.status(400).json({ message: "invalid credentials" });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }

})

router.get("/logout", auth.verifyToken, async function (req, res) {
    try {
        const userId = req.userId;
        const sessionRec = await db.promise().query(`SELECT * FROM session WHERE user_id=${userId} AND end IS NULL`);
        if (sessionRec[0].length === 0) {
            await db.promise().query(`UPDATE session SET end=NOW() WHERE id=${sessionRec[0][0].id}`);
            res.status(200).json({ message: "successfully logged out"});
        } else {
            res.status(400).json({message: "session does not exist"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error"});
    }
});

module.exports = router;