import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL+"api/ingredients"

export function getAllIngredients(){
  fetch(URL)
  .then(res=>res.json())
  .then(ingredients=>{
    
    makeRows(ingredients)
    
  })
  .catch(e=>console.error(e))
}

let deleteButtonId = 1; 

function makeRows(rows) {
  const trows = rows.map(ingredients => {
    const deleteButtonIdString = `btn-delete-ingredient-${deleteButtonId}`;
    deleteButtonId++; // Increment the counter for the next ID

    return `
      <tr class="rows-with-ingredients">
        <td>${ingredients.name}</td>
        <td>${ingredients.price}</td>
        <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
      </tr>
    `;
  }).join("\n");
  document.getElementById("ingredients-rows").innerHTML = trows;

  document.getElementById("ingredients-rows").addEventListener("click", handleDelete);
}

export async function handleDelete(event) {
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const buttonId = event.target.id;
    const row = event.target.parentNode.parentNode;
    const ingredientName = row.querySelector("td:first-child").textContent;

    try {
      const response = await fetch(`${URL}/${encodeURIComponent(ingredientName)}`, makeOptions("DELETE"));
      console.log(response); // Log the response for debugging

      if (response.ok) {
        row.remove();
      } else {
        throw new Error("Delete request failed");
      }
    } catch (error) {
      console.error(error.message);
    }
  }
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

function showIngredientForm(event) {
  event.preventDefault(); // Prevent form submission and page refresh

  document.getElementById("myForm").style.display = "block";
}

function hideIngredientForm() {
  document.getElementById("myForm").style.display = "none";
}


