import { LOCAL_SERVER_URL } from "../../settings.js";
import { handleErrors, makeOptions } from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/user";

export function setupLoginHandlers() {
  //Håndtere login når der trykkes på "btn-login" via eventhandler
  document.getElementById("btn-login").onclick = login;
}

async function login(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  const credentials = {};
  //Får brugerInput
  credentials.email = document.getElementById("email").value;
  credentials.password = document.getElementById("password").value;
  //Formatering til email
  var emailFormat = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

  if (credentials.password === "") {
    alert("Password field cannot be empty!");
    return;
  }
  //Fetch til backend med login oplysninger
  await fetch(URL+'/login', makeOptions("POST", credentials))
    .then(res => handleErrors(res))
    .then(newUser => {
      //Reload af siden så menu bliver opdateret
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
      alert("Wrong password or email");
    });
}
