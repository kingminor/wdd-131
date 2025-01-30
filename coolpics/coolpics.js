let button = document.getElementById("menuButton");
let navMenu = document.getElementById("nav-menu");
let gallery = document.getElementById("gallery");
let isCollapsed = false;
CollapseMenu(); //Hides menu by default

button.addEventListener('click', CollapseMenu);
gallery.addEventListener('click', viewHandler);
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
    let srcArray = src.split("-");

	// construct the new image file name by adding "-full.jpeg" to the first part of the array from the previous step
    let newimage = srcArray[0] + "-full.jpeg"

	// insert the viewerTemplate into the top of the body element
    let element = document.getElementById("body");
    element.insertAdjacentHTML("afterbegin", `
        <div id="viewer">
            <button id="close-viewer">X</button>
            <img src="norris-full.jpeg" alt="alt description">
        </div>
    `);

	// add a listener to the close button (X) that calls a function called closeViewer when clicked
    let closeButton = document.getElementById("close-viewer");
    closeButton.addEventListener("click", closeViewer)

}

function closeViewer() {
    let viewer = document.getElementById("viewer");
    viewer.remove();
}