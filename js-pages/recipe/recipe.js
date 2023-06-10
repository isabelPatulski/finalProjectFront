import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {getAllRecipeLines} from "../recipeLine/recipeLine.js";



const URL = LOCAL_SERVER_URL+"api/recipes"

export function getAllRecipes() {
  fetch(URL)
    .then(res => res.json())
    .then(recipes => {
      makeRows(recipes);
    })
    .catch(e => console.error(e));
}

    
function makeRows(rows) {
  const trows = rows
    .map((recipe) => {
      const deleteButtonIdString = `btn-delete-recipe-${deleteButtonId}`;
      deleteButtonId++;
      const formattedPrice = recipe.price.toLocaleString("da-DK", {
        style: "currency",
        currency: "DKK",
      });
      return `
        <tr class="recipe-rows" data-recipe="${recipe.name}" data-price="${recipe.price}" data-name="${recipe.name}">
          <td>${recipe.name}</td>
          <td>${recipe.mealType}</td>
          <td>${recipe.description}</td>
          <td style="text-align: right;">${formattedPrice}</td>
          <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
        </tr>
      `;
    })
    .join("\n");
  document.getElementById("recipe-list").innerHTML = trows;

  const recipeRows = document.getElementsByClassName("recipe-rows");
  Array.from(recipeRows).forEach((row) => {
    row.addEventListener("click", handleRecipeRowClick);
  });

  document.getElementById("sort-price").addEventListener("click", handleSort);
}
  

  export async function handleRecipeRowClick(event) {
    const clickedRow = event.currentTarget;
    const recipeName = clickedRow.dataset.recipe;
    localStorage.setItem('selectedRecipe', recipeName);

    showRecipeDetails(recipeName)  ;
  
  }

export function getRecipeDetails(recipeName) {
  const recipeDetailsURL = `${URL}/${encodeURIComponent(recipeName)}`;

  fetch(recipeDetailsURL)
    .then(res => res.json())
    .then(recipeDetails => {
      console.log("Name: "+ recipeDetails.name);

      document.getElementById("recipe-name").innerText = recipeDetails.name;
      document.getElementById("recipe-description").innerText = recipeDetails.description;
      document.getElementById("meal-type").innerText = recipeDetails.mealType;

    })
    .catch(error => console.error(error));
}


export function addRecipeElement() {
  document.getElementById("addRecipe").onclick = addRecipe;
}

export async function showRecipeDetails(recipeName){
    localStorage.setItem('selectedRecipe', recipeName);
    document.location.href="http://127.0.0.1:5502/#/recipeLine";
      getRecipeDetails(recipeName)
      getAllRecipeLines(recipeName);
}

function addRecipe(event) {
  event.preventDefault();
  const recipe = {};
  recipe.name = document.getElementById("recipe-name").value;
  recipe.mealType = document.getElementById("mealTypes").value;
  recipe.description = document.getElementById("recipe-description").value;

  fetch(URL, makeOptions("POST", recipe))
    .then(res => res.json())
    .then(newRecipe => {
      const recipeName = encodeURIComponent(newRecipe.name);
      const params = new URLSearchParams({ name: recipeName });
    })
    .catch(error => console.error(error));

    document.location.href="http://127.0.0.1:5502/#/recipeLine";
    getRecipeDetails(recipe.name)
  }

  
let sortDirection = 1;

function handleSort(event) {
  event.preventDefault();

  const rows = Array.from(document.querySelectorAll(".recipe-rows"));
  const sortedRows = rows.sort((a, b) => {
    const aPrice = parseFloat(a.getAttribute("data-price"));
    const bPrice = parseFloat(b.getAttribute("data-price"));
    return (aPrice - bPrice) * sortDirection;
  });

  sortDirection *= -1;

  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";
  sortedRows.forEach((row) => {
    recipeList.appendChild(row);
  });

  const button = document.getElementById("sort-price");
  button.classList.toggle("asc", sortDirection === 1);
  button.classList.toggle("desc", sortDirection === -1);
}
