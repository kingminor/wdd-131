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
const delayAmount = 1200;

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

async function processTurn(yourMove) {
    dialogBox.style.display = "flex";
    moves.style.display = "none";

    let opponentsMove = GetEnemyMove();

    async function ExecuteMove(user, target, move) {
        if (move.pp <= 0) {
            await typeText(`${user.name} tried to use ${move.name}, but it failed!`);
            return;
        }

        if(await doesHitAdvanced(user, target, move)) {
            await typeText(`${user.name} used ${move.name}`);
            await delay(delayAmount);
            if(move.specialBehavior != null){
                if(move.specialBehavior.toLowerCase() === "drain"){
                    DrainPokemon(user, target, move);
                } 
                else if (move.specialBehavior.toLowerCase() === "dmg-psn") {
                    attackPokemon(user, target, move);
                    if(doesSucceed(move.statusAccuracy)){
                        target.status = "psn";
                    }
                }
                else if (move.specialBehavior.toLowerCase() === "dmg-tox") {
                    attackPokemon(user, target, move);
                    if(doesSucceed(move.statusAccuracy)){
                        target.status = "tox";
                    }
                }
            }
            else {
                if (move.category.toLowerCase() === "physical" || move.category.toLowerCase() === "special") {
                    attackPokemon(user, target, move);
                } 
                else if (move.category.toLowerCase() === "healing") {
                    HealPokemon(user, move.healPercentage);
                }
                else if(move.category.toLowerCase() === "status") {
                    target.status = move.statusType.toLowerCase();
                    if(move.statusType.toLowerCase() === "pzn"){
                        await typeText(`${target.name} is now poisoned!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "frz"){
                        await typeText(`${target.name} is now frozen!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "slp"){
                        await typeText(`${target.name} is now asleep!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "con"){
                        await typeText(`${target.name} is now confused!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "inf"){
                        await typeText(`${target.name} fell in love with ${user.name}!`);
                        await delay(delayAmount);
                    }
                }
            }

            move.pp -= 1;
        }
        else {
            if(user.status == null){
                await typeText(`${user.name} tried to use ${move.name}, but it missed!`);
                await delay(delayAmount);
            }
        }
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
                pokemon.health -= (pokemon.maxHealth * (1 / 8));
                pokemon.health = Math.max(pokemon.health, 0);
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

                pokemon.health -= (pokemon.maxHealth * ((1 / 16) * pokemon.turnsSinceTox));
                pokemon.health = Math.max(pokemon.health, 0);
                await typeText(`${pokemon.name} took damage from its toxic poison!`);
                await delay(1500);
            }
            else if(pokemon.status.toLowerCase() === "brn") {
                pokemon.health -= (pokemon.maxHealth * (1 / 16));
                pokemon.health = Math.max(pokemon.health, 0);
                await typeText(`${pokemon.name} took damage from it's burn!`);
                await delay(1500);
            }
        }
    }

    await pokemonCheckup(yourActivePokemon);
    await pokemonCheckup(opponentsActivePokemon);

    UpdateHealthBar();

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

AddMovesToPokemon(yourActivePokemon, "Dark Pulse", "Crunch", "Moonlight", "Confuse Ray");
AddMovesToPokemon(opponentsActivePokemon, "Tackle", "Psychic", "Moonlight", "Toxic Surge");

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
