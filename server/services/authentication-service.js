const v = require("../validation")
const jwt = require("jsonwebtoken")
const { execute } = require("../database")
const { getUser, getUsers, addUser } = require("../repositories/user-repository")
const { compareHash, createHash } = require("../helpers/password-helper")
const { getSubject } = require("../repositories/subject-repository")
require("dotenv").config()

async function login({ email, password }) {
    if (!v.validEmail(email, "@bath.ac.uk") || !v.validPassword(password)) {
        throw new Error(`authentication-service: user credentials invalid - ${email}`)
    }

    const user = await getUser(email)
    const passwordsMatch = await compareHash(password, user.password)
    if (!passwordsMatch) {
        throw new Error(`authentication-service: passwords did not match - ${email}`)
    }

    await execute(`INSERT INTO session(user_id, start) VALUES (${user.id}, NOW())`)

    console.trace(`authentication-service: successful login - ${email}`)

    return {
        token: jwt.sign({
            id: user.id,
            username: user.username
        }, process.env.SECRET)
    }
}

async function register({ email, password, subject_id }) {
    if (!v.validEmail(email, "@bath.ac.uk") || !v.validPassword(password) || !v.validId(subject_id)) {
        throw new Error("Credentials invalid")
    }

    const users = await getUsers(email)

    if (users.length) {
        throw new Error(`User ${email} exists`)
    }

    const subject = getSubject(subject_id)
    const hashed = createHash(password)

    await addUser(email, hashed, subject.id)
    const user = await getUser(email)
    const token = jwt.sign({ 
        id: user.id, 
        username: user.username 
    }, process.env.SECRET)

    return { user, token }
}

module.exports = {
    login,
    register
}