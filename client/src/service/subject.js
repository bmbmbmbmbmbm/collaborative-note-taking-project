import { subjectUrls } from "./routes";

const headers = {
    "authorization": localStorage.getItem('token'),
    "Content-Type": "application/json"
}

export async function getSubjects() {
    try {
        return await fetch(subjectUrls.base, { method: "GET", headers: { "Content-Type": "application/json" }}).then((response) => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function getUserSubject(user) {
    try { 
        return await fetch(subjectUrls.getUserSubject(user), { method: "GET", headers: headers }).then((response) => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function getUserUnits(user) {
    try {
        return await fetch(subjectUrls.getUserUnits(user), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}

export async function enrol(body) {
    try { 
        return await fetch(subjectUrls.enrol, { method: "POST", headers: headers, body: JSON.stringify(body)}).then(response => response.status === 200) 
    } catch(err) {
        console.error()
    }
}

export async function getUnitTitle(unitId) {
    try {
        return await fetch(subjectUrls.getUnitTitle(unitId), { method: "GET", headers: headers }).then(response => response.json())
    } catch(err) {
        console.error(err)
    }
}