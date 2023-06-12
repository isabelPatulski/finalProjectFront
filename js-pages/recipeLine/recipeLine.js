import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {getRecipeDetails} from "../recipe/recipe.js";

const URL = LOCAL_SERVER_URL+"api/recipeLines"
const URLIngredients = LOCAL_SERVER_URL+"api/ingredients"
const URLRecipes = LOCAL_SERVER_URL+"api/recipes"



export function getAllRecipeLines(){
  fetch(URL)
  .then(res=>res.json())
  .then(recipeLines=>{
    
  makeRows(recipeLines)
    
  })
  .catch(e=>console.error(e))
}

let deleteButtonId = 1; 

function makeRows(rows) {
  const recipeName = localStorage.getItem('selectedRecipe');
  const filteredRows = rows.filter(recipeLines => recipeLines.recipeName === recipeName);

  let totalPrice = 0;

  const trows = filteredRows.map(recipeLines => {
    const deleteButtonIdString = `btn-delete-recipeLine-${deleteButtonId}`;
    deleteButtonId++;

const ingredientDetailsPromise = fetch(`${URLIngredients}/${encodeURIComponent(recipeLines.ingredientName)}`)
.then(res => res.json());

return ingredientDetailsPromise.then(ingredient => {
// Calculate the price based on ingredient price and recipe line amount
const price = ingredient.price * recipeLines.amount;
      totalPrice += price;
const formattedPrice = price.toLocaleString("da-DK", {
      style: "currency",
      currency: "DKK",
    });
return `
  <tr class="rows-with-recipeLines">
    <td hidden>${recipeLines.id}</td>
    <td>${recipeLines.ingredientName}</td>
    <td>${ingredient.measurementType}</td>
    <td>${recipeLines.amount}</td>
    <td hidden>${recipeLines.recipeName}</td>
    <td style="text-align: right;">${formattedPrice}</td>
    <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
  </tr>
      `;
    });
  });


  // Set the HTML rows in the target element
  Promise.all(trows).then(htmlRows => {
    const totalPriceField = document.getElementById("recipeTotalPrice");
    totalPriceField.textContent = `Total Price: ${totalPrice.toFixed(2)}`; // Display the total price with two decimal places
    document.getElementById("recipeLines-rows").innerHTML = htmlRows.join("\n");

    // Handle the delete
    document.getElementById("recipeLines-rows").addEventListener("click", handleDeleteLine);
  });
}

export function calculateTotalPrice(recipeLines) {
  let totalPrice = 0;

  recipeLines.forEach(recipeLine => {
    totalPrice += recipeLine.price * recipeLine.amount;
  });

  return totalPrice;
}



export async function handleDeleteLine(event) {
  //Same function as in ingredient.js, but instead of ingredientName as an attribute it has RecipeLineID
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const buttonId = event.target.id;
    const row = event.target.parentNode.parentNode;
    const recipeLineID = row.querySelector("td:first-child").textContent;

    const confirmed = confirm("Are you sure you want to delete this?");
    if (confirmed) {
    try {
      const response = await fetch(`${URL}/${encodeURIComponent(recipeLineID)}`, makeOptions("DELETE"));

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
}

export function addRecipeLinesElement(){
    document.getElementById("saveNewRecipeLine").onclick = addRecipeLine
}


function addRecipeLine() {
  const recipeLine = {};
  recipeLine.recipeName = document.getElementById("input-recipeName").innerHTML;
  recipeLine.ingredientName = document.getElementById("ingredientsDrop").value;
  recipeLine.amount = document.getElementById("input-amount").value;

  fetch(`${URLIngredients}/${encodeURIComponent(recipeLine.ingredientName)}`)
    .then(res => res.json())
    .then(ingredient => {
      recipeLine.price = ingredient.price;
      return fetch(URL, makeOptions("POST", recipeLine));
    })
    .then(res => res.json())
    .then(newRecipeLine => {
      document.getElementById("saveNewRecipeLine").innerText = JSON.stringify(newRecipeLine);
      getRecipeDetails(recipeLine.recipeName);
    })
    .catch(error => console.error(error));

  document.location.href = "http://127.0.0.1:5502/#/recipeLine";
}



export async function setupRecipeLineFormHandlers() {
  const addButton = document.getElementById("open-button");
  const closeButton = document.getElementById("btnCancel");

  addButton.addEventListener("click", showRecipeLineForm);
  closeButton.addEventListener("click", hideRecipeLineForm);
}

function showRecipeLineForm(event) {
  event.preventDefault(); 
  document.getElementById("myForm").style.display = "block";

  let ingredientsDropdown = document.getElementById("ingredientsDrop");
  ingredientsDropdown.innerHTML = ""; 

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

// EDIT 
let recipeName; // Declare recipeName variable at a higher scope

export function handleEditRecipe() {
  document.querySelector('.edit-button').addEventListener('click', openEditPopup);
}

function openEditPopup(event) {
  event.preventDefault();
  // Get the current recipe details
  recipeName = document.querySelector('.recipe-name').textContent;
  const recipeDescription = document.querySelector('.recipe-description').textContent;
  const mealType = document.querySelector('.meal-type').textContent;

  // Set the values in the edit popup
  document.getElementById('edit-name').textContent = recipeName;
  document.getElementById('edit-description').value = recipeDescription;
  document.getElementById('edit-meal-type').value = mealType;

  document.querySelector('.popup-overlay').style.display = 'flex';

  const saveButton = document.querySelector('.save-button');
  const cancelButton = document.querySelector('.cancel-button');

  // Remove any existing click event listeners
  saveButton.removeEventListener('click', handleSave);
  cancelButton.removeEventListener('click', handleCancel);

  saveButton.addEventListener('click', handleSave);

  cancelButton.addEventListener('click', handleCancel);
}


function handleSave(event) {
  event.preventDefault();

  const updatedDescription = document.getElementById('edit-description').value;
  const updatedMealType = document.getElementById('edit-meal-type').value;

  const updatedRecipe = {
    description: updatedDescription,
    mealType: updatedMealType
  };

  // Send the updated recipe data to the backend
  fetch(URLRecipes + "/" + recipeName, makeOptions("PUT", updatedRecipe))
    .then(res => res.json())
    .then(updatedRecipe => {
      document.getElementById("save-button").innerText = JSON.stringify(updatedRecipe)
      document.querySelector('.popup-overlay').style.display = 'none';
    })
    .catch(error => {
      console.error(error);
    });
}

function handleCancel(event) {
  event.preventDefault();
  document.querySelector('.popup-overlay').style.display = 'none';
}

export function printRecipe()
{
  let recipeName = document.getElementById("recipe-name").innerText;
  let printHtml = "<html><head><title>"
  + recipeName+"</title></head><body>"
  + "<div id=RecipeHeader>"
  + "<H1>Recipe: "+recipeName+"</H1><br>"
  + "<H2>Mealtype: "+document.getElementById("meal-type").innerHTML+"</H2><br>"
  + "<H2>Description: "+document.getElementById("recipe-description").innerHTML+"</H2><br>"
  + "</div>"
  +document.getElementById("seeRecipeLine").innerHTML
  +"</body></html>";
  var printWindow = window.open("");
  printWindow.document.write(printHtml);  
  printWindow.print();
  printWindow.close();
}
