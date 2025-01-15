const themeSelector = document.getElementsById("theme-selector")

function changeTheme() {
    const body = document.getElementById("body-tag");
    const logoImage = document.getElementById("logo-image");
    logoImage.src = "imgs/byui-logo_white.png";
}

themeSelector.addEventListener('change', changeTheme);