const express = require("express");
const auth = require("../verify");
const { login, register } = require("../services/authentication-service")
const router = express.Router();

router.post("/login", async function (req, res) {
    try {
        const body = await login(req.body)
        res.status(200).json(body)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
});

router.post('/register', async function (req, res) {
    try {
        const { user, token } = register(req.body)
        req.session.user = user
        res.status(200).json({ token })
    } catch (err) {
        console.log(err)
        res.status(500)
    }

})

router.get("/logout", auth.verifyToken, async function (req, res) {
    try {
        const userId = req.userId;
        const sessionRec = await db.query(`SELECT * FROM session WHERE user_id=${userId} AND end IS NULL`);
        if (sessionRec[0].length === 0) {
            await db.query(`UPDATE session SET end=NOW() WHERE id=${sessionRec[0][0].id}`);
            res.status(200).json({ message: "successfully logged out" });
        } else {
            res.status(400).json({ message: "session does not exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});

module.exports = router;