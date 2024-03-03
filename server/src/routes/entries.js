import { Router } from 'express'
import { query } from '../data/database.js'
import verifyToken from '../verify.js'
import {
  validId, removeTagsFromTitles, validTitle,
  validUnitCode, addTags, validContent,
  validUsername, removeTags as _removeTags
} from '../validation.js'

const router = Router()

/*
  _________________________________________________________________________________________________________________________________________

  Edit suggestion routes
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles requests for user entry suggestion creation.
  *
  * @param {string} JWT is required before request is handled
  * @param {JSON} entry is required for insertion
  * @param {Number} entryId is required for identifying entry recieving suggestion
  *
*/
router.post('/create-edit', verifyToken, async (req, res) => {
  try {
    const { entry, entryId } = req.body
    const userId = req.userId
    if (validId(entryId) && Array.isArray(entry) && isValidEntry(entry)) {
      const entryRecord = await query(`SELECT id FROM entries WHERE id=${entryId}`)
      if (entryRecord[0].length === 1) {
        const editRecord = await query(`SELECT entry_id, user_id FROM user_edits WHERE user_id=${userId} AND entry_id=${entryId}`)
        if (editRecord[0].length === 0) {
          const stringEntry = JSON.stringify(filterEntry(entry))
          const insert = `INSERT INTO user_edits(user_id, entry_id, edit, created) VALUES (${userId}, ${entryId}, '${stringEntry}', NOW())`
          await query(insert)
          res.status(200).json({ message: 'created edit' })
        } else {
          const stringEntry = JSON.stringify(filterEntry(entry))
          const update = `UPDATE user_edits SET edit='${stringEntry}' WHERE entry_id=${entryId} AND user_id=${userId}`
          await query(update)
          res.status(200).json({ message: 'updated edit' })
        }
      } else {
        res.status(400).json({ message: 'entry does not exist' })
      }
    } else {
      res.status(400).json({ message: 'invalid entry or entry identifier' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests for retrieving edit suggestions for an entry
  *
  * @param {Number} entryId is required for identifying entry to retrieve suggestions for
  *
*/
router.get('/edit-suggestions/:id', verifyToken, async (req, res) => {
  try {
    const entryId = req.params.id
    if (validId(entryId)) {
      const select = `SELECT user_edits.edit, user_edits.created, users.username 
                      FROM user_edits INNER JOIN users ON users.id=user_edits.user_id WHERE entry_id=${entryId}`
      const records = await query(select)
      for (let i = 0; i < records[0].length; ++i) {
        records[0][i].edit = filterEntry(records[0][i].edit)
      }
      res.status(200).json(records[0])
    } else {
      res.status(400).json({ message: 'entry does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles retrieving entry for another user to edit and make suggestions
  *
  * @param {Number} entryId is required for identifying entry to retrieve suggestions for
  *
*/
router.get('/edit-diff/:id', verifyToken, async (req, res) => {
  try {
    const entryId = req.params.id
    if (validId(entryId)) {
      const select = `SELECT entries.title, entries.entry, entries.unit_code, units.title As unitTitle, users.username 
                      FROM users INNER JOIN entries ON users.id=entries.user_id INNER JOIN units ON entries.unit_code=units.code 
                      WHERE entries.id=${entryId}`
      const record = await query(select)
      if (record[0].length === 1) {
        removeTagsFromTitles(record)
        record[0][0].entry = filterEntry(record[0][0].entry, true)
        res.status(200).json(record[0][0])
      } else {
        res.status(400).json({ message: 'resource does not exist' })
      }
    } else {
      res.status(400).json({ message: 'resource does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/*
  _________________________________________________________________________________________________________________________________________

  Entry creation and update routes
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles requests for creating entries
  *
  * @param {string} title is required for naming the entry
  * @param {JSON} entry is required for providing reading material
  * @param {string} unitCode is required for associating entry with unit
  * @param {boolean} private is required for knowing whether this should be a private entry
  *
*/
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { title, entry, unitCode, isPrivate } = req.body
    const userId = req.userId

    if (validTitle(title) && validUnitCode(unitCode) && Array.isArray(entry) && isValidEntry(entry) && typeof isPrivate === 'boolean') {
      const unit = await query(`SELECT * FROM units WHERE code='${unitCode}'`)
      if (unit[0].length === 1) {
        const stringEntry = JSON.stringify(filterEntry(entry))
        const newTitle = addTags(title)
        const insert = `INSERT INTO entries(title, entry, created, updated, user_id, unit_code, private, positive, negative) 
                      VALUES ('${newTitle}', '${stringEntry}', NOW(), NOW(), ${userId}, '${unitCode}', ${isPrivate}, 0 , 0);`
        await query(insert)
        const select = `SELECT id FROM entries WHERE title='${newTitle}' AND user_id=${userId} AND unit_code='${unitCode}';`
        const entryRecord = await query(select)
        res.status(200).json({ id: entryRecord[0][0].id })
      } else {
        res.status(400).json({ message: 'invalid unit' })
      }
    } else {
      res.status(400).json({ message: 'invalid entry information' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests for updating a users entry
  *
  * @param {Number} entryId is required for identifying entry to update
  * @param {JSON} entry is required for updating value of the original entry
  *
*/
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { entry, entryId } = req.body
    const userId = req.userId
    if (Array.isArray(entry) && isValidEntry(entry) && validId(entryId)) {
      const entryRecord = await query(`SELECT id, user_id FROM entries WHERE id=${entryId}`)
      if (entryRecord[0].length === 1) {
        if (entryRecord[0][0].user_id === userId) {
          const stringEntry = JSON.stringify(filterEntry(entry))
          const update = `UPDATE entries SET entry='${stringEntry}', updated=NOW() WHERE user_id=${userId} AND id=${entryId}`
          await query(update)
          res.status(200).json({ message: 'successfully updated entry' })
        } else {
          res.status(400).json({ message: 'invalid permissions' })
        }
      } else {
        res.status(400).json({ message: 'invalid entry' })
      }
    } else {
      res.status(400).json({ message: 'entry identifier or entry does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests for retrieving a users entry to be edited
  *
  * @param {string} JWT is required before request can be handled
  * @param {Number} entryId is required for identifying entry to retrieve suggestions for
  *
*/
router.get('/edit/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const entryId = req.params.id
    if (validId(entryId)) {
      const select = `SELECT entries.title, entries.entry, entries.unit_code, units.title As unitTitle FROM entries INNER JOIN units ON entries.unit_code=units.code 
                      WHERE id=${entryId} AND user_id=${userId}`
      const record = await query(select)
      if (record[0].length === 1) {
        removeTagsFromTitles(record)
        record[0][0].entry = filterEntry(record[0][0].entry, true)
        res.status(200).json(record[0][0])
      } else {
        res.status(400).json({ message: 'resource does not exist' })
      }
    } else {
      res.status(400).json({ message: 'resource does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/*
  _________________________________________________________________________________________________________________________________________

  Entry viewing routes
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles requests for retrieving list of public entries for a unit
  *
  * @param {string} unitCode is required for identifying which entries to retrieve
  *
*/
router.get('/:id/view', verifyToken, async (req, res) => {
  try {
    const unitCode = req.params.id
    const userId = req.userId
    if (validUnitCode(unitCode)) {
      const enrolments = await query(`SELECT unit_code FROM enrolments WHERE user_id=${userId}`)
      if (enrolments[0].length > 0) {
        let hasEnrolled = false
        for (let i = 0; i < enrolments[0].length; ++i) {
          if (enrolments[0][i].unit_code === unitCode) {
            hasEnrolled = true
            break
          }
        }
        if (hasEnrolled) {
          const record = await query(`SELECT * FROM units WHERE code='${unitCode}'`)
          if (record[0].length > 0) {
            const entries = await query(`SELECT entries.id, entries.title, entries.created, entries.updated, entries.positive, entries.negative, users.username FROM entries INNER JOIN users ON entries.user_id=users.id WHERE entries.unit_code='${unitCode}' AND private=FALSE`)
            removeTagsFromTitles(entries)
            res.status(200).json(entries[0])
          } else {
            res.status(400).json({ message: 'unit does not exist or letters in code are not capitalised' })
          }
        } else {
          res.status(400).json({ message: 'not enrolled in unit' })
        }
      }
    } else {
      res.status(400).json({ message: 'unit does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests for retrieving a public entry
  *
  * @param {number} entryId is required for identifying which entries to retrieve
  *
*/
router.get('/view/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    if (validId(req.params.id)) {
      const select = `SELECT entries.title, entries.entry, entries.created, entries.updated, entries.unit_code, 
                      entries.positive, entries.negative, entries.private, users.username 
                      FROM entries INNER JOIN users ON users.id=entries.user_id WHERE entries.id=${req.params.id};`
      const record = await query(select)
      if (record[0].length === 1) {
        const userRecord = await query(`SELECT id FROM users WHERE username='${record[0][0].username}'`)
        if (record[0][0].private === 1 && userRecord[0][0].id !== userId) {
          res.status(400).json({ message: 'resource does not exist' })
        } else {
          record[0][0].entry = filterEntry(record[0][0].entry, true)
          removeTagsFromTitles(record)
          res.status(200).json(record[0][0])
        }
      } else {
        res.status(400).json({ message: 'resource does not exist' })
      }
    } else {
      res.status(400).json({ message: 'resource does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/*
  _________________________________________________________________________________________________________________________________________

  Entry commenting routes
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles requests for adding a reply to an entry or comment
  *
  * @param {string} content the content of the reply
  * @param {number} entryId the entry to add the reply to
  * @param {number} commentId the comment to add the reply to
  *
*/
router.post('/add-reply', verifyToken, async (req, res) => {
  try {
    const { content, entryId, commentId } = req.body
    const userId = req.userId
    if (validContent(content) && validId(entryId)) {
      const select = `SELECT id FROM entries WHERE id=${entryId}`
      const entry = await query(select)
      const newContent = addTags(content)
      if (validId(commentId)) {
        const select2 = `SELECT id, entry_id FROM replies WHERE id=${commentId}`
        const comment = await query(select2)
        if (comment[0].length === 1 && entry[0].length === 1) {
          if (comment[0][0].entry_id === entry[0][0].id) {
            const insert = `INSERT INTO replies(reply, replyTo, user_id, entry_id, created) 
                            VALUES ('${JSON.stringify({ content: newContent })}', ${commentId}, ${userId}, ${entryId}, NOW());`
            await query(insert)
            res.status(200).json({ message: 'added reply' })
          } else {
            res.status(400).json({ message: 'entry or comment does not exist' })
          }
        } else {
          res.status(400).json({ message: 'entry or comment does not exist' })
        }
      } else {
        if (entry[0].length === 1) {
          const insert = `INSERT INTO replies(reply, user_id, entry_id, created) 
                          VALUES ('${JSON.stringify({ content: newContent })}', ${userId}, ${entryId}, NOW());`
          await query(insert)
          res.status(200).json({ message: 'added reply' })
        } else {
          res.status(400).json({ message: 'entry does not exist' })
        }
      }
    } else {
      res.status(400).json({ message: 'entry or comment does not exist' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests for retrieving comments for an entry
  *
  * @param {number} entryId the id of the entry to retrieve the comments of
  *
*/
router.get('/view/:id/replies', verifyToken, async (req, res) => {
  try {
    const entryId = req.params.id
    const userId = req.userId
    if (validId(+entryId)) {
      const entry = await query(`SELECT unit_code FROM entries WHERE id=${entryId}`)
      if (entry[0].length === 1) {
        const enrolled = await query(`SELECT * FROM enrolments WHERE user_id=${userId} AND unit_code='${entry[0][0].unit_code}'`)
        if (enrolled[0].length === 1) {
          const select1 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username 
                           FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.entry_id=${entryId} AND replies.replyTo IS NULL`
          const comments = await query(select1)
          const select2 = `SELECT replies.id, replies.reply, replies.replyTo, replies.created, users.username 
                           FROM replies INNER JOIN users ON users.id=replies.user_id WHERE replies.entry_id=${entryId} AND replies.replyTo IS NOT NULL`
          const replies = await query(select2)
          res.status(200).json({ comments: comments[0], replies: replies[0] })
        } else {
          res.status(400).json({ message: 'not enrolled in unit' })
        }
      } else {
        res.status(400).json({ message: 'entry does not exist' })
      }
    } else {
      res.status(400).json({ message: 'invalid entry identifier' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/*
  _________________________________________________________________________________________________________________________________________

  Misc.
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles requests for retrieving all public entry information of a user
  *
  * @param {string} username the user to retrieve the public entries of
  *
*/
router.get('/public/:id', verifyToken, async (req, res) => {
  try {
    const username = req.params.id
    if (validUsername(username)) {
      const user = await query(`SELECT id FROM users WHERE username='${username}'`)
      if (user[0].length > 0) {
        const publicEntries = await query(`SELECT id, title, created, updated, unit_code, positive, negative FROM entries WHERE user_id=${user[0][0].id} AND private=FALSE`)
        removeTagsFromTitles(publicEntries)
        res.status(200).json(publicEntries[0])
      } else {
        res.status(400).json({ message: 'invalid credentials' })
      }
    } else {
      res.status(400).json({ message: 'invalid credentials' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Handles requests retrieving all of a users entry information
  *
  * @param {string} username the user to retrieve the public entries of
  *
*/
router.get('/dashboard/:id', verifyToken, async (req, res) => {
  try {
    const username = req.params.id
    const userId = req.userId
    if (validUsername(username)) {
      const getId = await query(`SELECT id FROM users WHERE username='${username}' AND id=${userId}`)
      if (getId[0].length > 0) {
        const select =
          `SELECT entries.id, entries.title, users.username, entries.created, entries.updated, units.title AS unit_title, units.code, entries.positive, entries.negative
           FROM entries INNER JOIN units ON entries.unit_code=units.code
           INNER JOIN enrolments ON units.code=enrolments.unit_code
           INNER JOIN users ON enrolments.user_id=users.id
           WHERE enrolments.user_id=${userId};`
        const result = await query(select)
        removeTagsFromTitles(result)
        res.status(200).json(result[0])
      } else {
        res.status(400).json({ message: 'user does not exist' })
      }
    } else {
      res.status(400).json({ message: 'invalid credentials' })
    }
  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/**
  * Not functional
  *
*/
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {

  } catch (err) {
    console.trace(err)
    res.status(400).json({ message: 'server error' })
  }
})

/*
  _________________________________________________________________________________________________________________________________________

  Helper functions
  _________________________________________________________________________________________________________________________________________
*/

/**
  * Handles checking if an entry has valid structure, properties, and data
  *
  * @param {JSON} entry the entry to be validated
  *
*/
function isValidEntry (entry) {
  let validChildList = true
  for (let i = 0; i < entry.length; ++i) {
    const hasType = 'type' in entry[i]
    const hasChildren = 'children' in entry
    if (!hasType && !hasChildren) {
      const isText = 'text' in entry[i]
      if (!isText) return false
      else if (typeof entry[i].text !== 'string') return false
    } else {
      if (Array.isArray(entry[i].children) && typeof entry[i].type === 'string') {
        validChildList = isValidEntry(entry[i].children)
      } else return false
    }
  }
  return true && validChildList
}

/**
  * Handles filtering the entry of illegal characters
  *
  * @param {JSON} entry the entry to be filtered
  *
*/
function filterEntry (entry, removeTags) {
  for (let i = 0; i < entry.length; ++i) {
    if (entry[i].type !== undefined) {
      entry[i].type = removeTags ? _removeTags(entry[i].type) : addTags(entry[i].type)
      entry.children = filterEntry(entry[i].children, removeTags)
    } else if (entry[i].text !== undefined) {
      entry[i].text = removeTags ? _removeTags(entry[i].text) : addTags(entry[i].text)
    }
  }
  return entry
}

export default router
