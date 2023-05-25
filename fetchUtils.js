export async function handleErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const error = new Error(errorResponse.message)
        error.apiError = errorResponse
        throw error
    }
    return res.json()
}
export function makeOptions(method, body, addToken) {
    const opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if (addToken) {
        opts.headers.Authorization = "Bearer " + sessionStorage.getItem("token")
    }
    if (body) { //Observe how we can add new fields to an object when needed
        opts.body = JSON.stringify(body);
    }
    return opts;
}

