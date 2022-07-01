const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;
    if(username && password) {
        if(req.session.authenticated) {
            res.json(req.session);
        } else {
            if(password === "password") {
                req.session.authenticated = true;
                req.session.user = { username, password };
                res.json(req.session);
            } else {
                res.status(403).json({ msg: 'bad credentials' })
            }
        }
    }
    res.send(200);
})

router.get('/', function(req, res) {
    res.status(200).json({ msg: "OK"});
})

module.exports = router;