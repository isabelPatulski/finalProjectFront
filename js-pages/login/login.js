import { LOCAL_SERVER_URL } from "../../settings.js";
import { handleErrors, makeOptions } from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/auth";

export function setupLoginHandlers() {
  document.getElementById("btn-login").onclick = login;
}

async function login(event) {
  event.preventDefault();
  const credentials = {};
  credentials.email = document.getElementById("email").value;
  credentials.password = document.getElementById("password").value;
  var emailFormat = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

  if (credentials.password === "") {
    alert("Password field cannot be empty!");
    return;
  }

  fetch(URL, makeOptions("POST", credentials))
    .then(res => handleErrors(res))
    .then(newUser => {
      document.getElementById("btn-login").innerText = JSON.stringify(newUser);
      document.getElementById("user-email").innerText = credentials.email; // Update user email
      // Redirect to front page or perform other actions
    })
    .catch(error => {
      console.error(error);
      alert("Wrong password or email");
    });
}
