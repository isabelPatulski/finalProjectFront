import { LOCAL_SERVER_URL } from "../../settings.js";
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/user"

export async function isLoggedIn(){
    const resp = await fetch(URL+'/loggedIn');
    const respData = await resp.text();
    console.log("Show menu: "+respData)
    return (respData == "true");
}

export async function showMenu (){
    let loggedin = await isLoggedIn();
    showHideMenu(loggedin);    
}

function showHideMenu (s){
    console.log(s)
    if (s==false){
        document.getElementById('loggedInMenu').hidden=true;
        document.getElementById('loggedOutMenu').hidden=false;
    } else{
        document.getElementById('loggedInMenu').hidden=false;
        document.getElementById('loggedOutMenu').hidden=true;
    }
}