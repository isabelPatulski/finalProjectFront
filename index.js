import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {setActiveLink, loadTemplate, renderTemplate, adjustForMissingHash } from "./utils.js"
import {movieMethods } from "./js-pages/movies/movies.js"
import {showingsMethods} from "./js-pages/showings/showings.js"
import {setupRegisterHandlers} from "./js-pages/register/register.js"
import {setupLoginHandlers } from "./js-pages/login/login.js"
import {showMenu} from "./js-pages/home/menu.js"
import {getAllIngredients, hideIngredientForm, 
  showIngredientForm} from "./js-pages/ingredient/ingredient.js"


window.addEventListener("load", async () => {
  const templateHome = await loadTemplate("./js-pages/movies/movies.html")
  const templateMovies = await loadTemplate("./js-pages/movies/movies.html")
  const templateLogin = await loadTemplate("./js-pages/login/login.html")
  const templateRegister = await loadTemplate("./js-pages/register/register.html")
  const templateSeats = await loadTemplate("./js-pages/selectSeat/selectSeat.html")
  const templateShowings = await loadTemplate("./js-pages/showings/showings.html")
  const templateConfirmed = await loadTemplate("./js-pages/confirmed/confirmed.html")
  const templateIngredients = await loadTemplate("./js-pages/ingredient/ingredient.html")

  const router = new Navigo("/", { hash: true });

  showMenu()
  
  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        console.log("testetst")
        done()
      }
    })

    .on("/", () => {
      renderTemplate(templateHome, "content")
      console.log ("test")
    })


      .on("/movies", () => {
      renderTemplate(templateMovies, "content")
      movieMethods()
      router.updatePageLinks()

    })
    
    .on("/showShowings", (match) => {
      renderTemplate(templateShowings,"content")
      console.log("Showings "+JSON.stringify(match))
      showingsMethods(match)
    })

    .on("/showSeats", (match) => {
      renderTemplate(templateSeats,"content")
      console.log("Seats "+JSON.stringify(match))
    })

    .on("/confirmed", () => {
      renderTemplate(templateConfirmed,"content")
    })

    .on( "/login", () => {
      renderTemplate(templateLogin,"content")
      setupLoginHandlers()

    })

    .on( "/register", () => {
      renderTemplate(templateRegister,"content")
      setupRegisterHandlers()

    })

    .on( "/ingredients", () => {
      renderTemplate(templateIngredients,"content")
      showIngredientForm()
      hideIngredientForm()
      getAllIngredients()    

    })


  });   

  window.onerror = (e) => alert(e)
