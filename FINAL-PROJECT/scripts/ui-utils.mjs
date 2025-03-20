import Pokemon from "./pokemon.mjs";

//variables to handle dialog box
const dialogBoxTest = document.getElementById("dialog-box-text");
const yourHealthBar = document.getElementById("your-health");
const opponentsHealthBar = document.getElementById("opponents-health");
const yourPokemonsNameTag = document.getElementById("your-pokemon-name-tag");
const opponentsPokemonNameTag = document.getElementById("opponents-pokemon-name-tag");

async function typeText(text) {
    return new Promise((resolve) => {
        let index = 0;
        dialogBoxTest.textContent = ""; // Clear previous text

        function typeNextChar() {
            if (index < text.length) {
                dialogBoxTest.textContent += text[index];
                index++;
                setTimeout(typeNextChar, 30); // Adjust typing speed here
            } else {
                resolve(); // Resolve the promise when typing is complete
            }
        }

        typeNextChar();
    });
}

function UpdateHealthBar(yourActivePokemon, opponentsActivePokemon) {  
    //Updates Stat UI

    yourHealthBar.max = yourActivePokemon.maxHealth;
    yourHealthBar.value = yourActivePokemon.health;

    opponentsHealthBar.max = opponentsActivePokemon.maxHealth;
    opponentsHealthBar.value = opponentsActivePokemon.health;
}

function UpdateNameTags(yourActivePokemon, opponentsActivePokemon){
    yourPokemonsNameTag.textContent = yourActivePokemon.name;
    opponentsPokemonNameTag.textContent = opponentsActivePokemon.name;
}

export {typeText, UpdateHealthBar, UpdateNameTags};