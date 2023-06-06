import {LOCAL_SERVER_URL} from "../../settings.js"
import {handleErrors, makeOptions} from "../../fetchUtils.js";

const URL = LOCAL_SERVER_URL+"api/recipeLines"

export function getAllRecipeLines(){
  fetch(URL)
  .then(res=>res.json())
  .then(recipeLines=>{
    
  makeRows(recipeLines)
    
  })
  .catch(e=>console.error(e))
}


function makeRows(rows) {
  const trows = rows.map(recipeLines => {

    return `
      <tr class="rows-with-recipeLines">
        <td>${recipeLines.id}</td>
        <td>${recipeLines.amount}</td>
        <td>${recipeLines.measurementType}</td>
        <td>${recipeLines.ingredientName}</td>
        <td>${recipeLines.recipeName}</td>
      </tr>
    `;
  }).join("\n");
  document.getElementById("recipeLines-rows").innerHTML = trows;
}



export function addRecipeLinesElement(){
    document.getElementById("saveNewRecipeLine").onclick = addRecipeLine
}

function addRecipeLine(){
const recipeLine = {}
recipeLine.recipeName = document.getElementById("input-recipeName").value;
recipeLine.ingredientName = document.getElementById("input-ingredientName").value;
recipeLine.measurementType = document.getElementById("input-measurementType").value;
recipeLine.amount = document.getElementById("input-amount").value;
  

fetch(URL, makeOptions("POST", recipeLine))
    .then(res => res.json())
    .then(newRecipeLine => {
      document.getElementById("saveNewRecipeLine").innerText = JSON.stringify(newRecipeLine)
    })
    .catch(error => console.error(error))
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
}

function hideRecipeLineForm() {
  document.getElementById("myForm").style.display = "none";
}


/*
function addRecipeLine(recipeName, ingredientName) {
  const recipeLine = {};
  recipeLine.ingredientName = ingredientName;
  recipeLine.amount = parseFloat(document.getElementById("input-amount").value);
  recipeLine.measureType = document.getElementById("input-measure-type").value;
  recipeLine.recipeName = recipeName;

  fetch(URL, makeOptions("POST", recipeLine))
    .then(res => res.json())
    .then(newRecipeLine => {
      document.getElementById("saveNewRecipeLine").innerText = JSON.stringify(newRecipeLine);
    })
    .catch(error => console.error(error));
}*/



