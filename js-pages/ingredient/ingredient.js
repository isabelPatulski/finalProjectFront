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
  <td><button id="btn-edit-ingredient" type="button" class="editButton" >Edit</button><td>
  <td> ${ingredients.id} </td>
  <td> ${ingredients.name} </td>
  <td> ${ingredients.price} </td>
  <td><button id="btn-delete-ingredien" type="button" class="deleteButton">Delete</button><td>
  </tr>
  `).join("\n")
  document.getElementById("ingredients-rows").innerHTML = trows
}

export function addIngredientElement(){
    document.getElementById("btn-add-ingredient").onclick = addIngredient
}

function addIngredient(){
const ingredient = {}
ingredient.name = document.getElementById("input-name").value
ingredient.price = document.getElementById("input-price").value

fetch(URL, makeOptions("POST", ingredient))
    .then(res => res.json())
    .then(newIngredient => {
        document.getElementById("ingredient-info-all").innerText = JSON.stringify(newIngredient)
    })
    .catch(error => console.error(error))
}