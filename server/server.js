const express = require('express');
const session = require('express-session');

const store = new session.MemoryStore();
const app = express();

app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 30000 },
    saveUninitialized: false,
    store
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use('/login', login);
app.use('/register', register);
app.use('/entry', entries);
app.use('/threads', threads);
app.use('/subject', subject);

app.listen(5000, () => { console.log("localhost:5000") });