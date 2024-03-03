import JWT from 'jsonwebtoken'
import { validEmail, validPassword, validId } from '../validation.js'
import { execute } from '../repositories/database.js'
import { getUser, getUsers, addUser } from '../repositories/user-repository.js'
import { compareHash, createHash } from '../helpers/password-helper.js'
import { getSubject } from '../repositories/subject-repository.js'
import env from 'dotenv'

env.config()
const sign = JWT.sign

async function login ({ email, password }) {
    if (!validEmail(email, '@bath.ac.uk') || !validPassword(password)) {
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
        token: sign({
            id: user.id,
            username: user.username
        }, process.env.SECRET)
    }
}

async function register ({ email, password, subjectId }) {
    if (!validEmail(email, '@bath.ac.uk') || !validPassword(password) || !validId(subjectId)) {
        throw new Error('Credentials invalid')
    }

    const users = await getUsers(email)

    if (users.length) {
        throw new Error(`User ${email} exists`)
    }

    const subject = getSubject(subjectId)
    const hashed = createHash(password)

    await addUser(email, hashed, subject.id)
    const user = await getUser(email)
    const token = sign({
        id: user.id,
        username: user.username
    }, process.env.SECRET)

    return { user, token }
}

export {
    login,
    register
}
