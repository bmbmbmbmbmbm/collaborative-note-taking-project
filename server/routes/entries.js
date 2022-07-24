const e = require('express');
const express = require('express');
const db = require('../database');
const auth = require('../verify');

const router = express.Router();

function filterSpecial(text) {
  let filtered = "";
  filtered = text.replace(/\0/g, "\\\0");
  filtered = text.replace(/'|\'/g, "\\\'");
  filtered = text.replace(/\"|"/g, "\\\"");
  filtered = text.replace(/\b/g, "\\\b");
  filtered = text.replace(/\n/g, "\\\n");
  filtered = text.replace(/\r/g, "\\\r");
  filtered = text.replace(/\t/g, "\\\t");
  filtered = text.replace(/\Z/g, "\\\Z");
  filtered = text.replace(/\%|%/g, "\\\%");
  filtered = text.replace(/\_|_/g, "\\\_");
  return filtered;
}

function filterEntry(entry) {
  console.log(entry);
  for(var i = 0; i < entry.length; ++i) {
    if(entry[i].type !== undefined) {
      console.log("beep")
      filterEntry(entry[i].children);
    } else if(entry[i].text !== undefined) {
      console.log("boop")
      entry[i].text = filterSpecial(entry[i].text);
      console.log(entry[i].text);
    }
  }
}

const val = [
  {
    "type": "",
    "children": [
      { 
        "type": "",
        "children": [
          {
            "text": "\n\0\'\"\b\n\r\t\z\\\%\_",
          },
        ]
      },
    ]
  },
  {
    "type": "",
    "children": [
      { 
        "text": "\'"
      },
      {
        "text": "\""
      }
    ]
  }
]



router.get('/public/:id', async function (req, res) {
  try {
    const insert = `INSERT INTO entries(title, entry, created, updated, user_id, unit_code, private, positive, negative) 
                        VALUES ('title', '${JSON.stringify(filterEntry(val))}', NOW(), NOW(), 1, 'GENERAL', TRUE, 0 , 0);`;
    db.promise().query(insert);
    
    const username = req.params.id;
    if (username) {
      const user = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
      if (user[0].length > 0) {
        const publicEntries = await db.promise().query(`SELECT id, title, created, updated, unit_code, positive, negative FROM entries WHERE user_id=${user[0][0].id} AND private=FALSE`);
        res.status(200).json(publicEntries[0]);
      } else {
        res.status(400).json({ message: "invalid credentials" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/:id/view', async function (req, res) {
  try {
    const unitCode = req.params.id;
    if (unitCode) {
      const record = await db.promise().query(`SELECT * FROM units WHERE code='${unitCode}'`);
      if (record[0].length > 0) {
        const entries = await db.promise().query(`SELECT entries.id, entries.title, entries.created, entries.updated, entries.positive, entries.negative, users.username FROM entries INNER JOIN users ON entries.user_id=users.id WHERE unit_code='${unitCode}'`);
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
    console.log(username);
    const getId = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
    if (getId[0].length > 0) {
      const id = getId[0][0].id;
      const select =
        `SELECT entries.id, entries.title, users.username, entries.created, entries.updated, units.title AS unit_title, units.code, entries.positive, entries.negative
      FROM entries INNER JOIN units ON entries.unit_code=units.code
      INNER JOIN enrolments ON units.code=enrolments.unit_code
      INNER JOIN users ON enrolments.user_id=users.id
      WHERE enrolments.user_id=${id};`

      const result = await db.promise().query(select);
      res.status(200).json(result[0]);
    } else {
      res.status(400).json({ message: 'user does not exist' })
    }

  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.get('/view/:id', async function (req, res) {
  try {
    const select = `SELECT entry FROM entries WHERE id=${req.params.id};`;
    const record = await db.promise().query(select);
    res.status(200).json(record[0][0].entry);
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.put('/edit/:id', async function (req, res) {
  try {
    const { username } = req.body;
    if (username) {
      const session = await db.promise().query(`SELECT * FROM session WHERE username='${username}' AND end=NULL`);
      const user = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`);
      if (session[0].length === 1 && user[0].length === 1) {
        const entry = await db.promise().query(`SELECT title, entry, unit_code FROM entries WHERE id=${req.params.id} AND user_id=${user[0][0].id}`);
        if (entry[0].length === 1) {
          res.status(200).json(entry[0][0]);
        } else {
          res.status(400);
        }
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

router.put('/update', auth.verifyToken, async function (req, res) {
  try {
    const { username, entry, entryId } = req.body;
    // Aquire the user_id
    const select = `SELECT id FROM users WHERE username=${username}`
    const user = await db.promise().query(select);
    // Remove characters that mysql can't handle
    const filteredEntry = filterSpecial(entry);
    // Create SQL statement to update the record.
    const update = `UPDATE entries SET entry=${filteredEntry}, updated=NOW() WHERE user_id=${user[0].id} AND id=${entryId}`;
    await db.promise().query(update);
    res.status(200).send({ "message": "updated entry" });
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.post('/create', auth.verifyToken, async function (req, res) {
  try {
    const { username, title, entry, unitCode, private } = req.body;
    if (username) {
      const record = await db.promise().query(`SELECT id FROM users WHERE username='${username}'`)
      if (record[0].length > 0) {
        const insert = `INSERT INTO entries(title, entry, created, updated, user_id, unit_code, private, positive, negative) 
                        VALUES ('${title}', '${filterSpecial(entry)}', NOW(), NOW(), ${record[0][0].id}, '${unitCode}', ${private}, 0 , 0);`;
        await db.promise().query(insert);
        res.status(200).json({ message: 'OK' });
      } else {
        res.status(400).json({ message: 'invalid credentials' });
      }
    } else {
      res.status(400).json({ message: 'invalid credentials' });
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

router.delete('/delete/:id', auth.verifyToken, async function (req, res) {
  try {

  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

module.exports = router;