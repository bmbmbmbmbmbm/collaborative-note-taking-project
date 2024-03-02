async function login(email, password) {
    let body = {
        email,
        password
    }

    let request = await fetch("/authentication/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    let response = await request.json()

    if (response.token) {
        localStorage.setItem('token', response.token)
        return true;
    }

    return false;
}

async function register(email, password, subject_id) {
    let body = {
        email,
        password,
        subject_id
    }

    let request = await fetch("/authentication/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    let response = await request.json()

    if (response.token) {
        localStorage.setItem('token', response.token)
        return true
    }
    return false
}

export {
    login,
    register
}