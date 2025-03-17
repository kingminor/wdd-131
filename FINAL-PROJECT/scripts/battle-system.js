import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";
import { getTypeEffectiveness } from "./typeChart.mjs"

const yourHealthBar = document.getElementById("your-health");
const opponentsHealthBar = document.getElementById("opponents-health");
const yourPokemonsNameTag = document.getElementById("your-pokemon-name-tag");
const opponentsPokemonNameTag = document.getElementById("opponents-pokemon-name-tag");
const yourPokemonSprite = document.getElementById("your-pokemon-sprite");
const opponentsPokemonSprite = document.getElementById("opponent-pokemon-sprite");

//Other 
let yourActivePokemon = null;
let opponentsActivePokemon = null;

//Variables to HANDLE USER INPUT AND ACTIONS
const actionHolder = document.getElementById("actions");
const attackButton = document.getElementById("attack-button");

const moveHolder = document.getElementById("moves");
const move1Button = document.getElementById("move1");
const move2Button = document.getElementById("move2");
const move3Button = document.getElementById("move3");
const move4Button = document.getElementById("move4");

//variables to handle dialog box
const dialogBox = document.getElementById("dialog-box");
const dialogBoxTest = document.getElementById("dialog-box-text")

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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



function getPokemonByName(name) {
    const pokemon = Pokemon.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    if (!pokemon) return null; // Avoid modifying a null object

    const newPokemon = JSON.parse(JSON.stringify(pokemon));
    newPokemon.level = 50;
    newPokemon.maxHealth = calculateHealth(newPokemon);
    newPokemon.health = newPokemon.maxHealth;
    newPokemon.status = null;
    return newPokemon;
}

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

function calculateHealth(inputPokemon) {
    let EV = 510;
    let IV = 31;

    let hp = Math.floor(((2 * inputPokemon.hp + IV + Math.floor(EV / 4)) * inputPokemon.level) / 100 + 10 + inputPokemon.level);
    
    return Math.round(hp); // Ensure health is an integer
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

function UpdateHealthBar() {  
    //Updates Stat UI
    yourHealthBar.value = yourActivePokemon.health;
    opponentsHealthBar.value = opponentsActivePokemon.health;

}

function GetEnemyMove() {
    let availableMoves = [
        opponentsActivePokemon.move1,
        opponentsActivePokemon.move2,
        opponentsActivePokemon.move3,
        opponentsActivePokemon.move4
    ].filter(move => move.pp > 0); // Exclude moves with 0 or less PP

    let bestMove = null;
    let highestDamage = 0;

    // If there are no valid moves left, return null
    if (availableMoves.length === 0) {
        return null;
    }

    // Will heal if health is less than 30% and a healing move is available
    if (opponentsActivePokemon.health < opponentsActivePokemon.maxHealth * 0.3) {
        for (let move of availableMoves) {
            if (move.category === "healing") {
                bestMove = move; // Assign healing move to bestMove
                break; // Exit loop once a healing move is found
            }
        }
    }

    // If no healing move was selected, choose the best move based on damage
    if (!bestMove) {
        availableMoves.forEach(move => {
            const damage = calculateDamage(opponentsActivePokemon, yourActivePokemon, move);
            if (damage >= highestDamage) {
                bestMove = move;
                highestDamage = damage;
            }
        });
    }

    return bestMove;
}

async function processTurn(yourMove) {
    dialogBox.style.display = "flex";
    moves.style.display = "none";

    let opponentsMove = GetEnemyMove();

    async function ExecuteMove(user, target, move) {
        if (move.pp <= 0) {
            await typeText(`${user.name} tried to use ${move.name}, but it failed!`);
            return;
        }

        await typeText(`${user.name} used ${move.name}`);
        if(move.specialBehavior != null){
            if(move.specialBehavior.toLowerCase() === "drain"){
                console.log("detected Drain Move")
                DrainPokemon(user, target, move)
            } 
        }
        else {
            if (move.category.toLowerCase() === "physical" || move.category.toLowerCase() === "special") {
                attackPokemon(user, target, move);
            } 
            else if (move.category.toLowerCase() === "healing") {
                HealPokemon(user, move.healPercentage);
            }
            //Add status effects here
        }

        move.pp -= 1;
    }

    if (yourMove.priority > opponentsMove.priority) {
        await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
        await delay(1500);
        await UpdateHealthBar();
        if (opponentsActivePokemon.health > 0) {
            await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
            await delay(1500);
            await UpdateHealthBar();
        }
    }
    else if (opponentsMove.priority > yourMove.priority) {
        await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
        await delay(1500);
        await UpdateHealthBar();
        if (yourActivePokemon.health > 0) {
            await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
            await delay(1500);
            await UpdateHealthBar();
        }
    }
    else {
        if (yourActivePokemon.speed >= opponentsActivePokemon.speed) {
            await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
            await delay(1500);
            await UpdateHealthBar();
            if (opponentsActivePokemon.health > 0) {
                await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
                await delay(1500);
                await UpdateHealthBar();
            }
        }
        else {
            await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
            await delay(1500);
            await UpdateHealthBar();
            if (yourActivePokemon.health > 0) {
                await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
                await delay(1500);
                await UpdateHealthBar();
            }
        }
    }

    await UpdateHealthBar();

    //add damage checkup phase. for status effects.
    async function pokemonCheckup(pokemon) {
        if(pokemon.status != null) {
            //Check for poison 
            if(pokemon.status.toLowerCase() === "psn"){
                pokemon.health = Math.max(0, pokemon.health - (pokemon.maxHealth * (1 / 8)));
                await typeText(`${pokemon.name} took damage from poison!`);
                await delay(1500);
            }
            else if(pokemon.status.toLowerCase() === "tox"){
                if(pokemon.turnsSinceTox == null){
                    pokemon.turnsSinceTox = 1;
                }
                else {
                    pokemon.turnsSinceTox += 1;
                }

                pokemon.health = Math.max(0, pokemon.health - ((pokemon.maxHealth * (1 / 16)) * turnsSinceTox));
                await typeText(`${pokemon.name} took damage from its toxic poison!`);
            }
            else if(pokemon.status.toLowerCase() === "brn") {
                pokemon.health = Math.max(0, pokemon.health - (pokemon.maxHealth * (1 / 16)));
                await typeText(`${pokemon.name} took damage from it's burn!`);
            }
        }
    }

    await pokemonCheckup(yourActivePokemon);
    await pokemonCheckup(opponentsActivePokemon);

    if (yourActivePokemon.health <= 0) {
        console.log(`${yourActivePokemon.name} fainted!`);
        await typeText(`${yourActivePokemon.name} fainted!`);
        yourPokemonSprite.classList.add("faint");
        await delay(1500);
    }

    if (opponentsActivePokemon.health <= 0) {
        console.log(`${opponentsActivePokemon.name} fainted!`);
        await typeText(`${opponentsActivePokemon.name} fainted!`);
        opponentsPokemonSprite.classList.add("faint");
        await delay(1500);
    }

    moveHolder.style.display = "none";
    actionHolder.style.display = "flex";
    dialogBox.style.display = "none";
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

    //Updates move holder ui
    moveHolder.style.display = "none";
    dialogBox.style.display = "none";
}

init("Umbreon", "Espeon");

AddMovesToPokemon(yourActivePokemon, "Dark Pulse", "Crunch", "Moonlight", "Giga Drain");
AddMovesToPokemon(opponentsActivePokemon, "Tackle", "Psychic", "Moonlight", "Aura Sphere");

function InitMoveUI() {
    move1Button.innerText = `${yourActivePokemon.move1.name}`;
    move2Button.innerText = `${yourActivePokemon.move2.name}`;
    move3Button.innerText = `${yourActivePokemon.move3.name}`;
    move4Button.innerText = `${yourActivePokemon.move4.name}`;
}
InitMoveUI();

attackButton.addEventListener("click", function() {
    moveHolder.style.display = "flex";
    actionHolder.style.display = "None"
});

move1Button.addEventListener("click", function() {
    processTurn(yourActivePokemon.move1);
});

move2Button.addEventListener("click", function() {
    processTurn(yourActivePokemon.move2);
});

move3Button.addEventListener("click", function() {
    processTurn(yourActivePokemon.move3);
});

move4Button.addEventListener("click", function() {
    processTurn(yourActivePokemon.move4);
});
