import { hash as _hash, compare } from 'bcrypt'
import { query } from '../repositories/database.js'
import { validEmail, validPassword } from '../validation.js'
import { getUserByEmail, removeUser } from '../repositories/user-repository.js'

const service = 'account-service'

async function setPassword (email, password) {
    let hashed
    _hash(password, 10, async function (err, hash) {
        if (err) {
            throw new Error(`${service}::setPassword() ${err}`)
        }
        hashed = hash
    })
    await query(`UPDATE users SET password='${hashed}' WHERE email='${email}'`)
}

async function passwordCheck (userId, email, password) {
    const [results] = await query(`SELECT * FROM users WHERE email='${email}' AND id=${userId}`)
    compare(password, results[0].password, async (err, result) => {
        if (err) {
            throw new Error(err)
        }
        if (!result) {
            throw new Error(`${service}::passwordCheck() ${email} invalid credentials`)
        }
    })
}

async function changePassword (userId, { email, oldPassword, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword ||
        !validEmail(email, '@bath.ac.uk') ||
        !validPassword(oldPassword) ||
        !validPassword(newPassword) ||
        !validPassword(confirmPassword)) {
        throw new Error(`${service}::changePassword() ${email} invalid credentials`)
    }

    passwordCheck(userId, email, oldPassword)
    setPassword(email, newPassword)
}

async function removeAccount ({ email, password }) {
    if (!validEmail(email, '@bath.ac.uk') || !validPassword(password)) {
        throw new Error(`${service}::removeAccount() ${email} invalid credentials`)
    }
    const user = await getUserByEmail(email)
    const match = await passwordCheck(user.id, user.email, user.password)
    if (!match) {
        throw new Error(`${service}::removeAccount() ${email} passwords did not match`)
    }
    await removeUser(email)
}

export {
    changePassword,
    removeAccount
}
