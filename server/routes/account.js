const express = require('express');
const auth = require("../verify");
const { changePassword } = require('../services/account-service')
const router = express.Router();

router.put("/change-password", auth.verifyToken, async function (req, res) {
    try {
        changePassword(req.userId, req.body);
        res.status(200)
    } catch (err) {
        console.log(err);
        res.status(400);
    }
})

router.post("/delete", auth.verifyToken, async function (req, res) {
    try {
        const { email, password } = req.body;
    } catch (err) {

    }
})

module.exports = router;