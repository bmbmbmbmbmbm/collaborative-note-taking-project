import { Router } from 'express'
import verifyToken from '../verify.js'
import { changePassword } from '../services/account-service.js'

const router = Router()

router.put('/change-password', verifyToken, async function (req, res) {
    try {
        changePassword(req.userId, req.body)
        res.status(200)
    } catch (err) {
        console.log(err)
        res.status(400)
    }
})

router.post('/delete', verifyToken, async function (req, res) {
    try {
        const { email, password } = req.body
    } catch (err) {

    }
})

export default router
