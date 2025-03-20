import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";

function calculateHealth(inputPokemon) {
    let EV = 510;
    let IV = 31;

    let hp = Math.floor(((2 * inputPokemon.hp + IV + Math.floor(EV / 4)) * inputPokemon.level) / 100 + 10 + inputPokemon.level);
    
    return Math.round(hp); // Ensure health is an integer
}

function determineGender(pokemon) {
    // Generate a random number between 0 and 1
    let random = Math.random();

    if (pokemon.genderRatio == null){
        return null;
    } else if (random < pokemon.genderRatio) {
        return "Male";
    } else {
        return "Female";
    }
}

function getPokemonByName(name) {
    const pokemon = Pokemon.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    if (!pokemon) return null; // Avoid modifying a null object

    const newPokemon = JSON.parse(JSON.stringify(pokemon));
    newPokemon.level = 50;
    newPokemon.maxHealth = calculateHealth(newPokemon);
    newPokemon.health = newPokemon.maxHealth;
    newPokemon.status = null;
    newPokemon.gender = determineGender(newPokemon);
    newPokemon.evasion = 1;
    return newPokemon;
}

function AddMovesToPokemon(pokemon, move1, move2, move3, move4) {
    pokemon.move1 = JSON.parse(JSON.stringify(getMoveByName(move1)));
    pokemon.move1.maxpp = pokemon.move1.pp;

    pokemon.move2 = JSON.parse(JSON.stringify(getMoveByName(move2)));
    pokemon.move2.maxpp = pokemon.move2.pp;

    pokemon.move3 = JSON.parse(JSON.stringify(getMoveByName(move3)));
    pokemon.move3.maxpp = pokemon.move3.pp;

    pokemon.move4 = JSON.parse(JSON.stringify(getMoveByName(move4)));
    pokemon.move4.maxpp = pokemon.move4.pp;
}

function getMoveByName(name) {
    return movesList.find(move => move.name === name) || null;
}


/* format for special pokemon object for team creation 
    {
        name: "name",
        move1: "move1",
        move1: "move1",
        move1: "move1",
        move1: "move1",
        gender: # (0 = male, 1 is female, null is either random of genderless)
    }
*/
function GenerateTeamFromPokemon(team, pokemons) {
    if (pokemons.length > 6) {
        console.error("Error: A team cannot have more than 6 Pokémon.");
        return;
    }

    // Generate each Pokémon
    pokemons.forEach((pokemon, index) => {
        let newPokemon = getPokemonByName(pokemon.name);
        AddMovesToPokemon(newPokemon, pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4);

        if (pokemon.gender != null && newPokemon.genderRatio != null) {
            if (pokemon.gender === 0) {
                newPokemon.gender = "Male";
            } else if (pokemon.gender === 1) {
                newPokemon.gender = "Female";
            }
        }        

        team.push(newPokemon); // Add the new Pokémon to the team
    });
}

const testTeam1 = [
    {
        name: "Umbreon",
        move1: "Dark Pulse",
        move2: "Crunch",
        move3: "Moonlight",
        move4: "Giga Drain",
        gender: 0
    },
    {
        name: "Espeon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
        gender: 1
    },
    {
        name: "Zekrom",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
    },
    {
        name: "Zoroark",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
        gender: 0
    },
    {
        name: "Lucario",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
        gender: 0
    },
    {
        name: "Eevee",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
        gender: 0
    },
]

const testTeam2 = [
    {
        name: "Espeon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
        gender: 1
    },
    {
        name: "Eevee",
        move1: "Dark Pulse",
        move2: "Crunch",
        move3: "Moonlight",
        move4: "Confuse Ray",
    },
    {
        name: "Jolteon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
    },
    {
        name: "Flareon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
    },
    {
        name: "Vaporeon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
    },
    {
        name: "Glaceon",
        move1: "Tackle",
        move2: "Psychic",
        move3: "Moonlight",
        move4: "Toxic Surge",
    },
]

export { calculateHealth, determineGender, getPokemonByName, GenerateTeamFromPokemon, testTeam1, testTeam2 };
