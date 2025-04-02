import Pokemon from "./pokemon.mjs";

const pokemonList = document.getElementById("pokemonList");
const selectedList = document.getElementById("selectedList");
const pokemonStats = document.getElementById("pokemon-info");
let radarChart; // Declare radarChart globally
const startGameButton = document.getElementById("StartGame");

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
        // Get the stored Pokémon list
        let selectedPokemonArray = JSON.parse(sessionStorage.getItem("selectedPokemonList")) || [];
        
        // Ensure filtering removes only one occurrence, not all
        let indexToRemove = selectedPokemonArray.findIndex(p => p.name === pokemon.name);
        if (indexToRemove !== -1) {
            selectedPokemonArray.splice(indexToRemove, 1); // Remove only the first match
        }
        
        // Update sessionStorage with the modified array
        sessionStorage.setItem("selectedPokemonList", JSON.stringify(selectedPokemonArray));
    
        // Remove from UI
        div.remove();
    });
    

    div.addEventListener("mouseover", () => UpdateStats(pokemon));

    return div;
}

function getRandomMoves(moves, count = 4) {
    let shuffled = [...moves].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function addToSelectedPokemon(pokemon) {
    // Check if there are already 6 Pokémon selected
    if (selectedList.children.length >= 6) {
        alert("You can only select up to 6 Pokémon!");
        return; // Stop execution if the limit is reached
    }
    
    selectedList.appendChild(selectedPokemonTemplate(pokemon));

    let randomMoves = getRandomMoves(pokemon.moves);

    let selectedPokemon = {
        name: pokemon.name,
        move1: randomMoves[0],
        move2: randomMoves[1],
        move3: randomMoves[2],
        move4: randomMoves[3],
    }

    let selectedPokemonArray = JSON.parse(sessionStorage.getItem("selectedPokemonList")) || [];
    selectedPokemonArray.push(selectedPokemon);
    sessionStorage.setItem("selectedPokemonList", JSON.stringify(selectedPokemonArray));
    console.log(selectedPokemonArray);

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

// INIT
sessionStorage.setItem("selectedPokemonList", null);
pokemonList.innerHTML = ""; // Clear existing content
Pokemon.forEach(pokemon => {
    pokemonList.appendChild(PokemonTemplate(pokemon));
});

document.addEventListener("DOMContentLoaded", () => {
    UpdateStats(getRandomElement(Pokemon)); // Initialize with a random Pokémon
});

startGameButton.addEventListener("click", function() {
    window.location.href = "battleing.html";
});