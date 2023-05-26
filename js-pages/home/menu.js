
import { LOCAL_SERVER_URL } from "../../settings.js";
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/auth"

export async function showMenu (){
    console.log("Show menu")
    const resp = await fetch(URL);
    const respData = await resp.text();
    showHideMenu(respData);    
    
}

function showHideMenu (s){
    console.log(s)
    if (s === "false"){
        document.getElementById('menu-logged-in').hidden=true;
        document.getElementById('menu-not-logged-in').hidden=false;
    } else{
        document.getElementById('menu-logged-in').hidden=false;
        document.getElementById('menu-not-logged-in').hidden=true;
    }
}






