import { LOCAL_SERVER_URL } from "../../settings.js";
import { handleErrors, makeOptions } from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL + "api/ingredients";

export function getAllIngredients() {
  fetch(URL)
    .then((res) => res.json())
    .then((ingredients) => {
      makeRows(ingredients);
    })
    .catch((e) => console.error(e));

  const searchInput = document.getElementById("ingredient-searchInput");
  searchInput.addEventListener("input", handleSearch);

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll(".rows-with-ingredients");

    rows.forEach((row) => {
      const name = row.dataset.name.toLowerCase();

      if (name.includes(query)) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  }
}

let deleteButtonId = 1;

function makeRows(rows) {
  const trows = rows
    .map((ingredient) => {
      const deleteButtonIdString = `btn-delete-ingredient-${deleteButtonId}`;
      deleteButtonId++; // Increment the counter for the next ID
      const formattedPrice = ingredient.price.toLocaleString("da-DK", {
        style: "currency",
        currency: "DKK",
      });

      return `
        <tr class="rows-with-ingredients" data-price="${ingredient.price}" data-name="${ingredient.name}">
          <td>${ingredient.name}</td>
          <td style="text-align: right;">${formattedPrice}</td>
          <td>${ingredient.measurementType}</td>
          <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
        </tr>
      `;
    })
    .join("\n");

  document.getElementById("ingredients-table-body").innerHTML = trows;

  document.getElementById("sort-price").addEventListener("click", handleSort);

  document
    .getElementById("ingredients-table-body")
    .addEventListener("click", handleDeleteIngredient);
}

export async function handleDeleteIngredient(event) {
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const buttonId = event.target.id;
    const row = event.target.parentNode.parentNode;
    const ingredientName = row.querySelector("td:first-child").textContent;

    try {
      const response = await fetch(`${URL}/${encodeURIComponent(ingredientName)}`, makeOptions("DELETE"));
      console.log(response); // Log the response

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

export function addIngredientElement() {
  document.getElementById("saveNewIngredient").onclick = addIngredient;
}

function addIngredient() {
  const ingredient = {};
  ingredient.name = document.getElementById("input-name").value;
  ingredient.price = document.getElementById("input-price").value;
  ingredient.measurementType = document.getElementById("input-measurementType").value;

  fetch(URL, makeOptions("POST", ingredient))
    .then((res) => res.json())
    .then((newIngredient) => {
      document.getElementById("saveNewIngredient").innerText = JSON.stringify(newIngredient);
    })
    .catch((error) => console.error(error));
}
///FJERNET AASYNC
export function setupIngredientFormHandlers() {
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

let sortDirection =  1;

function handleSort(event) {
  event.preventDefault();

  const rows = Array.from(document.querySelectorAll(".rows-with-ingredients"));
  const sortedRows = rows.sort((a, b) => {
    const aPrice = parseFloat(a.getAttribute("data-price"));
    const bPrice = parseFloat(b.getAttribute("data-price"));
    return (aPrice - bPrice) * sortDirection;
  });

  sortDirection *= -1;

  const recipeList = document.getElementById("ingredients-table-body");
  recipeList.innerHTML = "";
  sortedRows.forEach((row) => {
    recipeList.appendChild(row);
  });

  const button = document.getElementById("sort-price");
  button.classList.toggle("asc", sortDirection === 1);
  button.classList.toggle("desc", sortDirection === -1);
}