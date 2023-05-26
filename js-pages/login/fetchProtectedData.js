import { handleErrors } from "../../fetchUtils.js"
import {LOCAL_SERVER_URL} from "../../settings.js";
//Refactor into a separate settings file, if used also in other files

const SERVER_URL = LOCAL_SERVER_URL + "/users"


export async function fetchData() {
    try {
        const loggedInAs = sessionStorage.getItem("logged-in-as")
        const ENDPOINT_URL = SERVER_URL + loggedInAs.toLowerCase()
        const options = {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }
        const response = await fetch(ENDPOINT_URL, options).then(res => handleErrors(res))
        document.getElementById("msg-from-server").innerText = response.msg
    } catch (err) {
        document.getElementById("error").innerText = err.message
    }

}