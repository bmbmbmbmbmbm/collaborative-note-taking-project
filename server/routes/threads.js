const express = require('express');
const router = express.Router();

router.get('/:id', function(req, res) {
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