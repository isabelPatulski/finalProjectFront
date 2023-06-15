import { LOCAL_SERVER_URL } from "../../settings.js";
import { handleErrors, makeOptions } from "../../fetchUtils.js";


//URL matcher backendAPI
const URL = LOCAL_SERVER_URL + "api/ingredients";

export function getAllIngredients() {
  //Fetcher alle ingredients fra backend og benytter "makeRows" functionen til at generer tabel til siden
  fetch(URL)
    .then((res) => res.json())
    .then((ingredients) => {
      makeRows(ingredients);
    })
    .catch((e) => console.error(e));

  const searchInput = document.getElementById("ingredient-searchInput");
  searchInput.addEventListener("input", handleSearch);

  function handleSearch() {
    //Søge funtion i tabel
    const input = searchInput.value.toLowerCase(); //Sørger for userInput bliver sat til småt
    const rows = document.querySelectorAll(".rows-with-ingredients");   // Fortæl queryselector, at den skal bruge "rows-with-ingredients" (fra makeRows) til søgning efter værdier 

    rows.forEach((row) => {                           // Tjek hver linje for match
      const name = row.dataset.name.toLowerCase();    // søg i værdier i lowercase, så det bliver uafhængigt af store/små bogstaver
      //Alt der matcher input bliver vist i "table-rows"
      if (name.includes(input)) {
        row.style.display = "table-row";    // Hvis match fundet, så vis rækken
      } else {
        row.style.display = "none";         // Hvis ikke match fundet, så skjul rækken
      }
    });
  }
}

let deleteButtonId = 1;

//Bruges til at genere tabel - fetch sker i getAllIngredients
function makeRows(rows) {
  const trows = rows
    .map((ingredient) => {
      const deleteButtonIdString = `btn-delete-ingredient-${deleteButtonId}`;
      deleteButtonId++; //Sørger for der bliver talt én op, så hver deletebutton får unik id
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

  const deleteButtons = document.querySelectorAll(".rows-with-ingredients input[type='button']");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteIngredient);
  });
}


async function handleDeleteIngredient(event) {
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const buttonId = event.target.id;
    const row = event.target.parentNode.parentNode;
    const ingredientName = row.querySelector("td:first-child").textContent;

    try {
      const response = await fetch(`${URL}/${encodeURIComponent(ingredientName)}`, makeOptions("DELETE"));

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
  //Får infor fra bruger og gemmer i "const ingredient"
  ingredient.name = document.getElementById("input-name").value;
  ingredient.price = document.getElementById("input-price").value;
  ingredient.measurementType = document.getElementById("input-measurementType").value;

  //Fetch til backend med den nye "ingredient"
  fetch(URL, makeOptions("POST", ingredient))
    .then((res) => res.json())
    .then((newIngredient) => {
      document.getElementById("saveNewIngredient").innerText = JSON.stringify(newIngredient);
      //Forsøg på redirect, kan ikke få til at virke
      window.location.href = "http://127.0.0.1:5502/#/ingredients";
    })
    .catch((error) => console.error(error));
}

export function setupIngredientFormHandlers() {
  //Definere min open og cancel button til min add ingredient form
  const addButton = document.getElementById("open-button");
  const closeButton = document.getElementById("btnCancel");

  //Handlers til add og cancel button
  addButton.addEventListener("click", showIngredientForm);
  closeButton.addEventListener("click", hideIngredientForm);
}

function showIngredientForm(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  document.getElementById("myForm").style.display = "block";
}

function hideIngredientForm() {
  document.getElementById("myForm").style.display = "none";
}

let sortDirection =  1;

function handleSort(event) {
  event.preventDefault();// Sikre der ikke sker automatisk refresh af siden(reload)

  //Forbereder array
  const rows = Array.from(document.querySelectorAll(".rows-with-ingredients"));
  //Definerer rækkefølgen der skal sorteres for pris i
  const sortedRows = rows.sort((a, b) => {
    const aPrice = parseFloat(a.getAttribute("data-price"));
    const bPrice = parseFloat(b.getAttribute("data-price"));
    return (aPrice - bPrice) * sortDirection;   //sortdirection angiver om det er fra mindst til størst eller omvendt
  });

  sortDirection *= -1;    // Husk at sortere omvendt ved næste tryk

  const recipeList = document.getElementById("ingredients-table-body");
  recipeList.innerHTML = "";
  sortedRows.forEach((row) => {
    recipeList.appendChild(row);
  });
  //Knappens retning og look
  const button = document.getElementById("sort-price");
  button.classList.toggle("asc", sortDirection === 1);
  button.classList.toggle("desc", sortDirection === -1);
}