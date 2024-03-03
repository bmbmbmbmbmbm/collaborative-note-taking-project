import { deleteUserEnrolments, enrolUser } from '../repositories/enrolment-repository.js'
import { validUnitCode } from '../validation.js'

function validateUnits (units) {
    let valid = true
    if (!Array.isArray(units)) return false
    units.forEach(function (unit) {
        if (!Object.prototype.hasOwnProperty.call(unit, 'title') || !Object.prototype.hasOwnProperty.call(unit, 'code')) {
            valid = false
        } else if (typeof unit.title !== 'string' || typeof unit.code !== 'string') {
            valid = false
        } else if (!validUnitCode(unit.code)) {
            valid = false
        }
    })
    return valid
}

async function enrol ({ userId, body }) {
    const { units } = body
    if (!validateUnits(units)) {
        throw new Error()
    }
    await deleteUserEnrolments(userId)
    await enrolUser(userId, units)
}

export {
    enrol
}
