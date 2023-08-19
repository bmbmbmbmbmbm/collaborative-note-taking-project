import { threadUrls } from "./routes";

const headers =  {
    "Content-Type": "application/json",
    "authorization": localStorage.getItem('token')
}

export async function getUserThreads(user) {
    try {
        return await fetch(threadUrls.getUserThreads(user), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function create(body) {
    try {
        return await fetch(threadUrls.create, { method: 'POST', headers: headers, body: JSON.stringify(body) })
                    .then(response => ({ status: response.status, data: response.json() }))
    } catch(err) {
        console.error(err)
    }
}

export async function addReplyToThread(body) {
    try {
        await fetch(threadUrls.addReply, { method: "POST", headers: headers, body: JSON.stringify(body),})
    } catch(err) {
        console.error(err)
    }
}

export async function getThread(threadId) {
    try {
        const { title, thread, username, created, last_reply, unit_code } = await fetch(threadUrls.getThread(threadId), { method: "GET", headers: headers }).then(response => response.json())
        return { title, thread, username, created, lastReply: last_reply, unitCode: unit_code }
    } catch(err) {
        console.error(err)
    }
}

export async function getThreadReplies(threadId) {
    try { 
        return await fetch(threadUrls.getThreadReplies(threadId), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function getUnitThreads(unitId) {
    try {
        return await fetch(threadUrls.getUnitThreads(unitId), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}