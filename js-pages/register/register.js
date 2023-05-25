import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {LOCAL_SERVER_URL} from "../../settings.js";

const URL = LOCAL_SERVER_URL + "api/customer"

export function setupRegisterHandlers() {
    document.getElementById("btn-register").onclick = registerCustomer
}

function registerCustomer() {
    const customer = {}
    customer.email = document.getElementById("input-email").value
    customer.username = document.getElementById("input-username").value
    customer.password = document.getElementById("input-password").value

    console.log(customer)

    fetch(URL, makeOptions("POST", customer))
        .then(res => handleErrors(res))
        .then(newCustomer => {
            document.getElementById("btn-register").innerText = JSON.stringify(newCustomer)
        })
        .catch(error => console.error(error))
}