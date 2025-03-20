import Pokemon from "./pokemon.mjs";
import movesList from "./moves.mjs";
import { getTypeEffectiveness, GetTypeImageSourceFromString, generateTypeIcons } from "./typeChart.mjs"
import {GenerateTeamFromPokemon, testTeam1, testTeam2, getSTAB, calculateDamage, attackPokemon, HealPokemon, DrainPokemon, doesSucceed, doesHitWithStats, doesHitAdvanced } from "./pokemon-utils.mjs";
import {typeText, UpdateHealthBar, UpdateNameTags} from "./ui-utils.mjs";

const yourPokemonSprite = document.getElementById("your-pokemon-sprite");
const opponentsPokemonSprite = document.getElementById("opponent-pokemon-sprite");

//Other 
let yourActivePokemon = null;
let opponentsActivePokemon = null;

let yourPokemonTeam = [];
let opponentsPokemonTeam = [];

let blockTab = false;

//Variables to HANDLE USER INPUT AND ACTIONS
const actionHolder = document.getElementById("actions");
const attackButton = document.getElementById("attack-button");
const switchPokemonButton = document.getElementById("switch-pokemon-button");

const moveHolder = document.getElementById("moves");
const move1Button = document.getElementById("move1");
const move2Button = document.getElementById("move2");
const move3Button = document.getElementById("move3");
const move4Button = document.getElementById("move4");


const dialogBox = document.getElementById("dialog-box");
const delayAmount = 1200;

//variables to handle switching pokemon
const switchPokemonScreen = document.getElementById("select-pokemon-screen");
const teamHolder = document.getElementById("team-holder");
const pokemonInfoHolder = document.getElementById("pokemon-info-holder");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

function GetEnemyNextPokemon() {
    return opponentsPokemonTeam.find(pokemon => pokemon.health > 0);
}

function OpenSwitchPokemon() {
    switchPokemonScreen.style.display = "block";

    function PokemonTabTemplate(pokemon, index) {
        let gender = "";

        if (pokemon.gender !== null) {
            if (pokemon.gender.toLowerCase() === "male") {
                gender = "♂";
            } else if (pokemon.gender.toLowerCase() === "female") {
                gender = "♀";
            }
        }

        return `<div class="pokemon-summarry" id="pokemon-${index + 1}" data-index="${index}">
                    <img src="${pokemon.frontSprite}" alt="pokemon">
                    <h1>${pokemon.name}</h1>
                    <p> LV: ${pokemon.level} ${gender}</p> 
                    <progress value="${pokemon.health}" max="${pokemon.maxHealth}"></progress>
                </div>`;
    }

    function MoveInfoTemplate(move){
        return `<div class="pokemon-move">
                    ${generateTypeIcons(move.type, "move-type-picture")}
                    <p>${move.name}</p>
                    <p>${move.pp}</p>
                </div>`
    }

    function ConvertStatusToText(status) {
        if (status === null || status.toLowerCase() === "") {
            return `<span style="color: #32CD32">Healthy</span>`;
        } else if (status.toLowerCase() === "psn") {
            return `<span style="color:rgb(161, 90, 205) ">Poisoned</span>`;
        } else if (status.toLowerCase() === "tox") {
            return `<span style="color: #9400D3 ">Badly Poisoned</span>`;
        } else if (status.toLowerCase() === "brn") {
            return `<span style="color: #FF4500  ">Burned</span>`;
        } else if (status.toLowerCase() === "par") {
            return `<span style="color: #FFD700  ">Paralysed</span>`;
        } else if (status.toLowerCase() === "slp") {
            return `<span style="color: #ADD8E6  ">Asleep</span>`;
        } else if (status.toLowerCase() === "frz") {
            return `<span style="color: #00FFFF  ">Frozen</span>`;
        }
    }
    

    // Generate and insert HTML
    teamHolder.innerHTML = yourPokemonTeam.map((pokemon, index) => PokemonTabTemplate(pokemon, index)).join("");

    // Add hover event listeners
    document.querySelectorAll(".pokemon-summarry").forEach(pokemonElement => {
        pokemonElement.addEventListener("mouseenter", (event) => {
            //console.log("Hovered over:", event.currentTarget.id);

            let index = event.currentTarget.dataset.index;

            let html = `<div id="pokemon-info-holder">
                            <p>${yourPokemonTeam[index].name}</p>
                            <p>Status: ${ConvertStatusToText(yourPokemonTeam[index].status)}</p>
                            <p>Type: ${generateTypeIcons(yourPokemonTeam[index].type, "pokemon-info-holder-type-img")}</p>
                        </div>
                        ${MoveInfoTemplate(yourPokemonTeam[index].move1)}
                        ${MoveInfoTemplate(yourPokemonTeam[index].move2)}
                        ${MoveInfoTemplate(yourPokemonTeam[index].move3)}
                        ${MoveInfoTemplate(yourPokemonTeam[index].move4)}`

            pokemonInfoHolder.innerHTML = html;
        });

        pokemonElement.addEventListener("mouseleave", () => {
            //console.log("No longer hovering");
        });

        pokemonElement.addEventListener("click", (event) => {
            let index = event.currentTarget.dataset.index;
            let selectedPokemon = yourPokemonTeam[index];
        
            if (selectedPokemon.health > 0) {
                YouSwitchPokemon(selectedPokemon);
            } else {
                alert(`${selectedPokemon.name} has fainted and cannot be sent out!`);
            }
        });
        
    });
}



// MOST IMPORTANT FUNCTION
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
                    let whoIsEffected = target;
                    if(move.statusTarget === 0){ //0 is self 1 is other
                        whoIsEffected = user;
                    }
                    whoIsEffected.status = move.statusType.toLowerCase();
                    if(move.statusType.toLowerCase() === "pzn"){
                        await typeText(`${whoIsEffected.name} is now poisoned!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "frz"){
                        await typeText(`${whoIsEffected.name} is now frozen!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "slp"){
                        await typeText(`${whoIsEffected.name} is now asleep!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "con"){
                        await typeText(`${whoIsEffected.name} is now confused!`);
                        await delay(delayAmount);
                    } else if(move.statusType.toLowerCase() === "inf"){
                        await typeText(`${whoIsEffected.name} fell in love with ${user.name}!`);
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
        UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
        if (opponentsActivePokemon.health > 0) {
            await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
            UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
        }
    }
    else if (opponentsMove.priority > yourMove.priority) {
        await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
        UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
        if (yourActivePokemon.health > 0) {
            await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
            UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
        }
    }
    else {
        if (yourActivePokemon.speed >= opponentsActivePokemon.speed) {
            await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
            UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
            if (opponentsActivePokemon.health > 0) {
                await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
                UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
            }
        }
        else {
            await ExecuteMove(opponentsActivePokemon, yourActivePokemon, opponentsMove);
            UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
            if (yourActivePokemon.health > 0) {
                await ExecuteMove(yourActivePokemon, opponentsActivePokemon, yourMove);
                UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);
            }
        }
    }

    UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);

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

    UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);

    // Did your pokemon get knocked out
    if (yourActivePokemon.health <= 0) {
        yourPokemonSprite.classList.remove("pokemon-enter-glow");
        console.log(`${yourActivePokemon.name} fainted!`);
        await typeText(`${yourActivePokemon.name} fainted!`);
        yourPokemonSprite.classList.add("faint");
        await delay(delayAmount);
    }

    //Did your oppoents pokemon get knocked out
    if (opponentsActivePokemon.health <= 0) {
        opponentsPokemonSprite.classList.remove("pokemon-enter-glow");
        console.log(`${opponentsActivePokemon.name} fainted!`);
        await typeText(`${opponentsActivePokemon.name} fainted!`);
        opponentsPokemonSprite.classList.add("faint");
        await delay(delayAmount);
        let opponentsNextPokemon = GetEnemyNextPokemon();
        console.log(opponentsNextPokemon);
        if (opponentsNextPokemon != null){
            await OpponentSwitchPokemon(opponentsNextPokemon);
        }
    }

    moveHolder.style.display = "none";
    actionHolder.style.display = "flex";
    dialogBox.style.display = "none";
}

function init(yourTeam, opponentsTeam) {
    /*Initialize pokemon*/
    yourActivePokemon = yourTeam[0];
    opponentsActivePokemon = opponentsTeam[0];

    //Initializes Health Bars
    UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);

    //Updates Names Tags
    UpdateNameTags(yourActivePokemon, opponentsActivePokemon);

    //Updates Sprites
    yourPokemonSprite.src = yourActivePokemon.backSprite;
    opponentsPokemonSprite.src = opponentsActivePokemon.frontSprite;

    //Updates move holder ui
    moveHolder.style.display = "none";
    dialogBox.style.display = "none";

    //Updates switch pokemon
    switchPokemonScreen.style.display = "none";

    move1Button.innerText = `${yourActivePokemon.move1.name}`;
    move2Button.innerText = `${yourActivePokemon.move2.name}`;
    move3Button.innerText = `${yourActivePokemon.move3.name}`;
    move4Button.innerText = `${yourActivePokemon.move4.name}`;
}

async function OpponentSwitchPokemon(newActivePokemon){ //Active slot is a reference to either yourActivePokemon or opponentsActivePokemon

    await typeText(`Opponent sent out ${newActivePokemon.name}!`)
    await delay(delayAmount);

    opponentsActivePokemon = newActivePokemon;

    //Initializes Health Bars
    UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);

    //Updates Names Tags
    UpdateNameTags(yourActivePokemon, opponentsActivePokemon);

    //Updates Sprites
    opponentsPokemonSprite.src = opponentsActivePokemon.frontSprite;

    opponentsPokemonSprite.classList.remove("faint");
    opponentsPokemonSprite.classList.add("pokemon-enter-glow");
}

async function YouSwitchPokemon (newActivePokemon) {

    switchPokemonScreen.style.display = "none";
    actionHolder.style.display = "none";
    yourPokemonSprite.classList.remove("pokemon-enter-glow");
    dialogBox.style.display = "flex";
    console.log("atempting to switch pokemon");

    if(yourActivePokemon.health > 0){
        await typeText(`Great job ${yourActivePokemon.name}! Return!`);
        await delay(delayAmount);
        yourPokemonSprite.classList.add("retreat-animation");
        await delay(delayAmount);
    }

    await typeText(`Go, ${newActivePokemon.name}! Show them what you've got!`);
    await delay(delayAmount);

    yourActivePokemon = newActivePokemon;

    UpdateHealthBar(yourActivePokemon, opponentsActivePokemon);

    UpdateNameTags(yourActivePokemon, opponentsActivePokemon);

    yourPokemonSprite.src = yourActivePokemon.backSprite;

    yourPokemonSprite.classList.remove("retreat-animation");
    yourPokemonSprite.classList.remove("faint");
    yourPokemonSprite.classList.add("pokemon-enter-glow");

    await delay(delayAmount);
    actionHolder.style.display = "flex";
    dialogBox.style.display = "none";
}

GenerateTeamFromPokemon(yourPokemonTeam, testTeam1)

GenerateTeamFromPokemon(opponentsPokemonTeam, testTeam2)

init(yourPokemonTeam, opponentsPokemonTeam);

console.log(yourPokemonTeam);
console.log(opponentsPokemonTeam);

attackButton.addEventListener("click", function() {
    moveHolder.style.display = "flex";
    actionHolder.style.display = "None"
});

switchPokemonButton.addEventListener("click", OpenSwitchPokemon);

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

document.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        if(blockTab === false){
            event.preventDefault(); // Prevents browser focus switching
            switchPokemonScreen.style.display = "none";
            moveHolder.style.display = "none";
            actionHolder.style.display = "flex";
        }
    }
});