const typeChart = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, ghost: 0 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, bug: 0.5, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fighting: 2, poison: 0.5, steel: 0.5, dark: 2, dragon: 2 }
};

function getTypeEffectiveness(attackType, defenseTypes) {
    if (!attackType || !defenseTypes || defenseTypes.length === 0) {
        console.error(`Invalid type input: ${attackType}, ${defenseTypes}`);
        return 1; // Default to neutral effectiveness
    }

    attackType = attackType.toLowerCase(); // Ensure lowercase
    defenseTypes = defenseTypes.map(type => type.toLowerCase()); // Ensure lowercase for all

    let effectiveness = 1;
    
    // Check for effectiveness
    for (let type of defenseTypes) {
        const attackTypeLower = attackType.toLowerCase();
        const typeLower = type.toLowerCase();

        if (typeChart[attackTypeLower] && typeChart[attackTypeLower][typeLower] !== undefined) {
            effectiveness *= typeChart[attackTypeLower][typeLower];
        } else {
            effectiveness *= 1; // Default to neutral effectiveness instead of a warning
        }
    }

    //console.log(`Effectiveness ${effectiveness}, ${attackType} vs ${defenseTypes}!`)
    return effectiveness;
}

const typeIcons = {
    bug: "images/type-icon/Pokemon_Type_Icon_Bug.svg",
    dark: "images/type-icon/Pokemon_Type_Icon_Dark.svg",
    dragon: "images/type-icon/Pokemon_Type_Icon_Dragon.svg",
    electric: "images/type-icon/Pokemon_Type_Icon_Electric.svg",
    fairy: "images/type-icon/Pokemon_Type_Icon_Fairy.svg",
    fighting: "images/type-icon/Pokemon_Type_Icon_Fighting.svg",
    fire: "images/type-icon/Pokemon_Type_Icon_Fire.svg",
    flying: "images/type-icon/Pokemon_Type_Icon_Flying.svg",
    ghost: "images/type-icon/Pokemon_Type_Icon_Ghost.svg",
    grass: "images/type-icon/Pokemon_Type_Icon_Grass.svg",
    ground: "images/type-icon/Pokemon_Type_Icon_Ground.svg",
    ice: "images/type-icon/Pokemon_Type_Icon_Ice.svg",
    normal: "images/type-icon/Pokemon_Type_Icon_Normal.svg",
    poison: "images/type-icon/Pokemon_Type_Icon_Poison.svg",  // Fixed typo
    psychic: "images/type-icon/Pokemon_Type_Icon_Psychic.svg",
    rock: "images/type-icon/Pokemon_Type_Icon_Rock.svg",
    steel: "images/type-icon/Pokemon_Type_Icon_Steel.svg",
    water: "images/type-icon/Pokemon_Type_Icon_Water.svg",
};

function GetTypeImageSourceFromString(type) {
    return typeIcons[type.toLowerCase()] || "images/type-icon/default.svg";  // Fallback for unknown types
}

function generateTypeIcons(types, className = "", joinChar = " ") {
    // Ensure types is an array
    if (typeof types === "string") {
        types = [types]; // Convert single string to an array
    }

    return types.map(type => {
        const imgSrc = GetTypeImageSourceFromString(type);
        return `<img class="${className}" src="${imgSrc}" alt="${type} type icon">`;
    }).join(joinChar); // Joins all images into a single string
}


export { getTypeEffectiveness, GetTypeImageSourceFromString, generateTypeIcons };
