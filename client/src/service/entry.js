import { entryUrls } from "./routes";

const headers = {
    "authorization": localStorage.getItem('token'),
    "Content-Type": "application/json"
}

export async function create(body) {
    try {
        const { id } = await fetch(entryUrls.create, { method: "POST", headers: headers, body: JSON.stringify(body) }).then(response => response.json())
        return id
    } catch (err) {
        console.error(err);
    }
}

export async function update(body) {
    try {
        await fetch(entryUrls.update, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(body)
        })
    } catch (err) {
        console.error(err)
    }
}

export async function edit(entryId) {
    try {
        const { title, unitTitle, code, entry } = await fetch(entryUrls.edit(entryId), { method: "GET", headers: headers, }).then((response) => response.json())
        return { title, unitTitle, code, entry }
    } catch (err) {
        console.error(err)
    }
}

export async function getThisUsersEntries(user) {
    try {
        return await fetch(entryUrls.getThisUsersEntries(user), { method: "GET", headers: headers}).then(response => response.json())
    } catch (err) {
        console.error(err)
    }
}

export async function editDiff(entryId) {
    try {
        const {title, unitTitle, unit_code, username, entry} = await fetch(entryUrls.editDiff(entryId), { method: "GET", headers: headers}).then(response => response.json())
        return { title, unitTitle, unitCode: unit_code, username, entry }
    } catch (err) {
        console.error(err)
    }
}

export async function createEdit(body) {
    try {
        await fetch(entryUrls.createEdit, { method: "POST", headers: headers, body: JSON.stringify(body) })
    } catch(err) {
        console.error(err)
    }
}

export async function view(entryId) {
    try { 
        const { title, entry, username, created, updated, unit_code } = await fetch(entryUrls.viewEntry(entryId), { method: "GET", headers: headers}).then(response => response.json())
        return { title, entry, username, created, updated, unitCode: unit_code }
    } catch(err) {
        console.error(err)
    }
}

export async function getReplies(entryId) {
    try {
        return await fetch(entryUrls.getReplies(entryId), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function getUserEntries(user) {
    try {
        return await fetch(entryUrls.getUserEntries(user), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function addReplyToEntry(body) {
    try {
        await fetch(entryUrls.addReply, { method: "POST", headers: headers, body: JSON.stringify(body),})
    } catch(err) {
        console.error(err)
    }
}

export async function getUnitEntries(unitId) {
    try {
        return await fetch(entryUrls.getUnitEntries(unitId), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}