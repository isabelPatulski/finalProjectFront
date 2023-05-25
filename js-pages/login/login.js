
import { LOCAL_SERVER_URL } from "../../settings.js";
import {handleErrors, makeOptions} from "../../fetchUtils.js";


const URL = LOCAL_SERVER_URL + "api/auth"

export function setupLoginHandlers() {
    document.getElementById("btn-login").onclick = login
}

async function login() {
    /*evt.preventDefault()*/
    const credentials = {}
    credentials.email = document.getElementById("email").value
    credentials.password = document.getElementById("password").value

    fetch(URL, makeOptions("POST", credentials))
        .then(res => handleErrors(res))
        .then(newCustomer => {
            document.getElementById("btn-login").innerText = JSON.stringify(newCustomer)
        })
        .catch(error => console.error(error))
}
    
    
    
    
    /*fetch('http://localhost:8080/api/auth',
    { method:postMessage,
    body: JSON.stringify({
        email: 'fln@dfsfd.dk',
        password: '1234'}),
        headers: {
            'Content-type': 'application/JSON; charset=UTF-8',
        }
    });
    fetch(options)
        .then(res => handleErrors(res))
        .then(credentials => {
            document.getElementById("btn-register").innerText = JSON.stringify(credentials)
        })
        .catch(error => console.error(error))*/





