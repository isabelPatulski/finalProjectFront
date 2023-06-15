import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";
import {getAllRecipeLines} from "../recipeLine/recipeLine.js";

const URL = LOCAL_SERVER_URL+"api/recipes"

export function getAllRecipes() {
  //Laver et fetch kald og generer tabellen til siden ved hjælp af "makeRows" functionen
  fetch(URL)
    .then(res => res.json())
    .then(recipes => {
      makeRows(recipes);
    })
    .catch(e => console.error(e));
  
    //Search function til tabellen vi eventhandler
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", handleSearch);

  function handleSearch() {
    
    const input = searchInput.value.toLowerCase(); //Sørger for input bliver konvereret til lowerCase
    const rows = document.querySelectorAll("#recipe-list tr");    // Fortæl queryselector, at den skal bruge "recipe-list" til søgning efter værdier 

    //Retter info fra tabeller til lower case så søgning ikke afhænger af store og små bogstaver
    rows.forEach(row => {
      const name = row.querySelector("td:nth-child(1)").textContent.toLowerCase();          //1. søgekolonne er navn
      const description = row.querySelector("td:nth-child(2)").textContent.toLowerCase();   //2. søgekolonne er description
      const mealType = row.querySelector("td:nth-child(3)").textContent.toLowerCase();      //3. søgekolonne er mealtype
      //Viser resultater der matcher, tjek i alle 3 felter/kolonner
      if (name.includes(input) || description.includes(input) || mealType.includes(input)) {
        row.style.display = "table-row";    // Hvis fundet, så vis rækken i tabel
      } else {
        row.style.display = "none";         // Hvis ikke noget match, så skjul rækken i tabel
      }
    });
  }
}

let deleteButtonId = 1;

function makeRows(rows) {
  const trows = rows
    .map((recipe) => {
      //Generer delete button med uniq id - 1 for hver linje
      const deleteButtonIdString = `btn-delete-recipe-${deleteButtonId}`;
      deleteButtonId++;
      //Sørger for "formattedPrice" vises i valuta DKK
      const formattedPrice = recipe.price.toLocaleString("da-DK", {
        style: "currency",
        currency: "DKK",
      });
      return `
        <tr class="recipe-row" data-recipe="${recipe.name}" data-price="${recipe.price}" data-name="${recipe.name}">
          <td>${recipe.name}</td>
          <td>${recipe.description}</td>
          <td>${recipe.mealType}</td>
          <td style="text-align: right;">${formattedPrice}</td>
          <td><input type="button" id="${deleteButtonIdString}" value="Delete"></td>
        </tr>
      `;
    })
    .join("\n");

  document.getElementById("recipe-list").innerHTML = trows;                     // Fyld tabellinjer op med fundne data
  
  document.getElementById("sort-price").addEventListener("click", handleSort);  // Tilføj eventhandler til sort function
  
  const recipeRows = document.getElementsByClassName("recipe-row");             // Sørg for en eventhandler til hver row med  delete og handleRecipe
  Array.from(recipeRows).forEach((row) => {
    row.addEventListener("click", (event) => handleRecipeRowClick(event));
    const deleteButton = row.querySelector('input[type="button"]');
    deleteButton.addEventListener("click", (event) => handleDeleteRecipe(event));
  });
}


export async function handleDeleteRecipe(event) {
  if (event.target.nodeName === "INPUT" && event.target.type === "button") {
    const buttonId = event.target.id;
    const row = event.target.parentNode.parentNode;
    const recipeName = row.querySelector("td:first-child").textContent;     // Hent recipe name fra første kolonne - bruges til opslag ved sletning

    const confirmation = confirm("Are you sure you want to delete this recipe?");   // Dobbelttjek inden sletning

    if (confirmation) {
      try {
        const response = await fetch(`${URL}/${encodeURIComponent(recipeName)}`, makeOptions("DELETE"));  // Kald sletning via REST i backend, med recipename som nøgle

        if (response.ok) {
          row.remove();       // Hvis sletning er gået godt, så fjern linje fra tabel
        } else {
          throw new Error("Delete request failed"); 
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    event.stopPropagation();   //Gør så den ikke hopper ind på "recicpe Details" siden når der trykkes på delete knappen

  }
}

 //Bruges i makeRows og registrer hvilken row der er blevet trykket på i tabellen 
export function handleRecipeRowClick(event) {
  const clickedElement = event.target;
  if (clickedElement && clickedElement.closest(".recipe-row")) {
    const recipeName = clickedElement.closest(".recipe-row").dataset.recipe;
    if (!clickedElement.matches('input[type="button"]')) {
      //Alt efter hvilket recipeName der matcher kommer man ind på den matchene details-side (show recipe details)
      localStorage.setItem("selectedRecipe", recipeName);
      showRecipeDetails(recipeName);
    }
  }
}


export function getRecipeDetails(recipeName) {
  //Sørger for at URL bliver connectet til recipename så der feks står api/#/recipes/Lasagne
  const recipeDetailsURL = `${URL}/${encodeURIComponent(recipeName, )}`;

  //Fetch med recipeName
  fetch(recipeDetailsURL)
    .then(res => res.json())
    .then(recipeDetails => {

      document.getElementById("recipe-name").innerText = recipeDetails.name;
      document.getElementById("recipe-description").innerText = recipeDetails.description;
      document.getElementById("meal-type").innerText = recipeDetails.mealType;

    })
    .catch(error => console.error(error));
}

export function showRecipeDetails(recipeName){
  //Gemmer recipe name fra den trykkede opsrkift
  localStorage.setItem('selectedRecipe', recipeName);
  //Redirect
  document.location.href="http://127.0.0.1:5502/#/recipeLine";
    getRecipeDetails(recipeName)
    getAllRecipeLines(recipeName);
}

export function addRecipeElement() {
  //Eventhandler til addRecipe
  document.getElementById("addRecipe").onclick = addRecipe;
}


function addRecipe(event) {
  event.preventDefault(); // Sikre der ikke sker automatisk refresh af siden(reload)
  
  const recipeName = document.getElementById("recipe-name").value;    // Hent værdier fra dokument/HTML
  const mealType = document.getElementById("mealTypes").value;
  const recipeDescription = document.getElementById("recipe-description").value;

  //Giver en alert hvis et af felterne mangler at blive udfyldt
  if (!recipeName || !mealType || !recipeDescription) {
    alert("Please fill in all fields.");
    return;
  }
  
  const recipe = {                    // Klargør objekt til backend med aktuel information hentet ovenfor
    name: recipeName,
    mealType: mealType,
    description: recipeDescription,
  };

  //Fetch til backend
  fetch(URL, makeOptions("POST", recipe))   // Send ny recipe til backend
    .then((res) => res.json())
    .then((newRecipe) => {
      const encodedRecipeName = encodeURIComponent(newRecipe.name);
      const params = new URLSearchParams({ name: encodedRecipeName });    // Recipename er primær nøgle og bruges til opslag som ekstra parameter. Konverter til URL venligt format

      window.location.href = "http://127.0.0.1:5502/#/recipe?${params}";  // Spring direkte til den nye recipe efter oprettelse, hvis det er gået godt. Virker ikke endnu
    })
    .catch((error) => console.error(error));
}
  
let sortDirection = 1;

function handleSort(event) {
  event.preventDefault();  // Sikre der ikke sker automatisk refresh af siden(reload)

  const rows = Array.from(document.querySelectorAll(".recipe-row"));
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


export function printRecipe()       // Simpel metode til at vise recipe, ved at åbne et nyt vindue og fyld HTML på denne, med data fra den aktuelle side
{
  let recipeName = document.getElementById("recipe-name").innerText;
  let printHtml = "<html><head><title>"
  + recipeName+"</title></head><body>"
  + "<div id=RecipeHeader>"
  + "<H1>Recipe: "+recipeName+"</H1><br>"
  + "<H2>Mealtype: "+document.getElementById("meal-type").innerHTML+"</H2><br>"
  + "<H2>Description: "+document.getElementById("recipe-description").innerHTML+"</H2><br>"     
  + "</div>"
  +document.getElementById("seeRecipeLine").innerHTML    // Tag bare indhold fra nuværende tabel (linjer) og vis på printside (ikke så pænt, men en hurtig løsning)
  +"</body></html>";
  var printWindow = window.open("");              // Åben nyt vindue
  printWindow.document.write(printHtml);          // Fyld vores HTML på
  printWindow.print();                            // Åben printfunktion
  printWindow.close();                            // Efter print, lukkes vindue igen
}
