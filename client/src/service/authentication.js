import { authenticationUrls } from "./routes";

export async function login(body) {
    const { token } = await fetch(authenticationUrls.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => response.json())
    return token
}