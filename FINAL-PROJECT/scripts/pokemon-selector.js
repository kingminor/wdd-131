import Pokemon from "./pokemon.mjs";

let selectedPokemon = null;  // To store the selected Pokémon

// Function to create HTML for each Pokémon
function PokemonTemplate(pokemon){
    return `
        <div class="pokemon" data-pokemon='${JSON.stringify(pokemon)}'>
            <h1>${pokemon.name}</h1>
            <h2>${pokemon.type}</h2>
            <img src="${pokemon.frontSprite}" alt="${pokemon.name} sprite">
        </div>
    `;
}

// Function to render the Pokémon list
function RenderPokemon(pokemonListData){
    // Sort the Pokémon list by the pokedexNumber attribute
    pokemonListData.sort((a, b) => a.pokedexNumber - b.pokedexNumber);

    let html = pokemonListData.map(PokemonTemplate).join('');
    let body = document.getElementById("body");
    body.innerHTML = html;

    // Add event listeners after rendering the Pokémon list
    let pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach(element => {
        element.addEventListener('click', () => {
            let pokemon = JSON.parse(element.getAttribute('data-pokemon'));
            selectPokemon(pokemon);
        });
    });
}

// Function to handle Pokémon selection
function selectPokemon(pokemon){
    selectedPokemon = pokemon;
    displaySelectedPokemon();
}

// Function to display the selected Pokémon's details
function displaySelectedPokemon(){
    let displayArea = document.getElementById("selectedPokemon");
    if (selectedPokemon) {
        displayArea.innerHTML = `
            <h3>You have selected:</h3>
            <h1>${selectedPokemon.name}</h1>
            <h2>Type: ${selectedPokemon.type}</h2>
            <img src="${selectedPokemon.frontSprite}" alt="${selectedPokemon.name} sprite">
        `;
    }
}

RenderPokemon(Pokemon);
