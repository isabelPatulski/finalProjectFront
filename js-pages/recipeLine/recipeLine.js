import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {getRecipeDetails} from "../recipe/recipe.js";

const URL = LOCAL_SERVER_URL+"api/recipeLines"
const URLIngredients = LOCAL_SERVER_URL+"api/ingredients"


export function getAllRecipeLines(){
  fetch(URL)
  .then(res=>res.json())
  .then(recipeLines=>{
    
  makeRows(recipeLines)
    
  })
  .catch(e=>console.error(e))
}


function makeRows(rows) {
  // Retrieve the selected recipe name from localStorage
  const recipeName = localStorage.getItem('selectedRecipe');
  
  // Filter the rows based on the recipe name
  const filteredRows = rows.filter(recipeLines => recipeLines.recipeName === recipeName);
  
  // Generate the HTML rows for the filtered recipe lines
  const trows = filteredRows.map(recipeLines => {
    return `
      <tr class="rows-with-recipeLines">
        <td hidden>${recipeLines.id}</td>
        <td>${recipeLines.amount}</td>
        <td>${recipeLines.measurementType}</td>
        <td>${recipeLines.ingredientName}</td>
        <td hidden>${recipeLines.recipeName}</td>
      </tr>
    `;
  }).join("\n");
  
  // Set the HTML rows in the target element
  document.getElementById("recipeLines-rows").innerHTML = trows;
}

export function addRecipeLinesElement(){
    document.getElementById("saveNewRecipeLine").onclick = addRecipeLine
}


function addRecipeLine(){
const recipeLine = {}
recipeLine.recipeName = document.getElementById("input-recipeName").innerHTML;
recipeLine.ingredientName = document.getElementById("ingredientsDrop").value;
recipeLine.measurementType = document.getElementById("input-measurementType").value;
recipeLine.amount = document.getElementById("input-amount").value;
  

fetch(URL, makeOptions("POST", recipeLine))
    .then(res => res.json())
    .then(newRecipeLine => {
      document.getElementById("saveNewRecipeLine").innerText = JSON.stringify(newRecipeLine)
    })
    .catch(error => console.error(error));

    document.location.href="http://127.0.0.1:5502/#/recipeLine";
    getRecipeDetails(recipeLine.recipeName);
  
}



export async function setupRecipeLineFormHandlers() {
  const addButton = document.getElementById("open-button");
  const closeButton = document.getElementById("btnCancel");

  addButton.addEventListener("click", showRecipeLineForm);
  closeButton.addEventListener("click", hideRecipeLineForm);
}

function showRecipeLineForm(event) {
  event.preventDefault(); // Prevent form submission and page refresh
  document.getElementById("myForm").style.display = "block";

  let ingredientsDropdown = document.getElementById("ingredientsDrop");
  ingredientsDropdown.innerHTML = ""; // Clear existing options

  let defaultOption = new Option('Select ingredient', '', true, true);
  defaultOption.disabled = true;
  ingredientsDropdown.appendChild(defaultOption);

  fetch(URLIngredients)
    .then(res => res.json())
    .then(data => {
      data.forEach(ingredient => {
        let option = new Option(ingredient.name);
        ingredientsDropdown.appendChild(option);
      });
    });
    document.getElementById("input-recipeName").innerHTML=document.getElementById("recipe-name").innerHTML;

}

function hideRecipeLineForm() {
  document.getElementById("myForm").style.display = "none";
}



