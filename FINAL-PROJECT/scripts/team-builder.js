import Pokemon from "./pokemon.mjs";

const pokemonList = document.getElementById("pokemonList");
const selectedList = document.getElementById("selectedList");
const pokemonStats = document.getElementById("pokemon-info");
let radarChart; // Declare radarChart globally

const statLabels = ['HP', 'Sp. Attack', 'Sp. Defense', 'Speed', 'Defense', 'Attack'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function PokemonTemplate(pokemon) {
    let div = document.createElement("div");
    div.classList.add("pokemon-item");
    div.innerHTML = `
        <img src="${pokemon.frontSprite}" alt="Pokemon Image">
        <span class="pokemon-name">${pokemon.name}</span>
    `;

    div.addEventListener("click", () => addToSelectedPokemon(pokemon));
    div.addEventListener("mouseover", () => UpdateStats(pokemon));

    return div; // Return the element, not a string
}

function selectedPokemonTemplate(pokemon) {
    let div = document.createElement("div");
    div.classList.add("pokemon-item");
    div.innerHTML = `
        <img src="${pokemon.frontSprite}" alt="Pokemon Image">
        <span class="pokemon-name">${pokemon.name}</span>
        <button class="remove-btn">Remove</button>
    `;

    div.querySelector(".remove-btn").addEventListener("click", () => {
        div.remove();
    });

    div.addEventListener("mouseover", () => UpdateStats(pokemon));

    return div;
}

function addToSelectedPokemon(pokemon) {
    // Check if there are already 6 Pokémon selected
    if (selectedList.children.length >= 6) {
        alert("You can only select up to 6 Pokémon!");
        return; // Stop execution if the limit is reached
    }
    
    selectedList.appendChild(selectedPokemonTemplate(pokemon));
}

function UpdateStats(pokemon){
    // Update the stat display
    pokemonStats.innerHTML = `  
                            <h1>Name: ${pokemon.name}</h1>
                            <img src="${pokemon.frontSprite}" alt="pokemon-image">
                            <div id="stat-holder">
                                <div id="left-side">
                                    <p>HP: ${pokemon.hp}</p>
                                    <p>Attack: ${pokemon.attack}</p>
                                    <p>Sp. Attack: ${pokemon.spattack}</p>
                                    <p>Defense: ${pokemon.defense}</p>
                                    <p>Sp. Defense: ${pokemon.spdef}</p>
                                    <p>Speed: ${pokemon.speed}</p>
                                </div>
                                <div id="right-side">
                                    <canvas id="pokemonRadarChart"></canvas>
                                </div>
                            </div>`;

    const ctx = document.getElementById("pokemonRadarChart").getContext("2d");
    
    // Destroy the existing chart (if any) before creating a new one
    if (radarChart) {
        radarChart.destroy();
    }

    const stats = [
        pokemon.hp, 
        pokemon.spattack, 
        pokemon.spdef, 
        pokemon.speed, 
        pokemon.defense, 
        pokemon.attack
    ];

    // Create the radar chart
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: statLabels,
            datasets: [{
                label: pokemon.name,
                data: stats,
                backgroundColor: 'rgba(0, 206, 86, 0.2)',
                borderColor: 'rgba(0, 206, 86, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    suggestedMax: 100
                }
            }
        }
    });

    const pokemonRadarChart = document.getElementById("pokemonRadarChart");
    pokemonRadarChart.width = 10; // Set width as a number
    pokemonRadarChart.height = 10; // Set height as a number

    radarChart.update(); // Use update() instead of Update()
}

// Populate Pokémon list
pokemonList.innerHTML = ""; // Clear existing content
Pokemon.forEach(pokemon => {
    pokemonList.appendChild(PokemonTemplate(pokemon));
});

document.addEventListener("DOMContentLoaded", () => {
    UpdateStats(getRandomElement(Pokemon)); // Initialize with a random Pokémon
});
