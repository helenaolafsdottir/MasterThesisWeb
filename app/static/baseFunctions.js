
/**
 * Empties an HTML element
 * @param {HTML DOM Element Object} element - HTML element
 */
function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
}

/**
 * Deletes an HTML element
 * @param {HTML DOM Element Object} element - HTML element
 */
function deleteEl(element) {
    element.parentNode.removeChild(element);
}
  
/**
 * Creates an HTML element
 * @param {string} name - type of the HTML element to be created
 * @param {string} children - text content of the HTML element to be created
 */
function el(name, ...children) {
    const element = document.createElement(name);
    for (let child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }
    return element;
}
  
/**
 * Shows the dropdown to choose features or user stories
 * @param {string} selector - Name of the selector to show
 * @param {string} question - Question chosen by the user
 */
function showSelector(selector, question) {
    var featureOpt = document.getElementById(selector);
    featureOpt.setAttribute('class', question)
    featureOpt.style = '';
 }

 /**
  * Hides the dropdown to choose features or user stories
  * @param {string} selector - Name of the selector to hide
  */
function hideSelector(selector) {
    var featureOpt = document.getElementById(selector);
    featureOpt.style =" display:none";
}