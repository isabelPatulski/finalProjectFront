import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL+"api/recipes"

export function getAllRecipes(){
    fetch(URL)
    .then(res=>res.json())
    .then(recipes=>{
      
      makeRows(recipes)
      
    })
    .catch(e=>console.error(e))
  }
    
  function makeRows(rows) {
    const trows = rows.map(recipe => {
      return `
        <tr class="recipe-rows recipe-link" data-recipe="${recipe.name}" onclick="handleRecipeRowClick(event)">
          <td>${recipe.name}</td>
          <td>${recipe.mealType}</td>
          <td>${recipe.description}</td>
        </tr>
      `;
    }).join("\n");
    document.getElementById("recipe-list").innerHTML = trows;
  
    const recipeRows = document.getElementsByClassName("recipe-rows");
    Array.from(recipeRows).forEach(row => {
      row.addEventListener("click", event => handleRecipeRowClick(event));
    });
  }  
  

  export function handleRecipeRowClick(event) {
    const clickedRow = event.currentTarget;
    const recipeName = clickedRow.dataset.recipe;
    getRecipeDetails(recipeName);
  }

export function getRecipeDetails(recipeName) {
  const recipeDetailsURL = `${URL}/${encodeURIComponent(recipeName)}`;
  const options = makeOptions("GET");

  fetch(recipeDetailsURL, options)
    .then(handleErrors)
    .then(res => res.json())
    .then(recipeDetails => {

      document.getElementById("recipe-name").innerText = recipeDetails.name;
      document.getElementById("recipe-description").innerText = recipeDetails.description;
      document.getElementById("meal-type").innerText = recipeDetails.mealType;

    
    })
    .catch(error => console.error(error));
}

  

  export function addRecipeElement(){
    document.getElementById("addRecipe").onclick = addRecipe
}

function addRecipe(){
const recipe = {}
recipe.name = document.getElementById("recipe-name").value
recipe.mealType = document.getElementById("mealTypes").value
recipe.description = document.getElementById("recipe-description").value

fetch(URL, makeOptions("POST", recipe))
    .then(res => res.json())
    .then(newRecipe => {
      document.getElementById("addRecipe").innerText = JSON.stringify(newRecipe)
    })
    .catch(error => console.error(error))
}



  













/*
// Get DOM elements
const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');

let recipes = [];

// Handle form submit
function handleSubmit(event) {
  // Prevent default form submission behavior
  event.preventDefault();
  
  // Get recipe input values
  const nameInput = document.querySelector('#recipe-name');
  const ingrInput = document.querySelector('#recipe-ingredients');
  const descriptionInput = document.querySelector('#recipe-description');
  const mealTypeInput = document.querySelector('#recipe-mealType');
  const name = nameInput.value.trim();
  const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
  const method = methodInput.value.trim();
  
  // Check if recipe name, ingredients, and method are valid
  if (name && ingredients.length > 0 && method) {
    // Create new recipe object and add it to recipes array
    const newRecipe = { name, ingredients, method };
    recipes.push(newRecipe);
    
    // Clear form inputs
    nameInput.value = '';
    ingrInput.value = '';
    methodInput.value = '';
    
    // Add new recipe to recipe list
    displayRecipes();
  }
}

export function getAllRecipes(){
    fetch(URL)
    .then(res=>res.json())
    .then(recipes=>{
      
      makeRows(recipes)
      
    })
    .catch(e=>console.error(e))
  }

// Display recipes in recipe list
function displayRecipes() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
	// Create div to display the individual recipe, for each recipe
    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="delete-button" data-index="${index}">Delete</button>`;
    recipeDiv.classList.add('recipe');
    recipeList.appendChild(recipeDiv);
  });
  // Display warning when there are no recipes in the list
  if (recipes.length > 0) {
	noRecipes.style.display = 'none';
  }
  else {
	noRecipes.style.display = 'flex';
  }
}

// Handle recipe deletion
function handleDelete(event) {
  if (event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index, 1);
    displayRecipes();
	searchBox.value = '';
  }
}

// Search recipes by search query
function search(query) {
  const filteredRecipes = recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(query.toLowerCase());
  });
  recipeList.innerHTML = '';
  filteredRecipes.forEach(recipe => {
    const recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="delete-button" data-index="${recipes.indexOf(recipe)}">
		Delete
	  </button>`;
    recipeEl.classList.add('recipe');
    recipeList.appendChild(recipeEl);
  });
}

// Add event listeners
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);
searchBox.addEventListener('input', event => search(event.target.value));*/