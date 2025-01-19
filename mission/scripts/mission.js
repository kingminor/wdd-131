const themeSelector = document.getElementById("theme-selector")
let current_theme = "light";

const body = document.getElementById("body-tag");
const logoImage = document.getElementById("logo-image");
logoImage.src = "imgs/byui-logo_blue.webp";

function changeTheme() {
    if (current_theme == "light") {
        current_theme = "dark";
        logoImage.src = "imgs/byui-logo_white.png";
        body.classList.add("dark");
    }
    else {
        current_theme = "light";
        logoImage.src = "imgs/byui-logo_blue.webp";
        body.classList.remove("dark");
    }
}

themeSelector.addEventListener('change', changeTheme);