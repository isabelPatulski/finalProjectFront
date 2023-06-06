import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL+"api/recipes"


// Get the recipe name from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const recipeName = urlParams.get("recipe");

// Retrieve the recipe details from the API or any data source
// and populate the page with the information
export function getRecipeDetails(recipeName) {
  const recipeDetailsURL = `${URL}/${encodeURIComponent(recipeName)}`;

  fetch(recipeDetailsURL)
    .then(res => res.json())
    .then(recipeDetails => {
      // Populate the recipe details on the page
      document.getElementById("recipe-name").innerText = recipeDetails.name;
      document.getElementById("recipe-description").innerText = recipeDetails.description;
      document.getElementById("meal-type").innerText = recipeDetails.mealType;

      // Populate the recipe lines below the recipe details
      // You can use a similar approach to the makeRows function
      // to populate the recipe lines dynamically
      // ...
    })
    .catch(error => console.error(error));
}

// Call the function to retrieve and populate the recipe details
getRecipeDetails(recipeName);
