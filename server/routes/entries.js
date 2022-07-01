const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/:id', async function(req, res) {
  try{
    const entry = require('./DefaultEntry.json');
    await db.promise().query(
      `INSERT INTO entries(entry, user_id, created, updated)
       VALUES(${JSON.stringify(entry)}, 1, GETDATE(), GETDATE());`
      );
      console.log("added entry");
      res.status(200).send("We good homie");
  } catch(err) {
    console.log(err);
    res.status(404);
  }
});

module.exports = router;