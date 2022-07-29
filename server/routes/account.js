const express = require('express');
const auth = require("../verify");
const bcrypt = require("bcrypt");
const db = require("../database");
const text = require("../validation");

const router = express.Router();

router.put("/change-password", auth.verifyToken, async function (req, res) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        if (text.validEmail(email) && text.validPassword(oldPassword) && text.validPassword(newPassword) && text.validPassword(confirmPassword)) {
            const record = await db.promise().query(`SELECT * FROM users WHERE email='${email}'`)
            if (record[0].length === 1) {
                const session = await db.promise().query(`SELECT * FROM session WHERE user_id=${record[0][0].id} AND end=NULL`);
                if (session[0].length === 1) {
                    bcrypt.compare(oldPassword, record[0][0].password, async (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({result: 'Failed to change password'});
                        } else {
                            if (result === true) {
                                bcrypt.hash(newPassword, 10, async function (err, hash) {
                                    if (err) {
                                        console.log(err);
                                        res.status(400);
                                    } else {
                                        await db.promise().query(`UPDATE users SET password='${hash}' WHERE email='${email}'`)
                                        res.status(200).json({result: 'Successfully changed password'})
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.status(400).json({result: 'Failed to change password'});
                }
            } else {
                res.status(400).json({result: 'Failed to change password'});
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({result: 'Failed to change password'});
    }
})

router.post("/delete-account", auth.verifyToken, async function (req, res) {
    try {
        const { email, password } = req.body;
    } catch (err) {

    }
})

module.exports = router;