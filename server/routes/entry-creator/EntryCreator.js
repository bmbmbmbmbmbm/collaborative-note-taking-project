const express = require("express");
const router = express.Router();

router.post("/user-entry", (req, res) => {
    console.log(jsonify(req.body));
    res.end();
})

router.get("/user-entry", (req, res) => {
    res.json({"poopy": "this is poopy"})
})

module.exports = router;