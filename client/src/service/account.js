import { accountUrls } from "./routes";

export async function changePassword(body) {
    try {
        await fetch(accountUrls.changePassword, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            },
            body: JSON.stringify(body)
        })
    } catch(err) {
        console.error(err);
    }
}

export async function deleteAccount(body) {
    try {
        await fetch(accountUrls.delete, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            },
            body: JSON.stringify(body)
        })
    } catch(err) {
        console.error(err);
    }
}