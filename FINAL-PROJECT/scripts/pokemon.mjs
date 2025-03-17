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
          "Return",
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
          "Future Sight"
      ],
      pokedexNumber: 196,
      genderRatio: 0.875 // 87.5% male, 12.5% female
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
          "Foul Play",
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
          "Dragon Claw",
          "Volt Switch",
          "Wild Charge"
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
          "Foul Play",
          "Shadow Ball",
          "Flamethrower",
          "Pursuit",
          "Sludge Bomb"
      ],
      pokedexNumber: 571,
      genderRatio: 0.875 // 87.5% male, 12.5% female
  }
];

export default Pokemon;
