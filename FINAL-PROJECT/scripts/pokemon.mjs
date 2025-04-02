const Pokemon = [
  {
      name: "Eevee",
      type: ["Normal"],
      hp: 55,
      attack: 55,
      defense: 50,
      spattack: 45,
      spdef: 65,
      speed: 55,
      frontSprite: "images/poke/eevee/eevee.gif",
      backSprite: "images/poke/eevee/eevee-back.gif",
      moves: [
          "Tackle",
          "Quick Attack",
          "Hyper Beam",
          "Shadow Ball"
      ],
      pokedexNumber: 133,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  },
  {
      name: "Espeon",
      type: ["Psychic"],
      hp: 65,
      attack: 65,
      defense: 60,
      spattack: 130,
      spdef: 95,
      speed: 110,
      frontSprite: "images/poke/espeon/espeon.gif",
      backSprite: "images/poke/espeon/espeon-back.gif",
      moves: [
          "Psychic",
          "Shadow Ball",
          "Psybeam",
          "Dazzling Gleam",
          //"Future Sight"
      ],
      pokedexNumber: 196,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  },
  {
    name: "Flareon",
    type: ["Fire"],
    hp: 65,
    attack: 130,
    defense: 60,
    spattack: 95,
    spdef: 110,
    speed: 65,
    frontSprite: "images/poke/flareon/flareon.gif",
    backSprite: "images/poke/flareon/flareon-back.gif",
    moves: [
        "Flare Blitz",
        "Fire Fang",
        "Quick Attack",
        //"Superpower",
        "Will-O-Wisp",
        "Bite"
    ],
    pokedexNumber: 136,
    genderRatio: 0.875
  },
  {
    name: "Glaceon",
    type: ["Ice"],
    hp: 65,
    attack: 60,
    defense: 110,
    spattack: 130,
    spdef: 95,
    speed: 65,
    frontSprite: "images/poke/glaceon/glaceon.gif",
    backSprite: "images/poke/glaceon/glaceon-back.gif",
    moves: [
        "Ice Beam",
        "Shadow Ball",
        //"Mirror Coat",
        "Blizzard",
        //"Freeze-Dry",
        //"Hail"
        "Tackle"
    ],
    pokedexNumber: 471,
    genderRatio: 0.875
  },
  {
      name: "Houndoom",
      type: ["Dark", "Fire"],
      hp: 75,
      attack: 90,
      defense: 50,
      spattack: 110,
      spdef: 80,
      speed: 95,
      frontSprite: "images/poke/houndoom/houndoom.gif",
      backSprite: "images/poke/houndoom/houndoom-back.gif",
      moves: [
          "Flamethrower",
          "Crunch",
          "Dark Pulse",
          "Fire Blast",
          "Bite",
          "Sludge Bomb"
      ],
      pokedexNumber: 229,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  },
  {
    name: "Jolteon",
    type: ["Electric"],
    hp: 65,
    attack: 65,
    defense: 60,
    spattack: 110,
    spdef: 95,
    speed: 130,
    frontSprite: "images/poke/jolteon/jolteon.gif",
    backSprite: "images/poke/jolteon/jolteon-back.gif",
    moves: [
        "Thunderbolt",
        "Thunder Wave",
        "Shadow Ball",
        "Tackle"
        //"Pin Missile",
        //"Volt Switch",
        //"Hidden Power Ice"
    ],
    pokedexNumber: 135,
    genderRatio: 0.875
  },
  {
    name: "Leafeon",
    type: ["Grass"],
    hp: 65,
    attack: 110,
    defense: 130,
    spattack: 60,
    spdef: 65,
    speed: 95,
    frontSprite: "images/poke/leafeon/leafeon.gif",
    backSprite: "images/poke/leafeon/leafeon-back.gif",
    moves: [
        "Leaf Blade",
        //"Swords Dance",
        "X-Scissor",
        "Quick Attack",
        "Synthesis",
        //"Knock Off"
    ],
    pokedexNumber: 470,
    genderRatio: 0.875
  },
    {
      name: "Lucario",
      type: ["Fighting", "Steel"],
      hp: 70,
      attack: 110,
      defense: 70,
      spattack: 115,
      spdef: 70,
      speed: 90,
      frontSprite: "images/poke/lucario/lucario.gif",
      backSprite: "images/poke/lucario/lucario-back.gif",
      moves: [
          "Aura Sphere",
          "Close Combat",
          "Iron Tail",
          "Flash Cannon",
          "Extreme Speed",
          "Metal Claw"
      ],
      pokedexNumber: 448,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  },
  {
      name: "Umbreon",
      type: ["Dark"],
      hp: 95,
      attack: 65,
      defense: 110,
      spattack: 60,
      spdef: 130,
      speed: 65,
      frontSprite: "images/poke/umbreon/umbreon.gif",
      backSprite: "images/poke/umbreon/umbreon-back.gif",
      moves: [
          //"Foul Play",
          "Crunch",
          "Dark Pulse",
          "Payback",
          "Confuse Ray",
          "Toxic",
          "Moonlight"
      ],
      pokedexNumber: 197,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  },
  {
    name: "Vaporeon",
    type: ["Water"],
    hp: 130,
    attack: 65,
    defense: 60,
    spattack: 110,
    spdef: 95,
    speed: 65,
    frontSprite: "images/poke/vaporeon/vaporeon.gif",
    backSprite: "images/poke/vaporeon/vaporeon-back.gif",
    moves: [
        "Scald",
        "Ice Beam",
        //"Aqua Ring",
        //"Acid Armor",
        "Hydro Pump",
        //"Wish"
        "Tackle"
    ],
    pokedexNumber: 134,
    genderRatio: 0.875
  },
  {
      name: "Zekrom",
      type: ["Dragon", "Electric"],
      hp: 100,
      attack: 150,
      defense: 120,
      spattack: 120,
      spdef: 100,
      speed: 90,
      frontSprite: "images/poke/zekrom/zekrom.gif",
      backSprite: "images/poke/zekrom/zekrom-back.gif",
      moves: [
          "Thunderbolt",
          "Fusion Bolt",
          "Outrage",
          //"Dragon Claw",
          //"Volt Switch",
          //"Wild Charge"
          "Quick Attack"
      ],
      pokedexNumber: 644,
      genderRatio: null // Genderless
  },
  {
      name: "Zoroark",
      type: ["Dark"],
      hp: 60,
      attack: 105,
      defense: 60,
      spattack: 120,
      spdef: 60,
      speed: 105,
      frontSprite: "images/poke/zoroark/zoroark.gif",
      backSprite: "images/poke/zoroark/zoroark-back.gif",
      moves: [
          "Night Slash",
          //"Foul Play",
          "Shadow Ball",
          "Flamethrower",
          //"Pursuit",
          "Sludge Bomb"
      ],
      pokedexNumber: 571,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  }
];

export default Pokemon;
