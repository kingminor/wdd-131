import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";
import {typeText, UpdateHealthBar, UpdateNameTags} from "./ui-utils.mjs";
import {getTypeEffectiveness} from "./typeChart.mjs";

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
        move4: "Rest",
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

function getSTAB(inputType, typeArray) {
    inputType = inputType.toLowerCase(); // Convert query to lowercase for case-insensitive search
    return typeArray.some(item => item.toLowerCase() === inputType);
}

function calculateDamage(attackingPokemon, defendingPokemon, move) {
    if (!move || !move.type) {
        console.error("Invalid move:", move);
        return 0;
    }

    if (!defendingPokemon || !defendingPokemon.type) {
        console.error("Invalid defending Pokémon:", defendingPokemon);
        return 0;
    }

    let modifier = 1;
    let attackType = move.type.toLowerCase();
    let defendingTypes = Array.isArray(defendingPokemon.type) 
        ? defendingPokemon.type.map(type => type.toLowerCase()) 
        : [defendingPokemon.type.toLowerCase()];

    let effectiveness = getTypeEffectiveness(attackType, defendingTypes);

    if (getSTAB(attackType, attackingPokemon.type)) {
        modifier *= 1.5;
    }

    let damage = 0;

    if (move.category.toLowerCase() === 'physical') {
        damage = ((((2 * attackingPokemon.level) / 5 + 2) * move.power * (attackingPokemon.attack / defendingPokemon.defense)) / 50 + 2) * (effectiveness * modifier);
    } else {
        damage = ((((2 * attackingPokemon.level) / 5 + 2) * move.power * (attackingPokemon.spattack / defendingPokemon.spdef)) / 50 + 2) * (effectiveness * modifier);
    }

    return Math.round(damage); // Ensure damage is an integer
}

function attackPokemon(attackingPokemon, defendingPokemon, move) {
    let damageDealt = calculateDamage(attackingPokemon, defendingPokemon, move);
    defendingPokemon.health -= damageDealt;
    defendingPokemon.health = Math.max(defendingPokemon.health, 0);
}

function HealPokemon (pokemon, amount) { //Amount is a float that represents a percentage of a pokemons max health (0.5 is most common)
    let amountHealed = 0;
    if(pokemon.health + (pokemon.maxHealth * amount) > pokemon.maxHealth) {
        amountHealed = (pokemon.maxHealth - pokemon.health);
        pokemon.health = pokemon.maxHealth;

    }
    else {
        amountHealed = (pokemon.maxHealth * amount);
        pokemon.health += (pokemon.maxHealth * amount);
    }

    console.log(`${pokemon.name} healed ${amountHealed} hp`);
}

function DrainPokemon(user, target, move) {
    let drainAmount = calculateDamage(user, target, move);
    attackPokemon(user, target, move);
    let amount = move.healPercentage;

    let amountHealed = 0;
    if(user.health + (drainAmount * amount) > user.maxHealth) {
        amountHealed = (user.maxHealth - user.health);
        user.health = user.maxHealth;

    }
    else {
        amountHealed = (drainAmount * amount);
        user.health += (drainAmount * amount);
    }

    console.log(`${user.name} healed ${amountHealed} hp`);
}

function doesSucceed(chance) {
    if(chance == null) {
        return true;
    }
    else {
        return Math.random() * 100 < chance;
    }
}

function doesHitWithStats(user, target, move){ //TEMPORARY LOGIC, UPDATE NEEDED FOR BETTER GAMEPLAY
    //TEMP
    return doesSucceed(move.accuracy);
}

async function doesHitAdvanced(user, target, move) {
    if(user.status != null){
        if (user.status.toLowerCase() === "par"){
            if(doesHit(25)){
                await typeText(`${user.name} failed to move because of paralysis!`);
                await delay(delayAmount);
                return false;
            }
            else {
                return doesHitWithStats(user, target, move);
            }
        }
        else if(user.status.toLowerCase() === "frz"){
            if(doesSucceed(20)){ //20% chance to thaw
                user.status = null;
                await typeText(`${user.name} thawed out!`);
                await delay(delayAmount);
                return doesHitWithStats(user, target, move);
            }
            else {
                await typeText(`${user.name} is frozen and cannot move!`);
                await delay(delayAmount);
                return false;
            }
        }
        else if(user.status.toLowerCase() === "slp"){
            if(doesSucceed(1/3)){
                user.status = null;
                await typeText(`${user.name} woke up!`);
                await delay(delayAmount);
                return doesHitWithStats(user, target, move);
            }
            else {
                await typeText(`${user.name} is asleep. It cannot move!`);
                await delay(delayAmount);
                return false;
            }
        }
        else if(user.status.toLowerCase() === "con") {
            if(doesSucceed(25)){
                user.status = null;
                await typeText(`${user.name} snapped out of it's confusion`);
                await delay(1500);
                return doesHitWithStats(user, target, move);
            }
            else {
                if(doesSucceed(1/3)){
                    let damage = (2 * user.level / 5 + 2) * 40 * user.attack / 50 + 2;
                    user.health -= damage;
                    user.health = Math.max(user.health, 0);
                    await typeText(`${user.move} hurt itself in its confusion`);
                    await delay(delayAmount);
                    return false;
                }   
                else {
                    return doesHitWithStats(user, target, move);
                }
            }
        }
        else if(user.status.toLowerCase() === "inf"){
            if(doesSucceed(50)){
                return doesHitWithStats(user, target, move);
            }
            else {
                await typeText(`${user.name} is immobilized by love`);
                await delay(delayAmount);
                return false;
            }
        }
        else{
            return doesHitWithStats(user, target, move);
        }
    } else {
        return doesHitWithStats(user, target, move);
    }
}

export { calculateHealth, determineGender, getPokemonByName, GenerateTeamFromPokemon, testTeam1, testTeam2, getSTAB, calculateDamage, attackPokemon, HealPokemon, DrainPokemon, doesSucceed, doesHitWithStats, doesHitAdvanced };
