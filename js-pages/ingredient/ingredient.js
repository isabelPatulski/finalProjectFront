import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL+"api/ingredients"

let allIngredients = []

export function getAllIngredients(){
  if(allIngredients.length > 0){
    makeRows(allIngredients)
    return
  } 
  fetch(URL)
  .then(res=>res.json())
  .then(ingredients=>{
    
    makeRows(ingredients)
    allIngredients = ingredients
    console.log(ingredients)
  })
  .catch(e=>console.error(e))
}

function makeRows(rows){
  const trows = rows.map(ingredients=> `
  <tr class="rows-with-ingredients">
  <td> ${ingredients.name} </td>
  <td> ${ingredients.price} </td>
  <td><button id="btn-delete-ingredien" type="button" class="deleteButton">Delete</button></td>
  </tr>
  `).join("\n")
  document.getElementById("ingredients-rows").innerHTML = trows
}

export function addIngredientElement(){
    document.getElementById("saveNewIngredient").onclick = addIngredient
}

function addIngredient(){
const ingredient = {}
ingredient.name = document.getElementById("input-name").value
ingredient.price = document.getElementById("input-price").value

fetch(URL, makeOptions("POST", ingredient))
    .then(res => res.json())
    .then(newIngredient => {
        document.getElementById("saveNewIngredient").innerText = JSON.stringify(newIngredient)
    })
    .catch(error => console.error(error))
}

export async function setupIngredientFormHandlers() {
  const addButton = document.getElementById("open-button");
  const closeButton = document.getElementById("btnCancel");

  addButton.addEventListener("click", showIngredientForm);
  closeButton.addEventListener("click", hideIngredientForm);
}

function showIngredientForm() {
  document.getElementById("myForm").style.display = "block";
}

function hideIngredientForm() {
  document.getElementById("myForm").style.display = "none";
}