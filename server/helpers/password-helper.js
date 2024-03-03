import { hash as hashValue, compare } from 'bcrypt'

async function createHash (password) {
    let hashed
    await hashValue(password, 10, async (err, hash) => {
        if (err) {
            throw new Error(err)
        }
        hashed = hash
    })
    return hashed
}

async function compareHash (incoming, password) {
    let match
    await compare(incoming, password, async (err, result) => {
        if (err) {
            throw new Error(err)
        }
        match = result
    })
    return match
}

export {
    createHash,
    compareHash
}
