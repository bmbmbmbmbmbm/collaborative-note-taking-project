const express = require('express');
const db = require('../database');

const router = express.Router();

function filterSpecial(entry) {
    filtered = JSON.stringify(entry).replace(/'/g, "\\" + "\'");
    return filtered;
}

router.get('/view/:id', function(req, res) {
    if(req.params.id === "0") {
        let defaultThread = require("./DefaultThread.json");
        res.status(200).json(defaultThread);
    } else {
        res.status(403).json({
            "title": "Thread doesn't exist",
            "content": "Sorry about that",
            "user": "n/a",
            "comments": []
        });
    }
})


module.exports = router;