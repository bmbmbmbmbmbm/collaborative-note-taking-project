const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");

const router = express.Router();

router.post("/", async function (req, res) {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const select = `SELECT * FROM users WHERE email='${email}'`
            const record = await db.promise().query(select);

            if (record[0].length === 1) {
                bcrypt.compare(password, record[0][0].password, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(404);
                    } else {
                        if (result === true) {
                            const id = record[0][0].user_id
                            const token = jwt.sign({ id }, "jwtSecret")
                            req.session.user = record[0][0];
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

module.exports = router;
