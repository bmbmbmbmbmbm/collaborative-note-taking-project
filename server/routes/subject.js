const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/:id', async function(req, res) {
    try {
        const subject = req.params.id.replace('_', ' ');
        const results = await db.promise().query(
            `SELECT units.unit_code, units.unit_name FROM units INNER JOIN subject_unit 
             ON units.unit_code=subject_unit.unit_code 
             INNER JOIN subject ON subject_unit.subject_id=subject.subject_id 
             WHERE subject.subject_title='${subject}';`
             );
        res.status(201).json(results[0]);
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

router.get('/', async function(req, res) {
    try{
        const results = await db.promise().query(`SELECT * FROM subject`);
        res.status(201).json(results[0]);
    } catch(err) {
        console.log(err);
        res.status(404);
    }
})

module.exports = router;