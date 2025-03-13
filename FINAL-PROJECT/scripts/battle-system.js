import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";
import { getTypeEffectiveness } from "./typeChart.mjs"

function calculateHealth(inputPokemon) {
    let EV = 510;
    let IV = 31;
    // Make sure EV is capped at 252 per stat and 510 total
    //EV = Math.min(EV, 252);  // Cap individual stat EVs
    // EVs are capped at 510 total, but for simplicity, we assume EV is total here.
    //EV = Math.min(EV, 510);  // Cap total EVs

    // Calculate HP
    let hp = Math.floor(((2 * inputPokemon.hp + IV + Math.floor(EV / 4)) * inputPokemon.level) / 100 + 10 + inputPokemon.level);

    return hp;
}

function getPokemonByName(name) {
    const pokemon = Pokemon.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    if (!pokemon) return null; // Avoid modifying a null object

    const newPokemon = JSON.parse(JSON.stringify(pokemon));
    newPokemon.level = 50;
    newPokemon.maxHealth = calculateHealth(newPokemon);
    newPokemon.health = calculateHealth(newPokemon);
    return newPokemon;
}


function getMoveByName(name) {
    return movesList.find(move => move.name === name) || null;
}

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

    let attackType = move.type.toLowerCase(); // Ensure move type is lowercase
    let defendingTypes = Array.isArray(defendingPokemon.type) 
        ? defendingPokemon.type.map(type => type.toLowerCase()) 
        : [defendingPokemon.type.toLowerCase()]; // Normalize to array and lowercase

    let effectiveness = getTypeEffectiveness(attackType, defendingTypes);

    if (getSTAB(attackType, attackingPokemon.type)){
        modifier = modifier * 1.5;
    }

    let damage = 0;

    if(move.category.toLowerCase() === 'Physical'.toLowerCase()){
        damage = ((((2 * attackingPokemon.level) / 5 + 2) * move.power * (attackingPokemon.attack / defendingPokemon.defense)) / 50 + 2) * (effectiveness * modifier);
    }
    else {
        damage = ((((2 * attackingPokemon.level) / 5 + 2) * move.power * (attackingPokemon.spattack / defendingPokemon.spdef)) / 50 + 2) * (effectiveness * modifier);
    }

    
    return damage;
}

function attackPokemon(attackingPokemon, defendingPokemon, move) {
    let damageDealt = calculateDamage(attackingPokemon, defendingPokemon, move);
    defendingPokemon.health -= damageDealt;
    defendingPokemon.health = Math.max(defendingPokemon.health, 0);
}

let myActivePokemon = getPokemonByName("Umbreon");
let myOpponentsActivePokemon = getPokemonByName("Espeon");
console.log(myOpponentsActivePokemon);
attackPokemon(myActivePokemon, myOpponentsActivePokemon, getMoveByName("Dark Pulse"));
console.log(myOpponentsActivePokemon);
