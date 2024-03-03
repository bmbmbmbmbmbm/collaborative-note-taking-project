import { execute } from './database'

async function deleteUserEnrolments (userId) {
    await execute(`DELETE FROM enrolments WHERE user_id='${userId}'`)
}

async function enrolUser (userId, units) {
    let insert = 'INSERT INTO enrolments(unit_code, user_id) VALUES '
    units.forEach((unit, index) => {
        switch (index) {
            case units.length - 1:
                insert += ` ('${unit.code}', ${userId});`
                break
            default:
                insert += ` ('${unit.code}', ${userId}),`
                break
        }
    })
    await execute(insert)
}

export {
    deleteUserEnrolments,
    enrolUser
}
