import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {setActiveLink, loadTemplate, renderTemplate, adjustForMissingHash } from "./utils.js"
import {setupRegisterHandlers} from "./js-pages/register/register.js"
import {setupLoginHandlers } from "./js-pages/login/login.js"
import {addIngredientElement, getAllIngredients, setupIngredientFormHandlers} from "./js-pages/ingredient/ingredient.js"
import {getAllRecipes, addRecipeElement, handleRecipeRowClick} from "./js-pages/recipe/recipe.js"
import { getAllRecipeLines, setupRecipeLineFormHandlers, addRecipeLinesElement, handleEditRecipe, printRecipeElement } from "./js-pages/recipeLine/recipeLine.js"
import { showMenu} from "./js-pages/home/menu.js"
import { setupLogoutHandler } from "./js-pages/logOut/logOut.js"



window.addEventListener("load", async () => {
  const templateLogin = await loadTemplate("./js-pages/login/login.html")
  const templateRegister = await loadTemplate("./js-pages/register/register.html")
  const templateIngredients = await loadTemplate("./js-pages/ingredient/ingredient.html")
  const templateRecipe = await loadTemplate ("./js-pages/recipe/recipe.html")
  const templateRecipeLine = await loadTemplate("./js-pages/recipeLine/recipeLine.html")
  const templateLoggedIn = await loadTemplate("./js-pages/home/loggedIn.html");
  const templateNotLoggedIn = await loadTemplate("./js-pages/home/notLoggedIn.html");



  const router = new Navigo("/", { hash: true });

  
  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })

  


    .on( "/login", () => {
      renderTemplate(templateLogin,"content")
      setupLoginHandlers()

    })

    .on( "/register", () => {
      renderTemplate(templateRegister,"content")
      setupRegisterHandlers()

    })

    .on( "/ingredients", (event) => {
      renderTemplate(templateIngredients,"content")
      getAllIngredients(event)    
      setupIngredientFormHandlers()
      addIngredientElement()
        
    })

    .on( "/recipe", (event) => {
      renderTemplate(templateRecipe, "content")
      getAllRecipes()
      addRecipeElement(event)
      handleRecipeRowClick(event)

    })

    .on( "/recipeLine", (event) => {
      renderTemplate(templateRecipeLine, "content")
      getAllRecipeLines()
      setupRecipeLineFormHandlers()
      addRecipeLinesElement()
      handleEditRecipe()
      printRecipeElement()

    })

    .on( "/logout", () => {

    })
    setupLogoutHandler();
    showMenu()

  });
     

  window.onerror = (e) => alert(e)
