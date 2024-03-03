const bcrypt = require("bcrypt");
const db = require("../database");
const v = require("../validation");

async function setPassword(email, password) {
    let hashed;
    bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
            throw new Error(err);
        }
        hashed = hash;
    })
    await db.query(`UPDATE users SET password='${hashed}' WHERE email='${email}'`)
}

async function passwordCheck(userId, email, password) {
    const [results,] = await db.query(`SELECT * FROM users WHERE email='${email}' AND id=${userId}`)
    bcrypt.compare(password, results[0].password, async (err, result) => {
        if (err) {
            throw new Error(err)
        }
        if (!result) {
            throw new Error(`Attempt to change password for ${email} failed. Passwords did not match during crypt comparison.`)
        }
    })
}

async function changePassword(userId, { email, oldPassword, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword ||
        !v.validEmail(email, "@bath.ac.uk") ||
        !v.validPassword(oldPassword) ||
        !v.validPassword(newPassword) ||
        !v.validPassword(confirmPassword)) {
        throw new Error(`Attempt to change password for ${email} failed initial checks.`)
    }

    passwordCheck(userId, email, oldPassword)
    setPassword(email, newPassword)
}

module.exports = {
    changePassword
}