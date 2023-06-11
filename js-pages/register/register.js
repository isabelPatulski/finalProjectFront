import { handleErrors, makeOptions } from "../../fetchUtils.js";
import { LOCAL_SERVER_URL } from "../../settings.js";

const URL = LOCAL_SERVER_URL + "api/user";

export function setupRegisterHandlers() {
  document.getElementById("btn-register").onclick = registerUser;
}

function registerUser(event) {
    event.preventDefault();
  const user = {};
  user.email = document.getElementById("input-email").value;
  user.password = document.getElementById("input-password").value;

  console.log(user);

  fetch(URL, makeOptions("POST", user))
    .then(res => handleErrors(res))
    .then(newUser => {
      document.getElementById("btn-register").innerText = JSON.stringify(newUser);
      redirectToLogin(); // Redirect to login page
    })
    .catch(error => console.error(error));
}

function redirectToLogin() {
  window.location.href = "http://127.0.0.1:5502/#/login";
}