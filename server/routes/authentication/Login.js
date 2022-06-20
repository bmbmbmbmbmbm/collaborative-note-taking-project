const express = require("express");
const router = express.Router();

router.post('/', function(req, res) {
    const value = req.body;
    if(value.user === "eu000" && value.password === "password"){
        res.send("success")
    } else {
        res.send("invalid")
    }
});

module.exports = router;