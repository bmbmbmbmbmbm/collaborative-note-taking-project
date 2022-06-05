const express = require('express');
const app = express();

const registerRouter = require('./routes/authentication/Register');
app.use("/register", registerRouter);

const loginRouter = require('./routes/authentication/Login');
app.use("/login", loginRouter);

const entryRouter = require('./routes/entry-display/Entry');
app.use("/entry", entryRouter);

const createEntryRouter = require('./routes/entry-creator/EntryCreator');
app.use("/entry-creator", createEntryRouter);

const entryCatalogueRouter = require('./routes/entry-catalogue/EntryCatalogue');
app.use("/entry-catalogue", entryCatalogueRouter);

const threadRouter = require('./routes/threads/Threads');
app.use("/threads", threadRouter);

app.listen(5000, () => { console.log("server port 5000") });