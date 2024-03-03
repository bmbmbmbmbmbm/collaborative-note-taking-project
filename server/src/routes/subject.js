import { Router } from 'express'
import { query } from '../data/database.js'
import verifyToken from '../verify.js'
import { enrol, getSubject, getUnits } from '../services/subject-service.js'

const router = Router()

router.post('/enrol', verifyToken, async (req, res) => {
    try {
        enrol(req)
        res.status(200)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.get('/get-units/:id', verifyToken, async (req, res) => {
    try {
        const units = await getUnits(req)
        res.status(200).json(units)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.get('/get-subject/:id', verifyToken, async (req, res) => {
    try {
        const subject = await getSubject(req)
        res.status(200).json(subject)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const units = await getUnits(req)
        res.status(200).json(units)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.get('/', async (_, res) => {
    try {
        const results = await query('SELECT * FROM subjects')
        res.status(200).json(results[0])
    } catch (err) {
        console.trace(err)
        res.status(400).json({ message: 'server error' })
    }
})

export default router
