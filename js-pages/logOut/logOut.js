import { LOCAL_SERVER_URL } from "../../settings.js";
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/auth"
export function setupLogoutHandler() {
    document.getElementById("btn-logout").addEventListener("click", logout);
  }
  
  async function logout() {
    fetch(URL + "/logout", makeOptions("POST")) // Adjust the URL endpoint based on your server's API
      .then(res => handleErrors(res))
      .then(response => {
        // Handle successful logout
        alert("Logged out successfully");
        // Redirect the user to the login page or perform any other desired action
      })
      .catch(error => {
        console.error(error);
        // Handle error during logout
        // Display an error message or perform any other desired action
      });
  }
  