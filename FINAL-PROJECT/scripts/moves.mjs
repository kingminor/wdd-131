const movesList = [
  {
    name: "Assurance",
    type: "Dark",
    category: "Physical",
    power: 60,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "If the target has already taken damage in the same turn, its power is doubled.",
    critChance: 0.0625  // Default crit rate for physical moves (6.25% crit chance)
  },
  {
    name: "Aura Sphere",
    type: "Fighting",
    category: "Special",
    power: 80,
    accuracy: null,
    pp: 20,
    priority: 0,
    description: "The user lets loose a pulse of aura power from deep within its body at the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Close Combat",
    type: "Fighting",
    category: "Physical",
    power: 120,
    accuracy: 100,
    pp: 5,
    priority: 0,
    description: "The user fights with overwhelming strength, lowering the user's Defense and Special Defense.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Confuse Ray",
    type: "Ghose",
    category: "Status",
    statusType: "con",
    accuracy: "100",
    pp: 10,
    priority:0,
    description: "The user releases a ray of eerie light, confusing the target and making them disoriented.",
  },
  {
    name: "Crunch",
    type: "Dark",
    category: "Physical",
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user crunches the target with sharp fangs. This may also lower the target's Defense stat.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Dark Pulse",
    type: "Dark",
    category: "Special",
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user releases a horrible aura imbued with dark thoughts. This may also cause the target to flinch.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Extreme Speed",
    type: "Normal",
    category: "Physical",
    power: 80,
    accuracy: 100,
    pp: 5,
    priority: 2,
    description: "The user attacks with great speed, striking first.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Fire Blast",
    type: "Fire",
    category: "Special",
    power: 110,
    accuracy: 85,
    pp: 5,
    priority: 0,
    description: "The user unleashes a massive blast of fire. This may also burn the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Fusion Bolt",
    type: "Electric",
    category: "Physical",
    power: 100,
    accuracy: 100,
    pp: 5,
    priority: 0,
    description: "The user charges at the target with an electric bolt. It has a high critical hit ratio.",
    critChance: 0.125  // Higher crit rate (12.5%)
  },
  {
    name: "Future Sight",
    type: "Psychic",
    category: "Special",
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "The user prepares to strike the target with a powerful psychic attack in two turns.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Giga Drain",
    type: "Grass",
    category: "Special",
    specialBehavior: "Drain",
    power: 75,
    healPercentage: 0.5,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "A nutrient-draining attack. The user's HP is restored by half the damage taken by the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Ice Beam",
    type: "Ice",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "The user shoots a beam of ice at the target. This may also freeze the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Iron Tail",
    type: "Steel",
    category: "Physical",
    power: 100,
    accuracy: 75,
    pp: 15,
    priority: 0,
    description: "The user attacks with a hard tail that may also lower the target's Defense.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Moonlight",
    type: "Fairy",
    category: "healing",
    healPercentage: 0.5,
    accuracy: 100,
    pp: 5,
    priority: 0,
    description: "The user restores its HP. The amount of HP restored varies depending on the weather.",
    critChance: 0  // Healing moves don't critically hit
  },
  {
    name: "Night Slash",
    type: "Dark",
    category: "Physical",
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user slashes the target with its claws. This may also increase the user's critical hit ratio.",
    critChance: 0.125  // Increased crit chance (12.5%)
  },
  {
    name: "Outrage",
    type: "Dragon",
    category: "Physical",
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "The user rampages for 2-3 turns, attacking everything in sight. The user becomes confused after using the move.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Payback",
    type: "Dark",
    category: "Physical",
    power: 50,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "If the target has already attacked the user in the same turn, the power is doubled.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Psychic",
    type: "Psychic",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "The target is hit with a strong telekinetic force. This may also lower the target’s Sp. Def stat.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Quick Attack",
    type: "Normal",
    category: "Physical",
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    description: "The user strikes first with a quick attack.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Return",
    type: "Normal",
    category: "Physical",
    power: 102,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user returns the affection the target shows towards it, dealing damage based on how friendly the user is to the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Shadow Ball",
    type: "Ghost",
    category: "Special",
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user attacks with a shadowy blob. This may also lower the target's Sp. Def stat.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Thunderbolt",
    type: "Electric",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 15,
    priority: 0,
    description: "The user strikes with a bolt of lightning. This may also paralyze the target.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Toxic",
    type: "Poison",
    category: "Status",
    statusType: "psn",
    accuracy: "90",
    pp: 10,
    priority: 0,
    description: "The user shoots a toxic substance at the target, badly poisoning them.",

  },
  {
    name: "Toxic Surge",
    type: "Poison",
    category: "Special",
    specialBehavior: "dmg-tox",
    statusAccuracy: 30,
    power: 80,
    accuracy: 100,
    pp: 10,
    priority: 0,
    description: "The user releases a violent surge of toxic energy, dealing damage and having a 30% chance to badly poison the target.",
    critChance: 0.0625
  },
  {
    name: "Tackle",
    type: "Normal",
    category: "Physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    description: "The user tackles the target with force.",
    critChance: 0.0625  // Default crit rate
  },
  {
    name: "Will-O-Wisp",
    type: "Fire",
    category: "Status",
    statusType: "brn",
    accuracy: 85,
    pp: 10,
    priority: 0,
    description: "The user fights with overwhelming strength, lowering the user's Defense and Special Defense.",
  },
];

export default movesList;
