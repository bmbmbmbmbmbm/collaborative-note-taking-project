const express = require('express');
const session = require('express-session');
const cors = require('cors');

const store = new session.MemoryStore();
const app = express();

app.use(session({
    secret: "aISxTgwXv6COzRBj4xK34NVvhe7PTqBjP7Tfh0ORcHTxuaAPWRtw2nCZCruQPq4NyxqMcIhPG1Nyq6skY4RXCkPrXQOkvcwEBxuD008mZlkCF4QXT38QqPpFHiQOSDGF",
    cookie: { maxAge: 30000 },
    saveUninitialized: false,
    store
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`)
    next();
})

// Defining routes in the server
const authentication = require('./controller/authentication');
const entries = require('./controller/entries');
const threads = require('./controller/threads');
const subject = require('./controller/subject');
const account = require('./controller/account');

app.use('/authentication', authentication);
app.use('/entry', entries);
app.use('/threads', threads);
app.use('/subject', subject);
app.use('/account', account);
 
module.exports = app.listen(5000, () => { console.log("localhost:5000") });