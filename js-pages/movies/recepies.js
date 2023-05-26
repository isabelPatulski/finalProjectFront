
/*const getData = () =>{
    fetch('http://localhost:8080/hobbies').then(r => res.json()).then(hobbies => {
        createHobbyTable()

        for (const hobbies of hobbies) {
            let hobbyIndex = hobbies.indexOf(hobby) + 1
            appendHobbies(hobbies, hobbyIndex)
        }
    }
*/


export function showRecepies(){
    //let table = document.querySelector();
    let table = document.getElementById("recepie-table")
    generateTableHeader(table);
    generateTableRows(table);
}

function generateTableHeader(table) {
    let thead = table.createTHead();
    let row = table.insertRow();

    let th = document.createElement("th");
    let text = document.createTextNode("Recepie");
    th.appendChild(text);
    row.appendChild(th);
}

function insertRecepieRow(table, recepie) {
    let row = table.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(recepie);
    cell.appendChild(text);
}

function generateTableRows(table, data) {
    //for (let element of data) {
        insertRecepieRow(table, "Boller i karry")
        insertRecepieRow(table,"Lasagne")
        insertRecepieRow(table,"Wok med kylling")
        insertRecepieRow(table,"Laks i ovn")
        insertRecepieRow(table,"Frikadeller")
        insertRecepieRow(table,"Friske forårsruller")

    //}
}
export function searcRecepieHandler(){
  //document.getElementById("btn-search-hobby").onclick = function () {searchHobby()
  //}
    document.getElementById("recepie-search").oninput = function () {searchRecepie()}
}

export function searchRecepie(){
        // Declare variables
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("recepie-search");
        filter = input.value.toUpperCase();
        table = document.getElementById("recepie-table");
        tr = table.getElementsByTagName("tr");
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                //Her sker sammenligningen
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
}