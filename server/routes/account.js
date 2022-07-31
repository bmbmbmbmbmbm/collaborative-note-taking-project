const express = require('express');
const auth = require("../verify");
const bcrypt = require("bcrypt");
const db = require("../database");
const v = require("../validation");

const router = express.Router();

router.put("/change-password", auth.verifyToken, async function (req, res) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        if (v.validEmail(email, "@bath.ac.uk") && v.validPassword(oldPassword) && v.validPassword(newPassword) && v.validPassword(confirmPassword)) {
            const record = await db.promise().query(`SELECT * FROM users WHERE email='${email}'`)
            if (record[0].length === 1) {
                bcrypt.compare(oldPassword, record[0][0].password, async (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ result: 'server error' });
                    } else {
                        if (result === true) {
                            bcrypt.hash(newPassword, 10, async function (err, hash) {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({ message: "server error" });
                                } else {
                                    await db.promise().query(`UPDATE users SET password='${hash}' WHERE email='${email}'`)
                                    res.status(200).json({ result: 'Successfully changed password' })
                                }
                            })
                        }
                    }
                })
            } else {
                res.status(400).json({ result: 'invalid credentials' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ result: 'server error' });
    }
})

router.post("/delete-account", auth.verifyToken, async function (req, res) {
    try {
        const { email, password } = req.body;
    } catch (err) {

    }
})

module.exports = router;