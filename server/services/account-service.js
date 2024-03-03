import { hash as _hash, compare } from "bcrypt";
import { query } from "../repositories/database.js";
import { validEmail, validPassword } from "../validation.js";

async function setPassword(email, password) {
    let hashed;
    _hash(password, 10, async function (err, hash) {
        if (err) {
            throw new Error(err);
        }
        hashed = hash;
    })
    await query(`UPDATE users SET password='${hashed}' WHERE email='${email}'`)
}

async function passwordCheck(userId, email, password) {
    const [results,] = await query(`SELECT * FROM users WHERE email='${email}' AND id=${userId}`)
    compare(password, results[0].password, async (err, result) => {
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
        !validEmail(email, "@bath.ac.uk") ||
        !validPassword(oldPassword) ||
        !validPassword(newPassword) ||
        !validPassword(confirmPassword)) {
        throw new Error(`Attempt to change password for ${email} failed initial checks.`)
    }

    passwordCheck(userId, email, oldPassword)
    setPassword(email, newPassword)
}

export {
    changePassword
}