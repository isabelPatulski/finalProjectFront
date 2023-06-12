import { LOCAL_SERVER_URL } from "../../settings.js";
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/user"
export function setupLogoutHandler() {
  document.getElementById("btn-logout").onclick = logout;
  }
  
  async function logout() {
    fetch(URL + "/logout", makeOptions("POST")) 
      .then(res => handleErrors(res))
      .then(response => {
        alert("Logged out successfully");
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        
      });
  }
