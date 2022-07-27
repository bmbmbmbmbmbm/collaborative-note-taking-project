const express = require('express');
const db = require('../database');
const auth = require('../verify');

const router = express.Router();

// Used to check what units to enrol and un-enrol. Both inputs should be JSON.
function exclusiveTo(A, B) {
    // Creates an array of true values, indicating exclusivity. Logic here is assuming all items are exclusive until found otherwise.
    let result = Array.apply(null, Array(A.length)).map(function () { return true; })
    // Runs through A and B checking for ununique elements
    for (var i = 0; i < B.length; ++i) {
        for (var j = 0; j < A.length; ++j) {
            // Is this element unique to A?
            if (A[j].code === B[i].code) {
                // No, uncheck it.
                result[j] = false;
            }
        }
    }

    let exclusive = [];
    var j = 0;

    // Creates the exclusive array. In other words, it's A - B where A and B are sets.
    for (var i = 0; i < A.length; ++i) {
        if (result[i]) {
            exclusive[j] = A[i];
            ++j;
        }
    }
    return exclusive;
}

router.post('/enrol', auth.verifyToken, async function (req, res) {
    try {
        const { username, userId, units } = req.body;
        if (username && userId && units) {
            const select = `SELECT units.code, units.title FROM units INNER JOIN enrolments ON units.code=enrolments.unit_code WHERE enrolments.user_id=${userId}`;
            const currentUnits = await db.promise().query(select)
            const toAdd = exclusiveTo(units, currentUnits[0]);
            const toRemove = exclusiveTo(currentUnits[0], units);

            if (toAdd.length > 0) {
                let insert = `INSERT INTO enrolments(unit_code, user_id) VALUES `;
                for (var i = 0; i < toAdd.length; ++i) {
                    if (i === toAdd.length - 1) {
                        insert += ` ('${toAdd[i].code}', ${user[0][0].id});`;
                    } else {
                        insert += ` ('${toAdd[i].code}', ${user[0][0].id}),`;
                    }
                }
                await db.promise().query(insert);
            }

            if (toRemove.length > 0) {
                let del = `DELETE FROM enrolments WHERE user_id=${user[0][0].id} AND (`;
                for (var i = 0; i < toRemove.length; ++i) {
                    if (i === toRemove.length - 1) {
                        del += ` unit_code='${toRemove[i].code}');`
                    } else {
                        del += `unit_code='${toRemove[i].code}' OR`
                    }
                }
                await db.promise().query(del);
            }
            
            res.status(200).json({ message: 'handled enrolment' });
        } else {
            res.status(400).json({ message: 'User does not exist' });
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/get-units/:id', async function (req, res) {
    try {
        const username = req.params.id;
        if (username) {
            const user = await db.promise().query(`SELECT * FROM users WHERE username='${username}'`);
            if (user[0].length > 0) {
                const select = `SELECT units.code, units.title FROM units INNER JOIN enrolments ON units.code=enrolments.unit_code
                        INNER JOIN users ON users.id=enrolments.user_id WHERE users.username='${username}';`;
                const result = await db.promise().query(select);
                res.status(200).json(result[0]);
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
})

router.get('/get-subject/:id', async function (req, res) {
    try {
        const username = req.params.id;
        if (username) {
            const user = await db.promise().query(`SELECT subject_id FROM users WHERE username='${username}'`);
            if (user[0].length > 0) {
                const record = await db.promise().query(`SELECT title FROM subjects WHERE id=${user[0][0].subject_id}`)
                res.status(200).json(record[0][0]);
            } else {
                res.status(400).json({ message: "invalid credentials" });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/titleof/:id', async function (req, res) {
    try {
        const code = req.params.id;
        if (code) {
            const title = await db.promise().query(`SELECT title FROM units WHERE code='${code}'`);
            if (title[0].length === 1) {
                res.status(200).json(title[0][0]);
            } else {
                res.status(404);
            }
        } else {
            res.status(400);
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

router.get('/:id', async function (req, res) {
    try {
        const user = req.params.id;
        const select1 = `SELECT subjects.title FROM subjects INNER JOIN users ON users.subject_id=subjects.id WHERE users.username='${user}'`;
        const subject = await db.promise().query(select1);
        const select2 = `SELECT units.code, units.title FROM units INNER JOIN subject_unit 
                        ON units.code=subject_unit.unit_code 
                        INNER JOIN subjects ON subject_unit.subject_id=subjects.id 
                        WHERE subjects.title='${subject[0][0].title}';`
        const results = await db.promise().query(select2);
        res.status(201).json(results[0]);
    } catch (err) {
        console.log(err);
        res.status(404);
    }
})

router.get('/', async function (req, res) {
    try {
        const results = await db.promise().query(`SELECT * FROM subjects`);
        res.status(201).json(results[0]);
    } catch (err) {
        console.log(err);
        res.status(404);
    }
})

module.exports = router;