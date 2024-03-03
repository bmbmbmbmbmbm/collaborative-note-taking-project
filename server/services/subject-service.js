import { deleteUserEnrolments, enrolUser } from '../repositories/enrolment-repository.js'
import { getUserUnits } from '../repositories/unit-repository.js'
import { getUserByName } from '../repositories/user-repository.js'
import { getSubject as getSubjectById } from '../repositories/subject-repository.js'
import { validUnitCode, validUsername } from '../validation.js'

const service = 'subject-service'

function validateUnits (units) {
    if (!Array.isArray(units)) return false
    return !units.some(unit =>
        !('title' in unit) ||
        !('code' in unit) ||
        typeof unit.title !== 'string' ||
        typeof unit.code !== 'string' ||
        !validUnitCode(unit.code)
    )
}

async function enrol ({ userId, body }) {
    const { units } = body
    if (!validateUnits(units)) {
        throw new Error(`${service}::enrol() ${userId} provided invalid units`)
    }
    await deleteUserEnrolments(userId)
    await enrolUser(userId, units)
}

async function getUnits ({ params }) {
    const username = params.id
    if (!validUsername(username)) {
        throw new Error(`${service}::getUnits() ${username} does not exist`)
    }
    const user = getUserByName(username)
    if (!user) {
        throw new Error(`${service}::getUnits() ${username} does not exist`)
    }
    return await getUserUnits(user.id)
}

async function getSubject ({ params }) {
    const username = params.id
    if (!validUsername(username)) {
        throw new Error(`${service}::getSubject() ${username} does not exist`)
    }
    const user = getUserByName(username)
    if (!user) {
        throw new Error(`${service}::getSubject() ${username} does not exist`)
    }
    const subject = getSubjectById(user.subject_id)
    return subject
}

export {
    enrol,
    getUnits,
    getSubject
}
