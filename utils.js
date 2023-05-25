/**
 * Appends the provided template to the node with the id contentId
 * @param {template} template 
 * @param {*} contentId 
 */
 export function renderTemplate(template, contentId) {
  const clone = template.content.cloneNode(true)
  const content = document.getElementById(contentId)
  content.innerHTML = ""
  content.appendChild(clone)
}
/**
 * Inserts the provided text into innerHTML of the node with the id 'contentId'
 * @param {string} contextId - Text to insert 
 * @param {string} contentId - id of node where text must be insert 
 */
export function renderText(txt, contentId){
  if(!txt || !contentId){
    throw new Error("Missing input arguments in renderText")
  }
  const node =  document.getElementById(contentId)
  if(!node){
    throw new Error(`No element found for the contentId '${contentId}' `)
  }
  node.innerHTML = txt
}

/**
 * Loads a template from the dom (for example a template in index.html)
 * @param {string} templateId Id for the template to load
 * @returns {HTMLTemplateElement}
 */
export function loadTemplateFromDom(templateId) {
  const template = document.getElementById(templateId)
  if(!template){
    throw new Error(`No Element found with provided ID: '${templateId}'`)
  }
  if(template.nodeName !="TEMPLATE" ){
    throw new Error(`Element with id: '${templateId}' was not an HtmlTemplate, but a ${template.nodeName}`)
  }
  return template
}

/**
 * Loads an external file with an html-template, adds it to the body of your page, and returns the template
 * The file to be loaded can contain more than one template, but the one that will be returned must
 * be the first one in the file and this does not require an id
 * @param {string} page - Path to the file containing the template ('/templates/template.html')
 * @returns {template} The first HtmlTemplate found in the file
 */
export async function loadTemplate(page) {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `)
    }
    return r.text()
  });
  const body = document.getElementsByTagName("BODY")[0];
  const div = document.createElement("div");
  div.innerHTML = resHtml;
  body.appendChild(div)
  return div.querySelector("template")
};

/**
 * Only meant for when Navigo is set to use Hash based routing (Always this semester)
 * If users try to enter your site with only "/", it will change this to "/#/" as required
 * for Hash based routing
 * Call it before you start using the router (add the specific routes)
 */
export function adjustForMissingHash() {
  let path = window.location.hash
  if (path == "") { //Do this only for hash
    path = "#/"
    window.history.pushState({}, path, window.location.href + path);
  }
}


/**
 * Sets active element on a div (or similar) containing a-tags (with data-navigo attributes ) used as a "menu"
 * Meant to be called in a before-hook with Navigo
 * @param {string} topnav - Id for the element that contains the "navigation structure"
 * @param {string} activeUrl - The URL which are the "active" one
 */
export function setActiveLink(topnav, activeUrl) {
  const links = document.getElementById(topnav).querySelectorAll("a");
  links.forEach(child => {
    child.classList.remove("active")
    //remove leading '/' if any
    if (child.getAttribute("href").replace(/\//, "") === activeUrl) {
      child.classList.add("active")
    }
  })
}


/**
 * The encoder method we have used when inserting untrusted data via the innerHTML property
 * Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
 * @param {str} str 
 * @returns the encode string
 */
export function encode(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}
