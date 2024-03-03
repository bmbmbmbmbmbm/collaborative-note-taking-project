import { Router } from 'express'
import verifyToken from '../verify.js'
import { changePassword, removeAccount } from '../services/account-service.js'

const router = Router()

router.put('/change-password', verifyToken, async function (req, res) {
    try {
        changePassword(req.userId, req.body)
        res.status(200)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

router.post('/delete', verifyToken, async function (req, res) {
    try {
        removeAccount(req.body)
        res.status(200)
    } catch (err) {
        console.trace(err)
        res.status(400)
    }
})

export default router
