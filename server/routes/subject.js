const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/enroll', async function(req, res) {
    try{
        const { username, units } = req.body;
        if(username) {
            const select = `SELECT id FROM users WHERE username=${username}`;
            const user = await db.promise().query(select);
            for(var i = 0; i < units.length; ++i) {
                await db.promise().query(`INSERT INTO enrollments(unit_code, user_id) VALUES ('${units[i]}', ${user[0][0].id})`);
            }
        }
    } catch(err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/user/:id', async function(req, res) {
    try{
        const username = req.params.id;
        const select = `SELECT units.code, units.title FROM units INNER JOIN enrolments ON units.code=enrolments.unit_code
                        INNER JOIN users ON users.id=enrolments.user_id WHERE users.username='${username}';`;
        const result = await db.promise().query(select);
        res.status(200).json(result[0]);
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

router.get('/:id', async function(req, res) {
    try {
        const subject = req.params.id.replace('_', ' ');
        const results = await db.promise().query(
            `SELECT units.code, units.title FROM units INNER JOIN subject_unit 
             ON units.code=subject_unit.unit_code 
             INNER JOIN subjects ON subject_unit.subject_id=subjects.id 
             WHERE subjects.title='${subject}';`
             );
        res.status(201).json(results[0]);
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

router.get('/', async function(req, res) {
    try{
        const results = await db.promise().query(`SELECT * FROM subjects`);
        res.status(201).json(results[0]);
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

module.exports = router;