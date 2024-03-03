import { Router } from 'express'
import { query } from '../repositories/database.js'
import verifyToken from '../verify.js'
import { validUnitCode, validUsername } from '../validation.js'
import { enrol } from '../services/subject-service.js'

const router = Router()

router.post('/enrol', verifyToken, async function (req, res) {
    try {
        enrol(req)
        res.status(200)
    } catch (err) {
        console.log(err)
        res.status(400)
    }
})

router.get('/get-units/:id', verifyToken, async function (req, res) {
    try {
        const username = req.params.id
        if (validUsername(username)) {
            const user = await query(
                `SELECT * FROM users WHERE username='${username}'`
            )
            if (user[0].length > 0) {
                const select = `SELECT units.code, units.title FROM units INNER JOIN enrolments ON units.code=enrolments.unit_code
                                INNER JOIN users ON users.id=enrolments.user_id WHERE users.username='${username}';`
                const result = await query(select)
                res.status(200).json(result[0])
            } else {
                res.status(400).json({ message: 'invalid credentials' })
            }
        } else {
            res.status(400).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
})

router.get('/get-subject/:id', verifyToken, async function (req, res) {
    try {
        const username = req.params.id
        if (validUsername(username)) {
            const user = await query(
                `SELECT subject_id FROM users WHERE username='${username}'`
            )
            if (user[0].length > 0) {
                const record = await query(
                    `SELECT title FROM subjects WHERE id=${user[0][0].subject_id}`
                )
                res.status(200).json(record[0][0])
            } else {
                res.status(400).json({ message: 'invalid credentials' })
            }
        } else {
            res.status(400).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
})

router.get('/titleof/:id', verifyToken, async function (req, res) {
    try {
        const code = req.params.id
        if (validUnitCode(code)) {
            const title = await query(`SELECT title FROM units WHERE code='${code}'`)
            if (title[0].length === 1) {
                res.status(200).json(title[0][0])
            } else {
                res.status(400).json({ message: 'unit does not exist' })
            }
        } else {
            res.status(400).json({ message: 'invalid unit code' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
})

router.get('/:id', verifyToken, async function (req, res) {
    try {
        const user = req.params.id
        if (validUsername(user)) {
            const select1 = `SELECT subjects.title FROM subjects INNER JOIN users ON users.subject_id=subjects.id WHERE users.username='${user}'`
            const subject = await query(select1)
            const select2 = `SELECT units.code, units.title FROM units INNER JOIN subject_unit 
                        ON units.code=subject_unit.unit_code 
                        INNER JOIN subjects ON subject_unit.subject_id=subjects.id 
                        WHERE subjects.title='${subject[0][0].title}';`
            const results = await query(select2)
            res.status(200).json(results[0])
        } else {
            res.status(400).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
})

router.get('/', async function (req, res) {
    try {
        const results = await query('SELECT * FROM subjects')
        res.status(200).json(results[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
})

export default router
