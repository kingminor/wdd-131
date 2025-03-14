import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";
import { getTypeEffectiveness } from "./typeChart.mjs"

const yourHealthBar = document.getElementById("your-health");
const opponentsHealthBar = document.getElementById("opponents-health");
const yourPokemonsNameTag = document.getElementById("your-pokemon-name-tag");
const opponentsPokemonNameTag = document.getElementById("opponents-pokemon-name-tag");
const yourPokemonSprite = document.getElementById("your-pokemon-sprite");
const opponentsPokemonSprite = document.getElementById("opponent-pokemon-sprite");

function calculateHealth(inputPokemon) {
    let EV = 510;
    let IV = 31;

    let hp = Math.floor(((2 * inputPokemon.hp + IV + Math.floor(EV / 4)) * inputPokemon.level) / 100 + 10 + inputPokemon.level);
    
    return Math.round(hp); // Ensure health is an integer
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
let yourActivePokemon = null;
let opponentsActivePokemon = null;

function getMoveByName(name) {
    return movesList.find(move => move.name === name) || null;
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
    if(pokemon.health + amount > pokemon.maxHealth) {
        amountHealed = (pokemon.maxHealth - pokemon.health);
        pokemon.health = maxHealth;

    }
    else {
        amountHealed = (pokemon.maxHealth * amount);
        pokemon.health += (pokemon.maxHealth * amount);
    }

    console.log(`${pokemon.name} healed ${amountHealed} hp`);
}

function UpdateHealthBar() {
    //Updates Stat UI
    yourHealthBar.value = yourActivePokemon.health;
    opponentsHealthBar.value = opponentsActivePokemon.health;
}

function init(yourPokemon, opponentsPokemon) {
    /*Initialize pokemon*/
    yourActivePokemon = getPokemonByName(yourPokemon);
    opponentsActivePokemon = getPokemonByName(opponentsPokemon);

    //Initializes Health Bars
    yourHealthBar.max = yourActivePokemon.maxHealth;
    opponentsHealthBar.max = opponentsActivePokemon.maxHealth;
    UpdateHealthBar();

    //Updates Names Tags
    yourPokemonsNameTag.textContent = yourActivePokemon.name;
    opponentsPokemonNameTag.textContent = opponentsActivePokemon.name;

    //Updates Sprites
    yourPokemonSprite.src = yourActivePokemon.backSprite;
    opponentsPokemonSprite.src = opponentsActivePokemon.frontSprite;
}

function processTurn(yourMove, opponentsMove) {
    function ExecuteMove(user, target, move) {
        if(move.category.toLowerCase() === "physical"|| move.category.toLowerCase() === "special"){
            let damageDealt = calculateDamage(user, target, move);
            console.log(`${user.name} used ${move.name} and dealt ${damageDealt.toFixed(2)} damage!`);
            attackPokemon(user, target, move);
        }
        else if(move.category.toLowerCase() === "healing"){
            HealPokemon(user, move.healPercentage);
        }

        move.pp -= 1;
    }

    if (yourMove.priority > opponentsMove.priority) {
        ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);

        if (opponentsActivePokemon.health > 0) {
            ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
        }
    }
    else if (opponentsMove.priority > yourMove.priority) {
        ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);

        if (yourActivePokemon.health > 0) {
            ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
        }
    }
    else {
        if (yourActivePokemon.speed >= opponentsActivePokemon.speed) {
            ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);

            if (opponentsActivePokemon.health > 0) {
                ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
            }
        }
        else {
            ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);

            if (yourActivePokemon.health > 0) {
                ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
            }
        }
    }

    UpdateHealthBar();

    if (yourActivePokemon.health <= 0) {
        console.log(`${yourActivePokemon.name} fainted!`);
    }

    if (opponentsActivePokemon.health <= 0) {
        console.log(`${opponentsActivePokemon.name} fainted!`);
    }
}


init("Lucario", "Houndoom");

AddMovesToPokemon(yourActivePokemon, "Dark Pulse", "Crunch", "Moonlight", "Assurance");
console.log(yourActivePokemon);

processTurn(yourActivePokemon.move1, getMoveByName("Psychic"));
processTurn(yourActivePokemon.move2, getMoveByName("Moonlight"));
processTurn(yourActivePokemon.move4, getMoveByName("Psychic"));

console.log(yourActivePokemon);