import JWT from 'jsonwebtoken'
import env from 'dotenv'

env.config()

const verify = JWT.verify

async function verifyToken (req, res, next) {
    const token = req.headers.authorization

    if (!token) {
        res.status(400)
        return
    }
    verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            res.status(400).json({ message: 'Failed authentication' })
        } else {
            req.userId = decoded.id
            req.username = decoded.username
            next()
        }
    })
}

export default verifyToken
