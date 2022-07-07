const express = require('express');
const db = require('../database');

const router = express.Router();

function filterSpecial(entry) {
  filtered = JSON.stringify(entry).replace(/'/g, "\\" + "\'");
  return filtered;
}

router.put('/view-all', async function(req, res){
  try{
    const  { username }  = req.body;
    console.log(username);
    const getId =  await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
    const id = getId[0][0].id;
    const select = `SELECT entries.id, entries.title, entries.created, entries.updated, units.title 
                    FROM entries INNER JOIN units ON entries.unit_code=units.code
                    INNER JOIN enrolments ON units.code=enrolments.unit_code
                    WHERE enrolments.user_id=${id};`
    const result = await db.promise().query(select);
    res.status(200).json(result[0]);
  } catch(err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/view/:id', async function(req, res) {
  try{
    const select = `SELECT entry FROM entries WHERE id=${req.params.id};`;
    const record = await db.promise().query(select);
    res.status(200).json(record[0][0].entry);
  } catch(err) {
    console.log(err);
    res.status(404);
  }
});

router.put('/update/:id', async function(req, res) {
  try{
    const { username, entry, entryId } = req.body;
    // Aquire the user_id
    const select = `SELECT id FROM users WHERE username=${username}`
    const user = await db.promise().query(select);
    // Remove characters that mysql can't handle
    const filteredEntry = filterSpecial(entry);
    // Create SQL statement to update the record.
    const update = `UPDATE entries SET entry=${filteredEntry}, updated=NOW() WHERE user_id=${user[0].id} AND id=${entryId}`;
    await db.promise().query(update);
    res.status(200).send({"message": "updated entry"});
  } catch(err) {
    console.log(err);
    res.status(404);
  }
});

router.post('/create', async function(req, res) {
  try{
    // Grab the username and the entry to be added
    const { username, entry } = req.body;
    // Aquire the user_id
    const select = `SELECT id FROM users WHERE username=${username}`
    const user = await db.promise().query(select);
    // Remove characters that mysql can't handle
    const filteredEntry = filterSpecial(entry);
    // Insert the new record into the entries table
    const insert = `INSERT INTO entries(entry, user_id, created, updated) VALUES('${filteredEntry}', ${user.id}, NOW(), NOW())`;
    await db.promise().query(insert);
    res.status(200).send({"message": "created entry"});
  } catch(err) {
    console.log(err);
    res.status(404);
  }
});

router.delete('/delete/:id', async function(req, res) {
  try {
    
  } catch(err) {
    console.log(err);
    res.status(404);
  }
}); 

module.exports = router;