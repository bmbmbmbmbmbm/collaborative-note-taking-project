const express = require('express');
const app = express();

// Sets up routes to be used for specific or general pages

const entryRouter = require('./routes/entry-display/Entry');
app.use("/entry", entryRouter);

const createEntryRouter = require('./routes/entry-creator/EntryCreator');
app.use("/entry-creator", createEntryRouter);

app.listen(5000, () => { console.log("server port 5000") });