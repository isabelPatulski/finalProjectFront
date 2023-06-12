import { LOCAL_SERVER_URL } from "../../settings.js";
import { handleErrors, makeOptions } from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/user";

export function setupLogoutHandler() {
  document.getElementById("btn-logout").onclick = logout;
}

async function logout() { //!!!!!! tilføjet await
  await fetch(URL + "/logout", makeOptions("POST"))
    .then(res => {
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      return res.text(); 
    })
    .then(response => {
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
}
