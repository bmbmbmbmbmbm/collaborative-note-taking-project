import { Router } from 'express'
import { login, register } from '../services/authentication-service.js'

const router = Router()

router.post('/login', async (req, res) => {
    try {
        const body = await login(req.body)
        res.status(200).json(body)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { user, token } = register(req.body)
        req.session.user = user
        res.status(200).json({ token })
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

export default router
