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
}

let deleteButtonId = 1;

function makeRows(rows) {
  const trows = rows
    .map((ingredients) => {
      const deleteButtonIdString = `btn-delete-ingredient-${deleteButtonId}`;
      deleteButtonId++; // Increment the counter for the next ID
      const formattedPrice = ingredients.price.toLocaleString("da-DK", {
        style: "currency",
        currency: "DKK",
      });

      return `
      <tr class="rows-with-ingredients" data-price="${ingredients.price}" data-name="${ingredients.name}">
        <td>${ingredients.name}</td>
        <td style="text-align: right;">${formattedPrice}</td>
        <td>${ingredients.measurementType}</td>
        <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
      </tr>
    `;
    })
    .join("\n");
  document.getElementById("ingredients-rows").innerHTML = trows;
  document.querySelectorAll(".sort-button").forEach((button) =>
  button.addEventListener("click", handleSort));
  document.getElementById("ingredients-rows").addEventListener("click", handleDeleteIngredient);
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

let sortDirection = {
  price: 1,
  name: 1,
};

function handleSort(event) {
  event.preventDefault()
  const sortOrder = this.dataset.sort;
  const rows = Array.from(document.querySelectorAll(".rows-with-ingredients"));
  const sortedRows = rows.sort((a, b) => {
    const aValue = a.getAttribute(`data-${sortOrder}`);
    const bValue = b.getAttribute(`data-${sortOrder}`);

    if (sortOrder === "price") {
      const aPrice = parseFloat(a.getAttribute("data-price"));
      const bPrice = parseFloat(b.getAttribute("data-price"));
      return (aPrice - bPrice) * sortDirection.price;
    } else if (sortOrder === "name") {
      return aValue.localeCompare(bValue) * sortDirection.name;
    }
  });

  sortDirection[sortOrder] *= -1;

  const tableBody = document.getElementById("ingredients-rows");
  tableBody.innerHTML = "";
  sortedRows.forEach((row) => tableBody.appendChild(row));

  const button = document.querySelector(`.sort-button[data-sort="${sortOrder}"]`);
  button.classList.toggle("asc", sortDirection[sortOrder] === 1);
  button.classList.toggle("desc", sortDirection[sortOrder] === -1);
}
