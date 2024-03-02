const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();


const store = new session.MemoryStore();
const app = express();

app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 30000 },
    resave: true,
    saveUninitialized: true,
    store
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, _, next) => {
    console.log(`${req.method}: ${req.url}`)
    next();
})

// Defining routes in the server
const authentication = require('./routes/authentication');
const entries = require('./routes/entries');
const threads = require('./routes/threads');
const subject = require('./routes/subject');
const account = require('./routes/account');

app.use('/authentication', authentication);
app.use('/entry', entries);
app.use('/threads', threads);
app.use('/subject', subject);
app.use('/account', account);
 
module.exports = app.listen(5000, () => { console.log("localhost:5000") });