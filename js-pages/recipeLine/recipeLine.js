import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {getRecipeDetails} from "../recipe/recipe.js";
import { printRecipe } from "../recipe/recipe.js";

const URL = LOCAL_SERVER_URL+"api/recipeLines"
const URLIngredients = LOCAL_SERVER_URL+"api/ingredients"
const URLRecipes = LOCAL_SERVER_URL+"api/recipes"


export function getAllRecipeLines(){
  //Fetch til backend for at kunne hente RecipeLines fra backend
  fetch(URL)
  .then(res=>res.json())
  .then(recipeLines=>{
   //Benytter makeRows functionen 
  makeRows(recipeLines)
    
  })
  .catch(e=>console.error(e))
}

let deleteButtonId = 1; 

function makeRows(rows) {
  //Bruges i recipeDetails (Tror jeg?) Eller bliver variablen bare gemt lokalt? Flemming
  const recipeName = localStorage.getItem('selectedRecipe');
  //Sørger for de rækker der bliver vist på siden kun er dem der matcher det recipeName der er blevet klikket på
  const filteredRows = rows.filter(recipeLines => recipeLines.recipeName === recipeName);

  let totalPrice = 0;

  const trows = filteredRows.map(recipeLines => {
    //Sætter delete button ved hver row
    const deleteButtonIdString = `btn-delete-recipeLine-${deleteButtonId}`;
    deleteButtonId++;
//Flemming
const ingredientDetailsPromise = fetch(`${URLIngredients}/${encodeURIComponent(recipeLines.ingredientName)}`)
.then(res => res.json());

return ingredientDetailsPromise.then(ingredient => {
// Beregner prisen 
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

  //VEd ikke om det her overhovedet er nødvendigt mere når nu vi bruger din måde istedet?
  Promise.all(trows).then(htmlRows => {
    const totalPriceField = document.getElementById("recipeTotalPrice");
    totalPriceField.textContent = `Total Price: ${totalPrice.toFixed(2)}`; // Display the total price with two decimal places
    document.getElementById("recipeLines-rows").innerHTML = htmlRows.join("\n");

    //Eventhandler til delete af recipeLine
    document.getElementById("recipeLines-rows").addEventListener("click", handleDeleteLine);
  });
}
//Igen -skal det bare slettes?
export function calculateTotalPrice(recipeLines) {
  let totalPrice = 0;

  recipeLines.forEach(recipeLine => {
    totalPrice += recipeLine.price * recipeLine.amount;
  });

  return totalPrice;
}

//Flemming
export async function handleDeleteLine(event) {
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const confirmed = confirm("Are you sure you want to delete this?");
    if (confirmed) {
      try {
        const row = event.target.closest("tr");
        const recipeLineID = row.querySelector("td:first-child").textContent;

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


export function addRecipeLinesElement() {
  document.getElementById("saveNewRecipeLine").onclick = addRecipeLine;

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteLine);
  });
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
      window.location.href = "http://127.0.0.1:5502/#/recipeLine?";
    })
    .catch(error => console.error(error));

    
  }


export function setupRecipeLineFormHandlers() {
  const addButton = document.getElementById("open-button");
  const closeButton = document.getElementById("btnCancel");

  addButton.addEventListener("click", showRecipeLineForm);
  closeButton.addEventListener("click", hideRecipeLineForm);
}

function showRecipeLineForm(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
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
let recipeName; 

export function handleEditRecipe() {
  document.querySelector('.edit-button').addEventListener('click', openEditPopup);
}

function openEditPopup(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  // Få detaljerne om recipe som de er nu
  recipeName = document.querySelector('.recipe-name').textContent;
  const recipeDescription = document.querySelector('.recipe-description').textContent;
  const mealType = document.querySelector('.meal-type').textContent;

  // Sæt værdierne i pop up formen 
  document.getElementById('edit-name').textContent = recipeName;
  document.getElementById('edit-description').value = recipeDescription;
  document.getElementById('edit-meal-type').value = mealType;

  document.querySelector('.popup-overlay').style.display = 'flex';

  const saveButton = document.querySelector('.save-button');
  const cancelButton = document.querySelector('.cancel-button');

  // Fjern mulige eventhandlers der allerede eksistere (skulle tilføjes for den virkede korrekt)
  saveButton.removeEventListener('click', handleSave);
  cancelButton.removeEventListener('click', handleCancel);

  saveButton.addEventListener('click', handleSave);

  cancelButton.addEventListener('click', handleCancel);
}

//Bruges hvis man vælger at trykke "save"
function handleSave(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)

  const updatedDescription = document.getElementById('edit-description').value;
  const updatedMealType = document.getElementById('edit-meal-type').value;
  //Nye værdier bliver sat
  const updatedRecipe = {
    description: updatedDescription,
    mealType: updatedMealType
  };

  // Send the updated recipe data to the backend
  fetch(URLRecipes + "/" + recipeName, makeOptions("PUT", updatedRecipe))
  .then(res => {
    if (res.ok) {
      document.getElementById("save-button").innerText = JSON.stringify(updatedRecipe);
      document.querySelector('.popup-overlay').style.display = 'none';
      window.location.href = "http://127.0.0.1:5502/#/recipe"; //Redirect, men det virker ikke
    } else {
      throw new Error("Save request failed");
    }
  })
    .catch(error => {
      console.error(error);
    });
}
//Bruges hvis man trykker cancel i popUp formen
function handleCancel(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  document.querySelector('.popup-overlay').style.display = 'none';
}

export function printRecipeElement(){
  document.getElementById("print-button").onclick = printRecipe;
}
