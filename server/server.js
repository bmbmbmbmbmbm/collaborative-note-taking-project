import express, { json, urlencoded } from 'express'
import session, { MemoryStore } from 'express-session'
import cors from 'cors'
import env from 'dotenv'

// Defining routes in the server
import authentication from './routes/authentication.js'
import entries from './routes/entries.js'
import threads from './routes/threads.js'
import subject from './routes/subject.js'
import account from './routes/account.js'

env.config()

const store = new MemoryStore()
const app = express()

app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 30000 },
    resave: true,
    saveUninitialized: true,
    store
}))

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

app.use((req, _, next) => {
    console.log(`${req.method}: ${req.url}`)
    next()
})

app.use('/authentication', authentication)
app.use('/entry', entries)
app.use('/threads', threads)
app.use('/subject', subject)
app.use('/account', account)

export default app.listen(5000, () => { console.log('localhost:5000') })
