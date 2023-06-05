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

/*function addRecipeLine(){
const recipeLine = {}
recipeLine.name = document.getElementById("input-name").value
recipeLine.price = document.getElementById("input-price").value

fetch(URL, makeOptions("POST", recipeLine))
    .then(res => res.json())
    .then(newRecipeLine => {
      document.getElementById("saveNewRecipeLine").innerText = JSON.stringify(newRecipeLine)
    })
    .catch(error => console.error(error))
}*/



