const bcrypt = require("bcrypt")

async function createHash(password) {
    let hashed
    await bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
            throw new Error(err);
        }
        hashed = hash;
    })
    return hashed
}

async function compareHash(incoming, password) {
    let match
    await bcrypt.compare(incoming, password, async (err, result) => {
        if (err) {
            throw new Error(err)
        }
        match = result
    })
    return match
}

module.exports = {
    createHash,
    compareHash
}