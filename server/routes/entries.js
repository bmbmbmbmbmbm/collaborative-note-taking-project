const express = require('express');
const db = require('../database');
const auth = require('../verify');
const v = require('../validation.js');

const router = express.Router();

function filterEntry(entry, removeTags) {
  for (var i = 0; i < entry.length; ++i) {
    if (entry[i].type !== undefined) {
      entry.children = filterEntry(entry[i].children, removeTags);
    } else if (entry[i].text !== undefined) {
      entry[i].text = removeTags ? v.removeTags(entry[i].text) : v.addTags(entry[i].text);
    }
  }
  return entry;
}

router.get('/public/:id', async function (req, res) {
  try {
    const username = req.params.id;
    if (v.validUsername(username)) {
      const user = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
      if (user[0].length > 0) {
        var publicEntries = await db.promise().query(`SELECT id, title, created, updated, unit_code, positive, negative FROM entries WHERE user_id=${user[0][0].id} AND private=FALSE`);
        v.removeTagsFromTitles(publicEntries)
        res.status(200).json(publicEntries[0]);
      } else {
        res.status(400).json({ message: "invalid credentials" });
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/:id/view', async function (req, res) {
  try {
    const unitCode = req.params.id;
    if (v.validUnitCode(unitCode)) {
      const record = await db.promise().query(`SELECT * FROM units WHERE code='${unitCode}'`);
      if (record[0].length > 0) {
        var entries = await db.promise().query(`SELECT entries.id, entries.title, entries.created, entries.updated, entries.positive, entries.negative, users.username FROM entries INNER JOIN users ON entries.user_id=users.id WHERE unit_code='${unitCode}'`);
        v.removeTagsFromTitles(entries);
        res.status(200).json(entries[0]);
      } else {
        res.status(404);
      }
    } else {
      res.status(400).json({ message: "unit does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/view-all/:id', async function (req, res) {
  try {
    const username = req.params.id;
    if (v.validUsername(username)) {
      const getId = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
      if (getId[0].length > 0) {
        const id = getId[0][0].id;
        const select =
          `SELECT entries.id, entries.title, users.username, entries.created, entries.updated, units.title AS unit_title, units.code, entries.positive, entries.negative
           FROM entries INNER JOIN units ON entries.unit_code=units.code
           INNER JOIN enrolments ON units.code=enrolments.unit_code
           INNER JOIN users ON enrolments.user_id=users.id
           WHERE enrolments.user_id=${id};`

        var result = await db.promise().query(select);
        v.removeTagsFromTitles(result);
        res.status(200).json(result[0]);
      } else {
        res.status(400).json({ message: 'user does not exist' })
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/view/:id', async function (req, res) {
  try {
    if (v.validId(req.params.id)) {
      const select = `SELECT entries.title, entries.entry, entries.created, entries.updated, entries.unit_code, 
                      entries.positive, entries.negative, entries.private, users.username 
                      FROM entries INNER JOIN users ON users.id=entries.user_id WHERE entries.id=${req.params.id};`;
      var record = await db.promise().query(select);
      if (record[0][0].private === true) {
        res.status(400);
      } else {
        record[0][0].entry = filterEntry(record[0][0].entry, true);
        v.removeTagsFromTitles(record);
        res.status(200).json(record[0][0]);
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.put('/edit/:id', auth.verifyToken, async function (req, res) {
  try {
    const userId = req.userId;
    const entryId = req.params.id;
    if (v.validId(entryId)) {
      const select = `SELECT entries.title, entries.entry, entries.unit_code, units.title As unitTitle FROM entries INNER JOIN units ON entries.unit_code=units.code 
                      WHERE id=${entryId} AND user_id=${userId}`
      var record = await db.promise().query(select);
      if (record[0].length === 1) {
        v.removeTagsFromTitles(record);
        record[0][0].entry = filterEntry(record[0][0].entry, true);
        res.status(200).json(record[0][0]);
      } else {
        res.status(400);
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
})

router.put('/edit-diff/:id', auth.verifyToken, async function (req, res) {
  try {
    const entryId = req.params.id;
    if (v.validId(entryId)) {
      const select = `SELECT entries.title, entries.entry, entries.unit_code, units.title As unitTitle, users.username 
                      FROM users INNER JOIN entries ON users.id=entries.user_id INNER JOIN units ON entries.unit_code=units.code 
                      WHERE entries.id=${entryId}`
      var record = await db.promise().query(select);
      if (record[0].length === 1) {
        v.removeTagsFromTitles(record);
        record[0][0].entry = filterEntry(record[0][0].entry, true);
        res.status(200).json(record[0][0]);
      } else {
        res.status(400);
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
})

router.get('/edit-suggestions/:id', async function (req, res) {
  try {
    const entryId = req.params.id;
    if (v.validId(entryId)) {
      const select = `SELECT user_edits.edit, user_edits.created, users.username 
                      FROM user_edits INNER JOIN users ON users.id=user_edits.user_id WHERE entry_id=${entryId}`;
      var records = await db.promise().query(select);
      for(var i = 0; i < records[0].length; ++i) {
        records[0][i].edit = filterEntry(records[0][i].edit);
      }
      res.status(200).json(records[0]);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.put('/update', auth.verifyToken, async function (req, res) {
  try {
    const { entry, entryId } = req.body;
    const userId = req.userId;
    if (entry && v.validId(entryId)) {
      const stringEntry = JSON.stringify(filterEntry(entry));
      const update = `UPDATE entries SET entry='${stringEntry}', updated=NOW() WHERE user_id=${userId} AND id=${entryId}`;
      await db.promise().query(update);
      res.status(200);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.post('/create', auth.verifyToken, async function (req, res) {
  try {
    const { title, entry, unitCode, private } = req.body;
    const userId = req.userId;
    const stringEntry = JSON.stringify(filterEntry(entry));
    if (v.validTitle(title) && v.validUnitCode(unitCode)) {
      const newTitle = v.addTags(title);
      const insert = `INSERT INTO entries(title, entry, created, updated, user_id, unit_code, private, positive, negative) 
                      VALUES ('${newTitle}', '${stringEntry}', NOW(), NOW(), ${userId}, '${unitCode}', ${private}, 0 , 0);`;
      await db.promise().query(insert);
      const select = `SELECT id FROM entries WHERE title='${newTitle}' AND user_id=${userId} AND unit_code='${unitCode}';`;
      const entryRecord = await db.promise().query(select);
      res.status(200).json({ id: entryRecord[0][0].id });
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.post('/create-edit', auth.verifyToken, async function (req, res) {
  try {
    const { entry, entryId } = req.body;
    const userId = req.userId;
    if (v.validId(entryId) && entry) {
      const stringEntry = JSON.stringify(filterEntry(entry));
      const insert = `INSERT INTO user_edits(user_id, entry_id, edit, created) VALUES (${userId}, ${entryId}, '${stringEntry}', NOW())`
      await db.promise().query(insert);
      res.status(200);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.post('/add-reply', auth.verifyToken, async function (req, res) {
  try {
    const { content, entryId, commentId } = req.body;
    const userId = req.userId;
    if (v.validContent(content) && v.validId(entryId)) {
      const select = `SELECT id FROM threads WHERE id=${entryId}`;
      const thread = await db.promise().query(select);
      if (v.validId(commentId)) {
        const select2 = `SELECT id, entry_id FROM replies WHERE id=${commentId}`;
        const comment = await db.promise().query(select2);
        if (comment[0].length === 1 && thread[0].length === 1) {
          const insert = `INSERT INTO replies(reply, replyTo, user_id, entry_id, created) VALUES ('${JSON.stringify({ "content": content })}', ${commentId}, ${userId}, ${entryId}, NOW());`
          await db.promise().query(insert);
          res.status(200);
        } else {
          res.status(400);
        }
      } else {
        const insert = `INSERT INTO replies(reply, user_id, entry_id, created) VALUES ('${JSON.stringify({ "content": content })}', ${userId}, ${entryId}, NOW());`
        await db.promise().query(insert);
        res.status(200);
      }
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/view/:id/replies', async function (req, res) {
  try {
    const entryId = req.params.id;
    if (v.validId(entryId)) {
      const select1 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username 
                       FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.entry_id=${entryId} AND replies.replyTo IS NULL`;
      const comments = await db.promise().query(select1);
      const select2 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username 
                       FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.entry_id=${entryId} AND replies.replyTo IS NOT NULL`;
      const replies = await db.promise().query(select2);
      res.status(200).json({ comments: comments[0], replies: replies[0] });
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
  }
})

router.delete('/delete/:id', auth.verifyToken, async function (req, res) {
  try {

  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

module.exports = router;