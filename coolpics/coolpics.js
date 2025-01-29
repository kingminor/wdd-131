let button = document.getElementById("menuButton");
let navMenu = document.getElementById("nav-menu");
let close_viewer = document.getElementById("close-viewer")
let isCollapsed = false;
let viewer = document.getElementById("viewer")
viewer.classList.add("hide");
CollapseMenu(); //Hides menu by default

button.addEventListener('click', CollapseMenu);
window.addEventListener('resize', HandleResize);


function CollapseMenu () {
    if (!isCollapsed) {
        navMenu.classList.add("hide");
        isCollapsed = !isCollapsed
    }
    else {
        navMenu.classList.remove("hide");
        isCollapsed = !isCollapsed
    }
}

function HandleResize () {
    if (window.innerWidth >= 1000) {
        navMenu.classList.remove("hide");
    } 
    else {
        navMenu.classList.add("hide")
        
    }
}

function viewHandler(event) {
	// create a variable to hold the element that was clicked on from event.target
    let clickedObject = event.target;

	// get the src attribute from that element and 'split' it on the "-"
    let src = clickedObject.src;
    
	// construct the new image file name by adding "-full.jpeg" to the first part of the array from the previous step


	// insert the viewerTemplate into the top of the body element
	// (element.insertAdjacentHTML("afterbegin", htmltoinsert))

	// add a listener to the close button (X) that calls a function called closeViewer when clicked

}