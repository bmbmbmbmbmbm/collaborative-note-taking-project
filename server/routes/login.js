const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");
const auth = require("../verify");

const router = express.Router();

router.post("/", async function (req, res) {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const select = `SELECT * FROM users WHERE email='${email}'`
            const record = await db.promise().query(select);

            if (record[0].length === 1) {
                bcrypt.compare(password, record[0][0].password, async (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(404);
                    } else {
                        if (result === true) {
                            const id = record[0][0].user_id
                            const token = jwt.sign({ id }, "jwtSecret")
                            req.session.user = record[0][0];
                            await db.promise().query(`INSERT INTO session(user_id, start) VALUES (${record[0][0].id}, NOW())`);
                            res.status(200).json({ auth: true, token: token });
                        } else {
                            res.status(400);
                        }
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
});

router.post("/out", auth.verifyToken, async function(req, res) {
    try {
        const username = req.body.username;
        if(username) {
            const record = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
            if(record[0].length === 0) {
                const sessionRec = await db.promise().query(`SELECT * FROM session WHERE user_id=${record[0][0].id} AND end=NULL`);
                if(sessionRec[0].length === 0) {
                    await db.promise().query(`UPDATE session SET end=NOW() WHERE id=${sessionRec[0][0].id}`);
                    res.status(200);
                } else {
                    res.status(400);
                }
            } else {
                res.status(400);
            }
        } else {
            res.status(400);
        }
    } catch(err) {
        console.log(err);
        res.status(404);
    }
});

module.exports = router;
