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
const register = require('./routes/register');
const login = require('./routes/login');
const entries = require('./routes/entries');
const threads = require('./routes/threads');
const subject = require('./routes/subject');
const account = require('./routes/account');

app.use('/login', login);
app.use('/register', register);
app.use('/entry', entries);
app.use('/threads', threads);
app.use('/subject', subject);
app.use('/account', account);
 
module.exports = app.listen(5000, () => { console.log("localhost:5000") });