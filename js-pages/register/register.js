import { handleErrors, makeOptions } from "../../fetchUtils.js";
import { LOCAL_SERVER_URL } from "../../settings.js";

const URL = LOCAL_SERVER_URL + "api/user";

export function setupRegisterHandlers() {
  //Eventhandler til registrering af en ny bruger
  document.getElementById("btn-register").onclick = registerUser;
}

function registerUser(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  const user = {};
  //Får og sætter inputs fra user til variabler
  user.email = document.getElementById("input-email").value;
  user.password = document.getElementById("input-password").value;
  const confirmPassword = document.getElementById("input-confirm-password").value;

  if (user.password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!validateEmail(user.email)) {
    alert("Invalid email address");
    return;
  }
  //Fetch til backend med info om user
  fetch(URL, makeOptions("POST", user))
    .then(res => handleErrors(res))
    .then(newUser => {
      //Redirect så man kommer til login siden
      location.replace("http://127.0.0.1:5502/#/login");
    })
    .catch(error => console.error(error));
}
//Sørger for email er en email
function validateEmail(email) {
  const emailFormat = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return emailFormat.test(email);
}

