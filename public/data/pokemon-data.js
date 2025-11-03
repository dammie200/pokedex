const MAX_SPECIES_ID = 1025;
const API_BASE_URL = "https://pokeapi.co/api/v2";

const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

const NAME_OVERRIDES = new Map([
  ["nidoran-f", "Nidoran♀"],
  ["nidoran-m", "Nidoran♂"],
  ["mr-mime", "Mr. Mime"],
  ["mr-rime", "Mr. Rime"],
  ["mime-jr", "Mime Jr."],
  ["farfetchd", "Farfetch'd"],
  ["sirfetchd", "Sirfetch'd"],
  ["ho-oh", "Ho-Oh"],
  ["porygon-z", "Porygon-Z"],
  ["type-null", "Type: Null"],
  ["jangmo-o", "Jangmo-o"],
  ["hakamo-o", "Hakamo-o"],
  ["kommo-o", "Kommo-o"],
  ["flabebe", "Flabébé"],
  ["wo-chien", "Wo-Chien"],
  ["chien-pao", "Chien-Pao"],
  ["ting-lu", "Ting-Lu"],
  ["chi-yu", "Chi-Yu"],
  ["great-tusk", "Great Tusk"],
  ["scream-tail", "Scream Tail"],
  ["brute-bonnet", "Brute Bonnet"],
  ["flutter-mane", "Flutter Mane"],
  ["slither-wing", "Slither Wing"],
  ["sandy-shocks", "Sandy Shocks"],
  ["iron-treads", "Iron Treads"],
  ["iron-bundle", "Iron Bundle"],
  ["iron-hands", "Iron Hands"],
  ["iron-jugulis", "Iron Jugulis"],
  ["iron-moth", "Iron Moth"],
  ["iron-thorns", "Iron Thorns"],
  ["wooper-paldea", "Wooper"],
  ["tauros-paldea-combat", "Tauros"],
  ["tauros-paldea-aqua", "Tauros"],
  ["tauros-paldea-blaze", "Tauros"],
]);

const REGIONAL_VARIANTS = [
  { speciesId: 19, form: "alola", regionCode: "A", name: "Rattata (Alolan)", formSlug: "rattata-alola" },
  { speciesId: 20, form: "alola", regionCode: "A", name: "Raticate (Alolan)", formSlug: "raticate-alola" },
  { speciesId: 26, form: "alola", regionCode: "A", name: "Raichu (Alolan)", formSlug: "raichu-alola" },
  { speciesId: 27, form: "alola", regionCode: "A", name: "Sandshrew (Alolan)", formSlug: "sandshrew-alola" },
  { speciesId: 28, form: "alola", regionCode: "A", name: "Sandslash (Alolan)", formSlug: "sandslash-alola" },
  { speciesId: 37, form: "alola", regionCode: "A", name: "Vulpix (Alolan)", formSlug: "vulpix-alola" },
  { speciesId: 38, form: "alola", regionCode: "A", name: "Ninetales (Alolan)", formSlug: "ninetales-alola" },
  { speciesId: 50, form: "alola", regionCode: "A", name: "Diglett (Alolan)", formSlug: "diglett-alola" },
  { speciesId: 51, form: "alola", regionCode: "A", name: "Dugtrio (Alolan)", formSlug: "dugtrio-alola" },
  { speciesId: 52, form: "alola", regionCode: "A", name: "Meowth (Alolan)", formSlug: "meowth-alola" },
  { speciesId: 52, form: "galar", regionCode: "G", name: "Meowth (Galarian)", formSlug: "meowth-galar" },
  { speciesId: 53, form: "alola", regionCode: "A", name: "Persian (Alolan)", formSlug: "persian-alola" },
  { speciesId: 58, form: "hisui", regionCode: "H", name: "Growlithe (Hisuian)", formSlug: "growlithe-hisui" },
  { speciesId: 59, form: "hisui", regionCode: "H", name: "Arcanine (Hisuian)", formSlug: "arcanine-hisui" },
  { speciesId: 74, form: "alola", regionCode: "A", name: "Geodude (Alolan)", formSlug: "geodude-alola" },
  { speciesId: 75, form: "alola", regionCode: "A", name: "Graveler (Alolan)", formSlug: "graveler-alola" },
  { speciesId: 76, form: "alola", regionCode: "A", name: "Golem (Alolan)", formSlug: "golem-alola" },
  { speciesId: 77, form: "galar", regionCode: "G", name: "Ponyta (Galarian)", formSlug: "ponyta-galar" },
  { speciesId: 78, form: "galar", regionCode: "G", name: "Rapidash (Galarian)", formSlug: "rapidash-galar" },
  { speciesId: 79, form: "galar", regionCode: "G", name: "Slowpoke (Galarian)", formSlug: "slowpoke-galar" },
  { speciesId: 80, form: "galar", regionCode: "G", name: "Slowbro (Galarian)", formSlug: "slowbro-galar" },
  { speciesId: 83, form: "galar", regionCode: "G", name: "Farfetch'd (Galarian)", formSlug: "farfetchd-galar" },
  { speciesId: 88, form: "alola", regionCode: "A", name: "Grimer (Alolan)", formSlug: "grimer-alola" },
  { speciesId: 89, form: "alola", regionCode: "A", name: "Muk (Alolan)", formSlug: "muk-alola" },
  { speciesId: 100, form: "hisui", regionCode: "H", name: "Voltorb (Hisuian)", formSlug: "voltorb-hisui" },
  { speciesId: 101, form: "hisui", regionCode: "H", name: "Electrode (Hisuian)", formSlug: "electrode-hisui" },
  { speciesId: 103, form: "alola", regionCode: "A", name: "Exeggutor (Alolan)", formSlug: "exeggutor-alola" },
  { speciesId: 110, form: "galar", regionCode: "G", name: "Weezing (Galarian)", formSlug: "weezing-galar" },
  { speciesId: 122, form: "galar", regionCode: "G", name: "Mr. Mime (Galarian)", formSlug: "mr-mime-galar" },
  {
    speciesId: 128,
    form: "paldea-combat",
    regionCode: "P",
    name: "Tauros (Paldean)",
    formSlug: "tauros-paldea-combat",
    pokemonSlug: "tauros-paldea-combat",
    pokemonId: 10263,
    sprite: `${SPRITE_BASE_URL}/10263.png`,
  },
  {
    speciesId: 128,
    form: "paldea-blaze",
    regionCode: "P",
    name: "Tauros (Paldean Blaze Breed)",
    formSlug: "tauros-paldea-blaze",
    pokemonSlug: "tauros-paldea-blaze",
    pokemonId: 10264,
    sprite: `${SPRITE_BASE_URL}/10264.png`,
  },
  {
    speciesId: 128,
    form: "paldea-aqua",
    regionCode: "P",
    name: "Tauros (Paldean Aqua Breed)",
    formSlug: "tauros-paldea-aqua",
    pokemonSlug: "tauros-paldea-aqua",
    pokemonId: 10265,
    sprite: `${SPRITE_BASE_URL}/10265.png`,
  },
  { speciesId: 144, form: "galar", regionCode: "G", name: "Articuno (Galarian)", formSlug: "articuno-galar" },
  { speciesId: 145, form: "galar", regionCode: "G", name: "Zapdos (Galarian)", formSlug: "zapdos-galar" },
  { speciesId: 146, form: "galar", regionCode: "G", name: "Moltres (Galarian)", formSlug: "moltres-galar" },
  { speciesId: 157, form: "hisui", regionCode: "H", name: "Typhlosion (Hisuian)", formSlug: "typhlosion-hisui" },
  { speciesId: 194, form: "paldea", regionCode: "P", name: "Wooper (Paldean)", formSlug: "wooper-paldea" },
  { speciesId: 199, form: "galar", regionCode: "G", name: "Slowking (Galarian)", formSlug: "slowking-galar" },
  { speciesId: 211, form: "hisui", regionCode: "H", name: "Qwilfish (Hisuian)", formSlug: "qwilfish-hisui" },
  { speciesId: 215, form: "hisui", regionCode: "H", name: "Sneasel (Hisuian)", formSlug: "sneasel-hisui" },
  { speciesId: 222, form: "galar", regionCode: "G", name: "Corsola (Galarian)", formSlug: "corsola-galar" },
  { speciesId: 263, form: "galar", regionCode: "G", name: "Zigzagoon (Galarian)", formSlug: "zigzagoon-galar" },
  { speciesId: 264, form: "galar", regionCode: "G", name: "Linoone (Galarian)", formSlug: "linoone-galar" },
  { speciesId: 503, form: "hisui", regionCode: "H", name: "Samurott (Hisuian)", formSlug: "samurott-hisui" },
  { speciesId: 549, form: "hisui", regionCode: "H", name: "Lilligant (Hisuian)", formSlug: "lilligant-hisui" },
  { speciesId: 550, form: "hisui", regionCode: "H", name: "Basculin (White-Striped)", formSlug: "basculin-white-striped" },
  { speciesId: 554, form: "galar", regionCode: "G", name: "Darumaka (Galarian)", formSlug: "darumaka-galar" },
  {
    speciesId: 555,
    form: "galar-standard",
    regionCode: "G",
    name: "Darmanitan (Galarian)",
    formSlug: "darmanitan-galar",
    pokemonSlug: "darmanitan-galar",
    pokemonId: 10167,
    sprite: `${SPRITE_BASE_URL}/other/official-artwork/10167.png`,
  },
  {
    speciesId: 555,
    form: "galar-zen",
    regionCode: "G",
    name: "Darmanitan (Galarian Zen)",
    formSlug: "darmanitan-galar-zen",
    pokemonSlug: "darmanitan-galar-zen",
    pokemonId: 10168,
    sprite: `${SPRITE_BASE_URL}/other/official-artwork/10168.png`,
  },
  { speciesId: 562, form: "galar", regionCode: "G", name: "Yamask (Galarian)", formSlug: "yamask-galar" },
  { speciesId: 570, form: "hisui", regionCode: "H", name: "Zorua (Hisuian)", formSlug: "zorua-hisui" },
  { speciesId: 571, form: "hisui", regionCode: "H", name: "Zoroark (Hisuian)", formSlug: "zoroark-hisui" },
  { speciesId: 618, form: "galar", regionCode: "G", name: "Stunfisk (Galarian)", formSlug: "stunfisk-galar" },
  { speciesId: 628, form: "hisui", regionCode: "H", name: "Braviary (Hisuian)", formSlug: "braviary-hisui" },
  { speciesId: 705, form: "hisui", regionCode: "H", name: "Sliggoo (Hisuian)", formSlug: "sliggoo-hisui" },
  { speciesId: 706, form: "hisui", regionCode: "H", name: "Goodra (Hisuian)", formSlug: "goodra-hisui" },
  { speciesId: 713, form: "hisui", regionCode: "H", name: "Avalugg (Hisuian)", formSlug: "avalugg-hisui" },
  { speciesId: 724, form: "hisui", regionCode: "H", name: "Decidueye (Hisuian)", formSlug: "decidueye-hisui" },
  { speciesId: 905, form: "therian", regionCode: "H", name: "Enamorus (Therian)", formSlug: "enamorus-therian" },
  { speciesId: 901, form: "bloodmoon", regionCode: "K", name: "Ursaluna (Bloodmoon)", formSlug: "ursaluna-bloodmoon" },
];

const MEGA_FORMS = [
  { speciesId: 3, form: "mega", regionCode: "M", name: "Venusaur (Mega)", formSlug: "venusaur-mega", pokemonSlug: "venusaur-mega" },
  { speciesId: 6, form: "mega-x", regionCode: "MX", name: "Charizard (Mega X)", formSlug: "charizard-mega-x", pokemonSlug: "charizard-mega-x" },
  { speciesId: 6, form: "mega-y", regionCode: "MY", name: "Charizard (Mega Y)", formSlug: "charizard-mega-y", pokemonSlug: "charizard-mega-y" },
  { speciesId: 9, form: "mega", regionCode: "M", name: "Blastoise (Mega)", formSlug: "blastoise-mega", pokemonSlug: "blastoise-mega" },
  { speciesId: 15, form: "mega", regionCode: "M", name: "Beedrill (Mega)", formSlug: "beedrill-mega", pokemonSlug: "beedrill-mega" },
  { speciesId: 18, form: "mega", regionCode: "M", name: "Pidgeot (Mega)", formSlug: "pidgeot-mega", pokemonSlug: "pidgeot-mega" },
  { speciesId: 65, form: "mega", regionCode: "M", name: "Alakazam (Mega)", formSlug: "alakazam-mega", pokemonSlug: "alakazam-mega" },
  { speciesId: 80, form: "mega", regionCode: "M", name: "Slowbro (Mega)", formSlug: "slowbro-mega", pokemonSlug: "slowbro-mega" },
  { speciesId: 94, form: "mega", regionCode: "M", name: "Gengar (Mega)", formSlug: "gengar-mega", pokemonSlug: "gengar-mega" },
  { speciesId: 115, form: "mega", regionCode: "M", name: "Kangaskhan (Mega)", formSlug: "kangaskhan-mega", pokemonSlug: "kangaskhan-mega" },
  { speciesId: 127, form: "mega", regionCode: "M", name: "Pinsir (Mega)", formSlug: "pinsir-mega", pokemonSlug: "pinsir-mega" },
  { speciesId: 130, form: "mega", regionCode: "M", name: "Gyarados (Mega)", formSlug: "gyarados-mega", pokemonSlug: "gyarados-mega" },
  { speciesId: 142, form: "mega", regionCode: "M", name: "Aerodactyl (Mega)", formSlug: "aerodactyl-mega", pokemonSlug: "aerodactyl-mega" },
  { speciesId: 150, form: "mega-x", regionCode: "MX", name: "Mewtwo (Mega X)", formSlug: "mewtwo-mega-x", pokemonSlug: "mewtwo-mega-x" },
  { speciesId: 150, form: "mega-y", regionCode: "MY", name: "Mewtwo (Mega Y)", formSlug: "mewtwo-mega-y", pokemonSlug: "mewtwo-mega-y" },
  { speciesId: 181, form: "mega", regionCode: "M", name: "Ampharos (Mega)", formSlug: "ampharos-mega", pokemonSlug: "ampharos-mega" },
  { speciesId: 208, form: "mega", regionCode: "M", name: "Steelix (Mega)", formSlug: "steelix-mega", pokemonSlug: "steelix-mega" },
  { speciesId: 212, form: "mega", regionCode: "M", name: "Scizor (Mega)", formSlug: "scizor-mega", pokemonSlug: "scizor-mega" },
  { speciesId: 214, form: "mega", regionCode: "M", name: "Heracross (Mega)", formSlug: "heracross-mega", pokemonSlug: "heracross-mega" },
  { speciesId: 229, form: "mega", regionCode: "M", name: "Houndoom (Mega)", formSlug: "houndoom-mega", pokemonSlug: "houndoom-mega" },
  { speciesId: 248, form: "mega", regionCode: "M", name: "Tyranitar (Mega)", formSlug: "tyranitar-mega", pokemonSlug: "tyranitar-mega" },
  { speciesId: 254, form: "mega", regionCode: "M", name: "Sceptile (Mega)", formSlug: "sceptile-mega", pokemonSlug: "sceptile-mega" },
  { speciesId: 257, form: "mega", regionCode: "M", name: "Blaziken (Mega)", formSlug: "blaziken-mega", pokemonSlug: "blaziken-mega" },
  { speciesId: 260, form: "mega", regionCode: "M", name: "Swampert (Mega)", formSlug: "swampert-mega", pokemonSlug: "swampert-mega" },
  { speciesId: 282, form: "mega", regionCode: "M", name: "Gardevoir (Mega)", formSlug: "gardevoir-mega", pokemonSlug: "gardevoir-mega" },
  { speciesId: 302, form: "mega", regionCode: "M", name: "Sableye (Mega)", formSlug: "sableye-mega", pokemonSlug: "sableye-mega" },
  { speciesId: 303, form: "mega", regionCode: "M", name: "Mawile (Mega)", formSlug: "mawile-mega", pokemonSlug: "mawile-mega" },
  { speciesId: 306, form: "mega", regionCode: "M", name: "Aggron (Mega)", formSlug: "aggron-mega", pokemonSlug: "aggron-mega" },
  { speciesId: 308, form: "mega", regionCode: "M", name: "Medicham (Mega)", formSlug: "medicham-mega", pokemonSlug: "medicham-mega" },
  { speciesId: 310, form: "mega", regionCode: "M", name: "Manectric (Mega)", formSlug: "manectric-mega", pokemonSlug: "manectric-mega" },
  { speciesId: 319, form: "mega", regionCode: "M", name: "Sharpedo (Mega)", formSlug: "sharpedo-mega", pokemonSlug: "sharpedo-mega" },
  { speciesId: 323, form: "mega", regionCode: "M", name: "Camerupt (Mega)", formSlug: "camerupt-mega", pokemonSlug: "camerupt-mega" },
  { speciesId: 334, form: "mega", regionCode: "M", name: "Altaria (Mega)", formSlug: "altaria-mega", pokemonSlug: "altaria-mega" },
  { speciesId: 354, form: "mega", regionCode: "M", name: "Banette (Mega)", formSlug: "banette-mega", pokemonSlug: "banette-mega" },
  { speciesId: 359, form: "mega", regionCode: "M", name: "Absol (Mega)", formSlug: "absol-mega", pokemonSlug: "absol-mega" },
  { speciesId: 362, form: "mega", regionCode: "M", name: "Glalie (Mega)", formSlug: "glalie-mega", pokemonSlug: "glalie-mega" },
  { speciesId: 373, form: "mega", regionCode: "M", name: "Salamence (Mega)", formSlug: "salamence-mega", pokemonSlug: "salamence-mega" },
  { speciesId: 376, form: "mega", regionCode: "M", name: "Metagross (Mega)", formSlug: "metagross-mega", pokemonSlug: "metagross-mega" },
  { speciesId: 380, form: "mega", regionCode: "M", name: "Latias (Mega)", formSlug: "latias-mega", pokemonSlug: "latias-mega" },
  { speciesId: 381, form: "mega", regionCode: "M", name: "Latios (Mega)", formSlug: "latios-mega", pokemonSlug: "latios-mega" },
  { speciesId: 384, form: "mega", regionCode: "M", name: "Rayquaza (Mega)", formSlug: "rayquaza-mega", pokemonSlug: "rayquaza-mega" },
  { speciesId: 428, form: "mega", regionCode: "M", name: "Lopunny (Mega)", formSlug: "lopunny-mega", pokemonSlug: "lopunny-mega" },
  { speciesId: 445, form: "mega", regionCode: "M", name: "Garchomp (Mega)", formSlug: "garchomp-mega", pokemonSlug: "garchomp-mega" },
  { speciesId: 448, form: "mega", regionCode: "M", name: "Lucario (Mega)", formSlug: "lucario-mega", pokemonSlug: "lucario-mega" },
  { speciesId: 460, form: "mega", regionCode: "M", name: "Abomasnow (Mega)", formSlug: "abomasnow-mega", pokemonSlug: "abomasnow-mega" },
  { speciesId: 475, form: "mega", regionCode: "M", name: "Gallade (Mega)", formSlug: "gallade-mega", pokemonSlug: "gallade-mega" },
  { speciesId: 531, form: "mega", regionCode: "M", name: "Audino (Mega)", formSlug: "audino-mega", pokemonSlug: "audino-mega" },
  { speciesId: 719, form: "mega", regionCode: "M", name: "Diancie (Mega)", formSlug: "diancie-mega", pokemonSlug: "diancie-mega" },
];

const GMAX_FORMS = [
  { speciesId: 3, form: "gmax", regionCode: "GM", name: "Venusaur (Gigantamax)", formSlug: "venusaur-gmax", pokemonSlug: "venusaur-gmax" },
  { speciesId: 6, form: "gmax", regionCode: "GM", name: "Charizard (Gigantamax)", formSlug: "charizard-gmax", pokemonSlug: "charizard-gmax" },
  { speciesId: 9, form: "gmax", regionCode: "GM", name: "Blastoise (Gigantamax)", formSlug: "blastoise-gmax", pokemonSlug: "blastoise-gmax" },
  { speciesId: 12, form: "gmax", regionCode: "GM", name: "Butterfree (Gigantamax)", formSlug: "butterfree-gmax", pokemonSlug: "butterfree-gmax" },
  { speciesId: 25, form: "gmax", regionCode: "GM", name: "Pikachu (Gigantamax)", formSlug: "pikachu-gmax", pokemonSlug: "pikachu-gmax" },
  { speciesId: 52, form: "gmax", regionCode: "GM", name: "Meowth (Gigantamax)", formSlug: "meowth-gmax", pokemonSlug: "meowth-gmax" },
  { speciesId: 68, form: "gmax", regionCode: "GM", name: "Machamp (Gigantamax)", formSlug: "machamp-gmax", pokemonSlug: "machamp-gmax" },
  { speciesId: 94, form: "gmax", regionCode: "GM", name: "Gengar (Gigantamax)", formSlug: "gengar-gmax", pokemonSlug: "gengar-gmax" },
  { speciesId: 99, form: "gmax", regionCode: "GM", name: "Kingler (Gigantamax)", formSlug: "kingler-gmax", pokemonSlug: "kingler-gmax" },
  { speciesId: 131, form: "gmax", regionCode: "GM", name: "Lapras (Gigantamax)", formSlug: "lapras-gmax", pokemonSlug: "lapras-gmax" },
  { speciesId: 133, form: "gmax", regionCode: "GM", name: "Eevee (Gigantamax)", formSlug: "eevee-gmax", pokemonSlug: "eevee-gmax" },
  { speciesId: 143, form: "gmax", regionCode: "GM", name: "Snorlax (Gigantamax)", formSlug: "snorlax-gmax", pokemonSlug: "snorlax-gmax" },
  { speciesId: 569, form: "gmax", regionCode: "GM", name: "Garbodor (Gigantamax)", formSlug: "garbodor-gmax", pokemonSlug: "garbodor-gmax" },
  { speciesId: 809, form: "gmax", regionCode: "GM", name: "Melmetal (Gigantamax)", formSlug: "melmetal-gmax", pokemonSlug: "melmetal-gmax" },
  { speciesId: 812, form: "gmax", regionCode: "GM", name: "Rillaboom (Gigantamax)", formSlug: "rillaboom-gmax", pokemonSlug: "rillaboom-gmax" },
  { speciesId: 815, form: "gmax", regionCode: "GM", name: "Cinderace (Gigantamax)", formSlug: "cinderace-gmax", pokemonSlug: "cinderace-gmax" },
  { speciesId: 818, form: "gmax", regionCode: "GM", name: "Inteleon (Gigantamax)", formSlug: "inteleon-gmax", pokemonSlug: "inteleon-gmax" },
  { speciesId: 823, form: "gmax", regionCode: "GM", name: "Corviknight (Gigantamax)", formSlug: "corviknight-gmax", pokemonSlug: "corviknight-gmax" },
  { speciesId: 826, form: "gmax", regionCode: "GM", name: "Orbeetle (Gigantamax)", formSlug: "orbeetle-gmax", pokemonSlug: "orbeetle-gmax" },
  { speciesId: 833, form: "gmax", regionCode: "GM", name: "Drednaw (Gigantamax)", formSlug: "drednaw-gmax", pokemonSlug: "drednaw-gmax" },
  { speciesId: 839, form: "gmax", regionCode: "GM", name: "Coalossal (Gigantamax)", formSlug: "coalossal-gmax", pokemonSlug: "coalossal-gmax" },
  { speciesId: 841, form: "gmax", regionCode: "GM", name: "Flapple (Gigantamax)", formSlug: "flapple-gmax", pokemonSlug: "flapple-gmax" },
  { speciesId: 842, form: "gmax", regionCode: "GM", name: "Appletun (Gigantamax)", formSlug: "appletun-gmax", pokemonSlug: "appletun-gmax" },
  { speciesId: 844, form: "gmax", regionCode: "GM", name: "Sandaconda (Gigantamax)", formSlug: "sandaconda-gmax", pokemonSlug: "sandaconda-gmax" },
  { speciesId: 849, form: "gmax-amped", regionCode: "GM", name: "Toxtricity (Gigantamax Amped)", formSlug: "toxtricity-amped-gmax", pokemonSlug: "toxtricity-amped-gmax" },
  { speciesId: 849, form: "gmax-low-key", regionCode: "GM", name: "Toxtricity (Gigantamax Low Key)", formSlug: "toxtricity-low-key-gmax", pokemonSlug: "toxtricity-low-key-gmax" },
  { speciesId: 851, form: "gmax", regionCode: "GM", name: "Centiskorch (Gigantamax)", formSlug: "centiskorch-gmax", pokemonSlug: "centiskorch-gmax" },
  { speciesId: 858, form: "gmax", regionCode: "GM", name: "Hatterene (Gigantamax)", formSlug: "hatterene-gmax", pokemonSlug: "hatterene-gmax" },
  { speciesId: 861, form: "gmax", regionCode: "GM", name: "Grimmsnarl (Gigantamax)", formSlug: "grimmsnarl-gmax", pokemonSlug: "grimmsnarl-gmax" },
  { speciesId: 869, form: "gmax", regionCode: "GM", name: "Alcremie (Gigantamax)", formSlug: "alcremie-gmax", pokemonSlug: "alcremie-gmax" },
  { speciesId: 879, form: "gmax", regionCode: "GM", name: "Copperajah (Gigantamax)", formSlug: "copperajah-gmax", pokemonSlug: "copperajah-gmax" },
  { speciesId: 884, form: "gmax", regionCode: "GM", name: "Duraludon (Gigantamax)", formSlug: "duraludon-gmax", pokemonSlug: "duraludon-gmax" },
  { speciesId: 892, form: "gmax-single-strike", regionCode: "GM", name: "Urshifu (Gigantamax Single Strike)", formSlug: "urshifu-gmax", pokemonSlug: "urshifu-gmax" },
  { speciesId: 892, form: "gmax-rapid-strike", regionCode: "GM", name: "Urshifu (Gigantamax Rapid Strike)", formSlug: "urshifu-rapid-strike-gmax", pokemonSlug: "urshifu-rapid-strike-gmax" },
];

const ALL_VARIANTS = [
  ...REGIONAL_VARIANTS.map((variant) => ({ ...variant, category: "regional" })),
  ...MEGA_FORMS.map((variant) => ({ ...variant, category: "mega" })),
  ...GMAX_FORMS.map((variant) => ({ ...variant, category: "gmax" })),
];



const VARIANT_MAP = new Map(
  ALL_VARIANTS.map((variant) => [
    `${variant.speciesId}:${variant.form}`,
    {
      key: `${variant.speciesId}:${variant.form}`,
      regionCode: variant.regionCode,
      name: variant.name,
      sprite: variant.sprite || null,
      formSlug: variant.formSlug || null,
      pokemonSlug: variant.pokemonSlug || null,
      pokemonId: variant.pokemonId || null,
      category: variant.category || null,
    },
  ])
);

function groupVariantsBySpecies(variants) {
  const grouped = {};
  variants.forEach((variant) => {
    if (!variant || !variant.speciesId) return;
    const key = String(variant.speciesId);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push({
      speciesId: variant.speciesId,
      form: variant.form,
      name: variant.name,
      regionCode: variant.regionCode || null,
      formSlug: variant.formSlug || null,
      pokemonSlug: variant.pokemonSlug || null,
      pokemonId: variant.pokemonId || null,
      sprite: variant.sprite || null,
      category: variant.category || null,
    });
  });
  Object.values(grouped).forEach((entries) => {
    entries.sort((a, b) => {
      if (a.form && b.form && a.form !== b.form) {
        return a.form.localeCompare(b.form);
      }
      return a.name.localeCompare(b.name);
    });
  });
  return grouped;
}

async function preloadVariantSprites() {
  const variants = Array.from(VARIANT_MAP.entries());
  await Promise.all(
    variants.map(async ([, variant]) => {
      if (variant.sprite || !variant.formSlug) {
        return;
      }

      try {
        const data = await fetchJson(
          `${API_BASE_URL}/pokemon-form/${variant.formSlug}`
        );
        if (data?.pokemon?.url) {
          const pokemonId = parseIdFromUrl(data.pokemon.url);
          if (pokemonId && !variant.pokemonId) {
            variant.pokemonId = pokemonId;
          }
        }
        if (data?.pokemon?.name && !variant.pokemonSlug) {
          variant.pokemonSlug = data.pokemon.name;
        }
        const sprite =
          data.sprites?.front_default ||
          data.sprites?.front_shiny ||
          data.sprites?.back_default ||
          data.sprites?.other?.["official-artwork"]?.front_default ||
          data.sprites?.other?.home?.front_default ||
          null;
        if (sprite) {
          variant.sprite = sprite;
        } else if (variant.pokemonId) {
          variant.sprite = `${SPRITE_BASE_URL}/other/home/${variant.pokemonId}.png`;
        }
        if (!variant.sprite && variant.pokemonId) {
          variant.sprite = `${SPRITE_BASE_URL}/${variant.pokemonId}.png`;
        }
      } catch (error) {
        console.warn(
          `Kon sprite voor variant '${variant.formSlug}' niet laden:`,
          error
        );
      }
    })
  );

  ALL_VARIANTS.forEach((variant) => {
    const key = `${variant.speciesId}:${variant.form}`;
    const enriched = VARIANT_MAP.get(key);
    if (!enriched) {
      return;
    }
    if (enriched.key && !variant.key) {
      variant.key = enriched.key;
    }
    if (enriched.sprite && !variant.sprite) {
      variant.sprite = enriched.sprite;
    }
    if (enriched.pokemonId && !variant.pokemonId) {
      variant.pokemonId = enriched.pokemonId;
    }
    if (enriched.pokemonSlug && !variant.pokemonSlug) {
      variant.pokemonSlug = enriched.pokemonSlug;
    }
  });
}

const GAME_CONFIG = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    dexes: [
      {
        id: "paldea",
        name: "Paldea Pokédex",
        source: {
          type: "pokedex",
          slugs: ["paldea"],
          speciesOverrides: {
            128: {
              form: "paldea-combat",
              variantRegionCode: "P",
              nameOverride: "Tauros (Paldean)",
              pokemonId: 10263,
              pokemonSlug: "tauros-paldea-combat",
              spriteOverride: `${SPRITE_BASE_URL}/10263.png`,
            },
            194: { form: "paldea" },
          },
        },
      },
      {
        id: "kitakami",
        name: "Kitakami Pokédex",
        source: { type: "pokedex", slugs: ["kitakami", "teal-mask"] },
      },
      {
        id: "blueberry",
        name: "Blueberry Pokédex",
        source: {
          type: "pokedex",
          slugs: ["blueberry", "blueberry-academy", "indigo-disk"],
          entryOverrides: {
            4: { displayDexNumber: "004" },
            66: { variantRegionCode: "A" },
            67: { variantRegionCode: "A" },
            68: { variantRegionCode: "A" },
            69: { skip: true },
            75: { variantRegionCode: "G" },
            76: { variantRegionCode: "G" },
            77: { variantRegionCode: "G" },
            96: { variantRegionCode: "A" },
            97: { variantRegionCode: "A" },
            98: { variantRegionCode: "A" },
            146: { variantRegionCode: "H" },
            155: { variantRegionCode: "A" },
            156: { variantRegionCode: "A" },
            157: { variantRegionCode: "A" },
            158: { skip: true },
          },
          manualEntries: [
            {
              speciesId: 103,
              variantRegionCode: "A",
              displayDexNumber: "004*A",
              sortIndex: 4.1,
            },
            {
              speciesId: 89,
              variantRegionCode: "A",
              dexNumber: 69,
              sortIndex: 69,
            },
            {
              speciesId: 38,
              variantRegionCode: "A",
              dexNumber: 158,
              sortIndex: 158,
            },
          ],
        },
      },
      {
        id: "scarlet-violet-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 144 },
            { speciesId: 145 },
            { speciesId: 146 },
            { speciesId: 243 },
            { speciesId: 244 },
            { speciesId: 245 },
            { speciesId: 249 },
            { speciesId: 250 },
            { speciesId: 380 },
            { speciesId: 381 },
            { speciesId: 382 },
            { speciesId: 383 },
            { speciesId: 384 },
            { speciesId: 638 },
            { speciesId: 639 },
            { speciesId: 640 },
            { speciesId: 643 },
            { speciesId: 644 },
            { speciesId: 646 },
            { speciesId: 648 },
            { speciesId: 791 },
            { speciesId: 792 },
            { speciesId: 800 },
            { speciesId: 891 },
            { speciesId: 892 },
            { speciesId: 896 },
            { speciesId: 897 },
          ],
        },
      },
      {
        id: "scarlet-violet-alternate",
        name: "Alternate Forms",
        source: {
          type: "manual",
          entries: [
            {
              speciesId: 128,
              form: "paldea-blaze",
            },
            {
              speciesId: 128,
              form: "paldea-aqua",
            },
            { speciesId: 26, variantRegionCode: "A" },
            { speciesId: 52, variantRegionCode: "A" },
            { speciesId: 52, variantRegionCode: "G" },
            { speciesId: 53, variantRegionCode: "A" },
            { speciesId: 863 },
            { speciesId: 58, variantRegionCode: "H" },
            { speciesId: 59, variantRegionCode: "H" },
            { speciesId: 100, variantRegionCode: "H" },
            { speciesId: 101, variantRegionCode: "H" },
            { speciesId: 110, variantRegionCode: "G" },
            { speciesId: 144, variantRegionCode: "G" },
            { speciesId: 145, variantRegionCode: "G" },
            { speciesId: 146, variantRegionCode: "G" },
            { speciesId: 157, variantRegionCode: "H" },
            { speciesId: 503, variantRegionCode: "H" },
            { speciesId: 549, variantRegionCode: "H" },
            { speciesId: 570, variantRegionCode: "H" },
            { speciesId: 571, variantRegionCode: "H" },
            { speciesId: 628, variantRegionCode: "H" },
            { speciesId: 705, variantRegionCode: "H" },
            { speciesId: 706, variantRegionCode: "H" },
            { speciesId: 713, variantRegionCode: "H" },
            { speciesId: 724, variantRegionCode: "H" },
          ],
        },
      },
      {
        id: "scarlet-violet-all",
        name: "All Pokémon",
        source: {
          type: "aggregate",
          dexIds: [
            "paldea",
            "kitakami",
            "blueberry",
            "scarlet-violet-other",
            "scarlet-violet-alternate",
          ],
        },
      },
    ],
  },
  {
    id: "legends-arceus",
    name: "Legends Arceus",
    dexes: [
      {
        id: "hisui",
        name: "Hisui Pokédex",
        source: {
          type: "pokedex",
          slugs: ["hisui"],
          speciesOverrides: {
            58: { form: "hisui" },
            59: { form: "hisui" },
            100: { form: "hisui" },
            101: { form: "hisui" },
            211: { form: "hisui" },
            215: { form: "hisui" },
            157: { form: "hisui" },
            503: { form: "hisui" },
            549: { form: "hisui" },
            550: { form: "hisui" },
            570: { form: "hisui" },
            571: { form: "hisui" },
            628: { form: "hisui" },
            705: { form: "hisui" },
            706: { form: "hisui" },
            724: { form: "hisui" },
          },
        },
      },
    ],
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    dexes: [
      {
        id: "galar",
        name: "Galar Pokédex",
        source: {
          type: "pokedex",
          slugs: ["galar"],
          speciesOverrides: {
            52: { form: "galar" },
            83: { form: "galar" },
            77: { form: "galar" },
            78: { form: "galar" },
            79: { form: "galar" },
            80: { form: "galar" },
            110: { form: "galar" },
            122: { form: "galar" },
            199: { form: "galar" },
            222: { form: "galar" },
            263: { form: "galar" },
            264: { form: "galar" },
            554: { form: "galar" },
            555: { form: "galar-standard" },
            562: { form: "galar" },
            618: { form: "galar" },
          },
          entryOverrides: {
            353: { form: "galar-zen", displayDexNumber: "353*G" },
          },
        },
      },
      {
        id: "isle-of-armor",
        name: "Isle of Armor Pokédex",
        source: {
          type: "pokedex",
          slugs: ["isle-of-armor"],
          speciesOverrides: {
            52: { form: "galar" },
            83: { form: "galar" },
            263: { form: "galar" },
            264: { form: "galar" },
            618: { form: "galar" },
          },
          entryOverrides: {
            1: { variantRegionCode: "G" },
            2: { variantRegionCode: "G" },
            3: { variantRegionCode: "G" },
          },
        },
      },
      {
        id: "crown-tundra",
        name: "Crown Tundra Pokédex",
        source: {
          type: "pokedex",
          slugs: ["crown-tundra"],
          speciesOverrides: {
            144: { form: "galar" },
            145: { form: "galar" },
            146: { form: "galar" },
          },
        },
      },
      {
        id: "sword-shield-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 150 },
            { speciesId: 243 },
            { speciesId: 244 },
            { speciesId: 245 },
            { speciesId: 249 },
            { speciesId: 250 },
            { speciesId: 252 },
            { speciesId: 253 },
            { speciesId: 254 },
            { speciesId: 255 },
            { speciesId: 256 },
            { speciesId: 257 },
            { speciesId: 258 },
            { speciesId: 259 },
            { speciesId: 260 },
            { speciesId: 380 },
            { speciesId: 381 },
            { speciesId: 382 },
            { speciesId: 383 },
            { speciesId: 384 },
            { speciesId: 480 },
            { speciesId: 481 },
            { speciesId: 482 },
            { speciesId: 483 },
            { speciesId: 484 },
            { speciesId: 485 },
            { speciesId: 486 },
            { speciesId: 487 },
            { speciesId: 488 },
            { speciesId: 641 },
            { speciesId: 642 },
            { speciesId: 643 },
            { speciesId: 644 },
            { speciesId: 645 },
            { speciesId: 646 },
            { speciesId: 647 },
            { speciesId: 716 },
            { speciesId: 717 },
            { speciesId: 718 },
            { speciesId: 722 },
            { speciesId: 723 },
            { speciesId: 724 },
            { speciesId: 725 },
            { speciesId: 726 },
            { speciesId: 727 },
            { speciesId: 728 },
            { speciesId: 729 },
            { speciesId: 730 },
            { speciesId: 785 },
            { speciesId: 786 },
            { speciesId: 787 },
            { speciesId: 788 },
            { speciesId: 789 },
            { speciesId: 790 },
            { speciesId: 791 },
            { speciesId: 792 },
            { speciesId: 793 },
            { speciesId: 794 },
            { speciesId: 795 },
            { speciesId: 796 },
            { speciesId: 797 },
            { speciesId: 798 },
            { speciesId: 799 },
            { speciesId: 800 },
            { speciesId: 803 },
            { speciesId: 804 },
            { speciesId: 805 },
            { speciesId: 806 },
          ],
        },
      },
      {
        id: "sword-shield-alternate",
        name: "Alternate Forms",
        source: {
          type: "manual",
          entries: [
            {
              speciesId: 52,
              nameOverride: "Meowth (Kantonian)",
              catchKeyOverride: "52:kantonian",
            },
            {
              speciesId: 77,
              nameOverride: "Ponyta (Kantonian)",
              catchKeyOverride: "77:kantonian",
            },
            {
              speciesId: 78,
              nameOverride: "Rapidash (Kantonian)",
              catchKeyOverride: "78:kantonian",
            },
            {
              speciesId: 79,
              nameOverride: "Slowpoke (Kantonian)",
              catchKeyOverride: "79:kantonian",
            },
            {
              speciesId: 80,
              nameOverride: "Slowbro (Kantonian)",
              catchKeyOverride: "80:kantonian",
            },
            {
              speciesId: 199,
              nameOverride: "Slowking (Kantonian)",
              catchKeyOverride: "199:kantonian",
            },
            {
              speciesId: 83,
              nameOverride: "Farfetch'd (Kantonian)",
              catchKeyOverride: "83:kantonian",
            },
            {
              speciesId: 110,
              nameOverride: "Weezing (Kantonian)",
              catchKeyOverride: "110:kantonian",
            },
            {
              speciesId: 122,
              nameOverride: "Mr. Mime (Kantonian)",
              catchKeyOverride: "122:kantonian",
            },
            {
              speciesId: 144,
              nameOverride: "Articuno (Kantonian)",
              catchKeyOverride: "144:kantonian",
            },
            {
              speciesId: 145,
              nameOverride: "Zapdos (Kantonian)",
              catchKeyOverride: "145:kantonian",
            },
            {
              speciesId: 146,
              nameOverride: "Moltres (Kantonian)",
              catchKeyOverride: "146:kantonian",
            },
            {
              speciesId: 222,
              nameOverride: "Corsola (Kantonian)",
              catchKeyOverride: "222:kantonian",
            },
            {
              speciesId: 263,
              nameOverride: "Zigzagoon (Hoenn)",
              catchKeyOverride: "263:hoenn",
            },
            {
              speciesId: 264,
              nameOverride: "Linoone (Hoenn)",
              catchKeyOverride: "264:hoenn",
            },
            {
              speciesId: 554,
              nameOverride: "Darumaka (Unova)",
              catchKeyOverride: "554:unova",
            },
            {
              speciesId: 555,
              nameOverride: "Darmanitan (Unovan)",
              catchKeyOverride: "555:unova",
            },
            {
              speciesId: 562,
              nameOverride: "Yamask (Unovan)",
              catchKeyOverride: "562:unova",
            },
            {
              speciesId: 618,
              nameOverride: "Stunfisk (Unovan)",
              catchKeyOverride: "618:unova",
            },
          ],
        },
      },
      {
        id: "sword-shield-gmax",
        name: "Gigantamax Forms",
        source: { type: "gmax-forms" },
      },
      {
        id: "sword-shield-all",
        name: "All Pokémon",
        source: {
          type: "aggregate",
          dexIds: [
            "galar",
            "isle-of-armor",
            "crown-tundra",
            "sword-shield-other",
            "sword-shield-alternate",
            "sword-shield-gmax",
          ],
        },
      },
    ],
  },
  {
    id: "brilliant-diamond-pearl",
    name: "Brilliant Diamond & Shining Pearl",
    dexes: [
      {
        id: "national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 488 },
      },
      {
        id: "sinnoh",
        name: "Sinnoh Pokédex",
        source: {
          type: "pokedex",
          slugs: ["original-sinnoh", "extended-sinnoh"],
        },
      },
      {
        id: "bdsp-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 463 },
            { speciesId: 464 },
            { speciesId: 465 },
            { speciesId: 466 },
            { speciesId: 467 },
            { speciesId: 468 },
            { speciesId: 469 },
            { speciesId: 470 },
            { speciesId: 471 },
            { speciesId: 472 },
            { speciesId: 473 },
            { speciesId: 474 },
            { speciesId: 475 },
            { speciesId: 476 },
            { speciesId: 477 },
            { speciesId: 478 },
            { speciesId: 479 },
            { speciesId: 485 },
            { speciesId: 486 },
            { speciesId: 487 },
            { speciesId: 488 },
          ],
        },
      },
    ],
  },
  {
    id: "pokemon-home",
    name: "Pokémon HOME",
    dexes: [
      { id: "home", name: "HOME Pokédex", source: { type: "all" } },
      {
        id: "home-alternate",
        name: "Alternate Forms",
        source: { type: "regional-variants" },
      },
      {
        id: "home-mega",
        name: "Mega Evoluties",
        source: { type: "mega-forms" },
      },
      {
        id: "home-gmax",
        name: "Gigantamax Forms",
        source: { type: "gmax-forms" },
      },
    ],
  },
  {
    id: "lets-go",
    name: "Let's Go Pikachu & Eevee",
    dexes: [
      {
        id: "kanto-lgpe",
        name: "Kanto Pokédex",
        source: { type: "pokedex", slugs: ["letsgo-kanto", "kanto"] },
      },
      {
        id: "lgpe-regional",
        name: "Regional Variants",
        source: {
          type: "manual",
          entries: [
            { speciesId: 19, variantRegionCode: "A" },
            { speciesId: 20, variantRegionCode: "A" },
            { speciesId: 26, variantRegionCode: "A" },
            { speciesId: 27, variantRegionCode: "A" },
            { speciesId: 28, variantRegionCode: "A" },
            { speciesId: 37, variantRegionCode: "A" },
            { speciesId: 38, variantRegionCode: "A" },
            { speciesId: 50, variantRegionCode: "A" },
            { speciesId: 51, variantRegionCode: "A" },
            { speciesId: 52, variantRegionCode: "A" },
            { speciesId: 53, variantRegionCode: "A" },
            { speciesId: 74, variantRegionCode: "A" },
            { speciesId: 75, variantRegionCode: "A" },
            { speciesId: 76, variantRegionCode: "A" },
            { speciesId: 88, variantRegionCode: "A" },
            { speciesId: 89, variantRegionCode: "A" },
            { speciesId: 103, variantRegionCode: "A" },
            { speciesId: 105, variantRegionCode: "A" },
          ],
        },
      },
      {
        id: "lgpe-mega",
        name: "Mega Evoluties",
        source: {
          type: "mega-forms",
          includeSpecies: [3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150],
        },
      },
      {
        id: "lgpe-all",
        name: "All Pokémon",
        source: {
          type: "aggregate",
          dexIds: ["kanto-lgpe", "lgpe-regional", "lgpe-mega"],
        },
      },
    ],
  },
  {
    id: "sun-moon",
    name: "Sun & Moon",
    dexes: [
      {
        id: "alola",
        name: "Alola Pokédex",
        source: { type: "pokedex", slugs: ["original-alola", "alola"] },
      },
      {
        id: "sun-moon-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 802 },
      },
      {
        id: "sun-moon-mega",
        name: "Mega Evoluties",
        source: { type: "mega-forms" },
      },
    ],
  },
  {
    id: "ultra-sun-moon",
    name: "Ultra Sun & Ultra Moon",
    dexes: [
      {
        id: "alola-ultra",
        name: "Alola Pokédex (Ultra)",
        source: { type: "pokedex", slugs: ["ultra-alola", "updated-alola", "alola"] },
      },
      {
        id: "ultra-sun-moon-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 807 },
      },
      {
        id: "ultra-mega",
        name: "Mega Evoluties",
        source: { type: "mega-forms" },
      },
    ],
  },
  {
    id: "omega-ruby-alpha-sapphire",
    name: "Omega Ruby & Alpha Sapphire",
    dexes: [
      {
        id: "hoenn-oras",
        name: "Hoenn Pokédex",
        source: { type: "pokedex", slugs: ["updated-hoenn", "hoenn"] },
      },
      {
        id: "oras-mega",
        name: "Mega Evoluties",
        source: { type: "mega-forms" },
      },
      {
        id: "oras-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 721 },
      },
    ],
  },
  {
    id: "x-y",
    name: "X & Y",
    dexes: [
      {
        id: "kalos-central",
        name: "Kalos Central Pokédex",
        source: { type: "pokedex", slugs: ["kalos-central"] },
      },
      {
        id: "kalos-coastal",
        name: "Kalos Coastal Pokédex",
        source: { type: "pokedex", slugs: ["kalos-coastal"] },
      },
      {
        id: "kalos-mountain",
        name: "Kalos Mountain Pokédex",
        source: { type: "pokedex", slugs: ["kalos-mountain"] },
      },
      {
        id: "kalos-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 721 },
      },
      {
        id: "kalos-mega",
        name: "Mega Evoluties",
        source: { type: "mega-forms" },
      },
      {
        id: "kalos-all",
        name: "All Pokémon",
        source: {
          type: "aggregate",
          dexIds: ["kalos-central", "kalos-coastal", "kalos-mountain"],
        },
      },
    ],
  },
  {
    id: "black-white",
    name: "Black & White",
    dexes: [
      {
        id: "unova",
        name: "Unova Pokédex",
        source: { type: "pokedex", slugs: ["original-unova"] },
      },
      {
        id: "black-white-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 649 },
      },
    ],
  },
  {
    id: "black-2-white-2",
    name: "Black 2 & White 2",
    dexes: [
      {
        id: "unova-updated",
        name: "Unova Pokédex (B2W2)",
        source: { type: "pokedex", slugs: ["updated-unova", "original-unova"] },
      },
      {
        id: "black-2-white-2-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 649 },
      },
    ],
  },
  {
    id: "heartgold-soulsilver",
    name: "HeartGold & SoulSilver",
    dexes: [
      {
        id: "johto-hgss",
        name: "Johto Pokédex",
        source: { type: "pokedex", slugs: ["updated-johto", "original-johto"] },
      },
      {
        id: "heartgold-soulsilver-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 493 },
      },
    ],
  },
  {
    id: "diamond-pearl",
    name: "Diamond & Pearl",
    dexes: [
      {
        id: "sinnoh-dp",
        name: "Sinnoh Pokédex",
        source: { type: "pokedex", slugs: ["original-sinnoh"] },
      },
      {
        id: "diamond-pearl-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 493 },
      },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    dexes: [
      {
        id: "sinnoh-pt",
        name: "Sinnoh Pokédex (Platinum)",
        source: { type: "pokedex", slugs: ["extended-sinnoh", "original-sinnoh"] },
      },
      {
        id: "platinum-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 493 },
      },
    ],
  },
  {
    id: "emerald",
    name: "Emerald",
    dexes: [
      {
        id: "hoenn-emerald",
        name: "Hoenn Pokédex",
        source: { type: "pokedex", slugs: ["hoenn"] },
      },
      {
        id: "emerald-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 386 },
      },
    ],
  },
  {
    id: "ruby-sapphire",
    name: "Ruby & Sapphire",
    dexes: [
      {
        id: "hoenn-rs",
        name: "Hoenn Pokédex",
        source: { type: "pokedex", slugs: ["hoenn"] },
      },
      {
        id: "ruby-sapphire-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 386 },
      },
    ],
  },
  {
    id: "firered-leafgreen",
    name: "FireRed & LeafGreen",
    dexes: [
      {
        id: "kanto-frlg",
        name: "Kanto Pokédex",
        source: { type: "pokedex", slugs: ["updated-kanto", "kanto"] },
      },
      {
        id: "firered-leafgreen-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 386 },
      },
    ],
  },
  {
    id: "gold-silver-crystal",
    name: "Gold, Silver & Crystal",
    dexes: [
      {
        id: "johto-gsc",
        name: "Johto Pokédex",
        source: { type: "pokedex", slugs: ["original-johto"] },
      },
      {
        id: "gold-silver-crystal-national",
        name: "National Pokédex",
        source: { type: "all", maxSpeciesId: 251 },
      },
    ],
  },
  {
    id: "red-blue-yellow",
    name: "Red, Blue & Yellow",
    dexes: [
      {
        id: "kanto-rby",
        name: "Kanto Pokédex",
        source: { type: "pokedex", slugs: ["kanto"] },
      },
    ],
  },
];

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Aanvraag naar ${url} mislukte met status ${response.status}`);
  }
  return response.json();
}

function parseIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : null;
}

function capitalize(word) {
  if (!word) return "";
  return word[0].toUpperCase() + word.slice(1);
}

function formatSpeciesName(apiName) {
  if (NAME_OVERRIDES.has(apiName)) {
    return NAME_OVERRIDES.get(apiName);
  }

  return apiName
    .split("-")
    .map((segment) => capitalize(segment))
    .join(" ");
}

async function loadAllSpecies() {
  const species = [];
  const seen = new Set();
  let nextUrl = `${API_BASE_URL}/pokemon-species?limit=${MAX_SPECIES_ID}&offset=0`;

  while (nextUrl) {
    const data = await fetchJson(nextUrl);
    data.results.forEach((result) => {
      const id = parseIdFromUrl(result.url);
      if (!id || id > MAX_SPECIES_ID || seen.has(id)) {
        return;
      }
      seen.add(id);
      species.push({ id, name: formatSpeciesName(result.name) });
    });
    nextUrl = data.next;
  }

  species.sort((a, b) => a.id - b.id);
  return species;
}

function formatNumberValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) {
    const raw = value.toString();
    const minWidth = raw.length >= 3 ? raw.length : 3;
    return raw.padStart(minWidth, "0");
  }
  return String(value);
}

function formatNumberForDisplay(value, regionCode) {
  const base = formatNumberValue(value);
  if (!base) return "";
  if (!regionCode) return base;
  return base.includes("*") ? base : `${base}*${regionCode}`;
}

function getOverride(map, key) {
  if (!map) return null;
  if (map[key]) return map[key];
  if (map[String(key)]) return map[String(key)];
  return null;
}

function getVariantDefinition(speciesId, form) {
  if (!form) return null;
  return VARIANT_MAP.get(`${speciesId}:${form}`) || null;
}

function buildDexEntry(options, speciesById) {
  const {
    speciesId,
    dexNumber,
    form = null,
    displayDexNumber,
    nameOverride,
    spriteOverride,
    spriteSlugOverride,
    regionCodeOverride,
    catchKeyOverride,
    sortIndex,
    pokemonId,
    pokemonSlug,
  } = options;

  const species = speciesById.get(speciesId);
  if (!species) {
    console.warn(`Pokémon met id ${speciesId} ontbreekt in de species lijst.`);
    return null;
  }

  const variant = getVariantDefinition(speciesId, form);
  const regionCode = regionCodeOverride ?? variant?.regionCode ?? null;
  const dexNumberValue = displayDexNumber ?? dexNumber ?? null;
  const dexDisplay = formatNumberForDisplay(dexNumberValue, regionCode);
  const nationalDisplay = formatNumberForDisplay(speciesId, regionCode);
  const spriteSlug =
    spriteSlugOverride ||
    (variant?.pokemonId ? String(variant.pokemonId) : null) ||
    (pokemonId ? String(pokemonId) : null);
  const sprite =
    spriteOverride ||
    variant?.sprite ||
    (spriteSlug ? `${SPRITE_BASE_URL}/${spriteSlug}.png` : null);
  const key =
    catchKeyOverride ||
    variant?.key ||
    (form ? `${speciesId}:${form}` : String(speciesId));

  return {
    key,
    speciesId,
    dexNumber: dexNumberValue,
    form,
    sortIndex:
      sortIndex ??
      (typeof dexNumberValue === "number" && Number.isFinite(dexNumberValue)
        ? dexNumberValue
        : null),
    nationalDexNumber: speciesId,
    name: nameOverride || variant?.name || species.name,
    sprite,
    regionCode,
    variantCategory: variant?.category || null,
    variantFormSlug: variant?.formSlug || null,
    displayDexNumber: dexDisplay ? `#${dexDisplay}` : "",
    displayNationalNumber: nationalDisplay ? `#${nationalDisplay}` : "",
    displayNumber:
      dexDisplay && nationalDisplay
        ? `#${dexDisplay} (#${nationalDisplay})`
        : dexDisplay
        ? `#${dexDisplay}`
        : nationalDisplay
        ? `#${nationalDisplay}`
        : "",
    pokemonId,
    pokemonSlug,
  };
}

const pokedexCache = new Map();
const versionGroupCache = new Map();
const pokemonResourceCache = new Map();
const speciesResourceCache = new Map();
const evolutionChainCache = new Map();
const encounterCache = new Map();

async function fetchPokedexEntries(slugs) {
  for (const slug of slugs) {
    if (!slug) continue;
    try {
      if (!pokedexCache.has(slug)) {
        const data = await fetchJson(`${API_BASE_URL}/pokedex/${slug}`);
        const seen = new Set();
        const entries = data.pokemon_entries
          .map((entry) => ({
            speciesId: parseIdFromUrl(entry.pokemon_species.url),
            entryNumber: entry.entry_number,
          }))
          .filter(({ speciesId }) => {
            if (!speciesId || speciesId > MAX_SPECIES_ID || seen.has(speciesId)) {
              return false;
            }
            seen.add(speciesId);
            return true;
          });
        pokedexCache.set(slug, entries);
      }
      return pokedexCache.get(slug);
    } catch (error) {
      console.warn(`Kon Pokédex '${slug}' niet laden:`, error);
    }
  }

  throw new Error(`Geen Pokédex data gevonden voor slugs: ${slugs.join(", ")}`);
}

async function fetchVersionGroupSpecies(slugs = []) {
  const speciesSet = new Map();

  for (const slug of slugs) {
    if (!slug) continue;
    try {
      if (!versionGroupCache.has(slug)) {
        const data = await fetchJson(`${API_BASE_URL}/version-group/${slug}`);
        const speciesIds = data.pokemon_species
          .map((entry) => parseIdFromUrl(entry.url))
          .filter((id) => id && id <= MAX_SPECIES_ID);
        versionGroupCache.set(slug, speciesIds);
      }

      const cached = versionGroupCache.get(slug) || [];
      cached.forEach((id) => {
        if (!speciesSet.has(id)) {
          speciesSet.set(id, id);
        }
      });
    } catch (error) {
      console.warn(`Kon version group '${slug}' niet laden:`, error);
    }
  }

  return Array.from(speciesSet.keys());
}

function normalizeRegionCode(code) {
  if (!code && code !== 0) return null;
  return String(code).trim().toUpperCase() || null;
}

function findVariantByRegion(speciesId, regionCode) {
  const normalized = normalizeRegionCode(regionCode);
  if (!normalized) return null;
  return (
    ALL_VARIANTS.find(
      (variant) =>
        variant.category === "regional" &&
        variant.speciesId === speciesId &&
        normalizeRegionCode(variant.regionCode) === normalized
    ) || null
  );
}

function applyVariantRegion(speciesId, override = {}) {
  if (!override) return {};
  const result = { ...override };
  const variantRegion =
    result.variantRegionCode || result.variantRegion || null;
  if (variantRegion) {
    const variant = findVariantByRegion(speciesId, variantRegion);
    if (variant) {
      if (!result.form) {
        result.form = variant.form;
      }
      if (!result.regionCodeOverride && !result.regionCode) {
        result.regionCodeOverride = variant.regionCode;
      }
      if (!result.nameOverride && !result.name) {
        result.nameOverride = variant.name;
      }
      if (!result.spriteOverride && !result.sprite && variant.sprite) {
        result.spriteOverride = variant.sprite;
      }
      if (!result.spriteSlugOverride && !result.spriteSlug && variant.formSlug) {
        result.spriteSlugOverride = variant.formSlug;
      }
      if (!result.catchKeyOverride && !result.catchKey) {
        result.catchKeyOverride = variant.key;
      }
      if (!result.pokemonId && variant.pokemonId) {
        result.pokemonId = variant.pokemonId;
      }
      if (!result.pokemonSlug && variant.pokemonSlug) {
        result.pokemonSlug = variant.pokemonSlug;
      }
    }
    delete result.variantRegionCode;
    delete result.variantRegion;
  }
  return result;
}

function createEntryDefinition(speciesId, override = {}, fallbackDexNumber = null) {
  const resolved = applyVariantRegion(speciesId, override);
  const dexNumber =
    resolved.dexNumber ?? resolved.entryNumber ?? fallbackDexNumber ?? null;
  const nameOverride = resolved.nameOverride ?? resolved.name ?? null;
  const spriteOverride = resolved.spriteOverride ?? resolved.sprite ?? null;
  const spriteSlugOverride =
    resolved.spriteSlugOverride ?? resolved.spriteSlug ?? null;
  const regionCodeOverride =
    resolved.regionCodeOverride ?? resolved.regionCode ?? null;
  const catchKeyOverride =
    resolved.catchKeyOverride ?? resolved.catchKey ?? null;
  const pokemonId = resolved.pokemonId ?? null;
  const pokemonSlug = resolved.pokemonSlug ?? null;
  const sortIndex =
    resolved.sortIndex ??
    (typeof dexNumber === "number" && Number.isFinite(dexNumber)
      ? dexNumber
      : fallbackDexNumber);

  return {
    speciesId,
    dexNumber,
    displayDexNumber: resolved.displayDexNumber ?? null,
    form: resolved.form ?? null,
    nameOverride,
    spriteOverride,
    spriteSlugOverride,
    regionCodeOverride,
    catchKeyOverride,
    sortIndex,
    pokemonId,
    pokemonSlug,
  };
}

function mergeOverrides(baseOverride = {}, specificOverride = {}) {
  return { ...baseOverride, ...specificOverride };
}

function sortDexEntries(entries) {
  return entries.sort((a, b) => {
    const aIndex = a.sortIndex ?? Number.MAX_SAFE_INTEGER;
    const bIndex = b.sortIndex ?? Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return a.displayDexNumber.localeCompare(b.displayDexNumber, "en", {
      numeric: true,
      sensitivity: "base",
    });
  });
}

async function createDexEntries(source, speciesById, allSpecies, context = {}) {
  if (!source) return [];

  if (source.type === "all") {
    const minId = source.minSpeciesId ?? 1;
    const maxId = source.maxSpeciesId ?? MAX_SPECIES_ID;
    const filtered = allSpecies.filter(
      (entry) => entry.id >= minId && entry.id <= maxId
    );

    return filtered
      .map((entry, index) =>
        buildDexEntry(
          {
            speciesId: entry.id,
            dexNumber: index + 1,
            sortIndex: index + 1,
          },
          speciesById
        )
      )
      .filter(Boolean);
  }

  if (source.type === "pokedex") {
    const entries = await fetchPokedexEntries(source.slugs || []);
    const results = entries
      .map(({ speciesId, entryNumber }) => {
        const speciesOverride = getOverride(source.speciesOverrides, speciesId) || {};
        const entryOverride = getOverride(source.entryOverrides, entryNumber) || {};
        if (speciesOverride.skip || entryOverride.skip) {
          return null;
        }
        const override = mergeOverrides(speciesOverride, entryOverride);
        const definition = createEntryDefinition(
          speciesId,
          { ...override, dexNumber: override.dexNumber ?? entryNumber },
          entryNumber
        );
        return buildDexEntry(definition, speciesById);
      })
      .filter(Boolean);

    if (Array.isArray(source.manualEntries) && source.manualEntries.length) {
      const manual = source.manualEntries
        .map((entry, index) => {
          if (!entry) return null;
          let speciesId = entry.speciesId ?? entry.id ?? null;
          if (!speciesId && entry.referenceDexNumber !== undefined) {
            const reference = entries.find(
              (baseEntry) => baseEntry.entryNumber === entry.referenceDexNumber
            );
            if (reference) {
              speciesId = reference.speciesId;
            }
          }
          if (!speciesId) {
            console.warn(
              "Handmatige Pokédex-entry mist een geldige speciesId en wordt overgeslagen."
            );
            return null;
          }

          const fallbackNumber =
            entry.dexNumber ??
            entry.entryNumber ??
            entry.referenceDexNumber ??
            entries.length + index + 1;
          const override = { ...entry, dexNumber: fallbackNumber };
          delete override.referenceDexNumber;
          delete override.id;
          const definition = createEntryDefinition(
            speciesId,
            override,
            fallbackNumber
          );
          return buildDexEntry(definition, speciesById);
        })
        .filter(Boolean);
      results.push(...manual);
    }

    return sortDexEntries(results);
  }

  if (source.type === "aggregate") {
    const existingDexEntries = context.existingDexEntries || new Map();
    const includeDexIds = Array.isArray(source.dexIds) && source.dexIds.length
      ? source.dexIds
      : Array.from(existingDexEntries.keys());
    const seenKeys = new Set();
    const aggregated = [];

    includeDexIds.forEach((dexId, dexOrder) => {
      const entries = existingDexEntries.get(dexId) || [];
      entries.forEach((entry, entryIndex) => {
        if (!entry) return;
        const key = entry.key || `${entry.speciesId}:${entry.form ?? ""}`;
        if (seenKeys.has(key)) return;
        seenKeys.add(key);
        aggregated.push({ entry, dexOrder, entryIndex });
      });
    });

    return aggregated
      .map(({ entry }, index) => {
        const form =
          entry.form ??
          (entry.key && entry.key.includes(":")
            ? entry.key.split(":").slice(1).join(":")
            : null);
        const definition = createEntryDefinition(
          entry.speciesId,
          {
            form,
            nameOverride: entry.name,
            spriteOverride: entry.sprite,
            regionCodeOverride: entry.regionCode,
            catchKeyOverride: entry.key,
            pokemonId: entry.pokemonId,
            pokemonSlug: entry.pokemonSlug,
            dexNumber: index + 1,
            sortIndex: index + 1,
          },
          index + 1
        );
        return buildDexEntry(definition, speciesById);
      })
      .filter(Boolean);
  }

  if (source.type === "regional-variants") {
    const variants = ALL_VARIANTS.filter((variant) => variant.category === "regional")
      .slice()
      .sort((a, b) => {
        if (a.speciesId !== b.speciesId) {
          return a.speciesId - b.speciesId;
        }
        return a.form.localeCompare(b.form);
      });

    return variants
      .map((variant, index) => {
        const definition = createEntryDefinition(
          variant.speciesId,
          {
            form: variant.form,
            nameOverride: variant.name,
            spriteOverride: variant.sprite,
            spriteSlugOverride: variant.formSlug,
            regionCodeOverride: variant.regionCode,
            catchKeyOverride: variant.key,
            dexNumber: index + 1,
            sortIndex: index + 1,
          },
          index + 1
        );
        return buildDexEntry(definition, speciesById);
      })
      .filter(Boolean);
  }

  if (source.type === "mega-forms" || source.type === "gmax-forms") {
    const category = source.type === "mega-forms" ? "mega" : "gmax";
    const variants = ALL_VARIANTS.filter((variant) => variant.category === category);
    let filtered = variants.slice();

    if (Array.isArray(source.includeSpecies) && source.includeSpecies.length) {
      const includeSet = new Set(source.includeSpecies.map(Number));
      filtered = filtered.filter((variant) => includeSet.has(Number(variant.speciesId)));
    }

    if (Array.isArray(source.includeForms) && source.includeForms.length) {
      const includeForms = new Set(source.includeForms);
      filtered = filtered.filter((variant) => includeForms.has(variant.form));
    }

    if (Array.isArray(source.excludeSpecies) && source.excludeSpecies.length) {
      const excludeSet = new Set(source.excludeSpecies.map(Number));
      filtered = filtered.filter((variant) => !excludeSet.has(Number(variant.speciesId)));
    }

    if (Array.isArray(source.excludeForms) && source.excludeForms.length) {
      const excludeForms = new Set(source.excludeForms);
      filtered = filtered.filter((variant) => !excludeForms.has(variant.form));
    }

    filtered.sort((a, b) => {
      if (a.speciesId !== b.speciesId) {
        return a.speciesId - b.speciesId;
      }
      return a.form.localeCompare(b.form);
    });

    return filtered
      .map((variant, index) => {
        const definition = createEntryDefinition(
          variant.speciesId,
          {
            form: variant.form,
            nameOverride: variant.name,
            spriteOverride: variant.sprite,
            spriteSlugOverride: variant.formSlug,
            regionCodeOverride: variant.regionCode,
            catchKeyOverride: variant.key,
            dexNumber: index + 1,
            sortIndex: index + 1,
          },
          index + 1
        );
        return buildDexEntry(definition, speciesById);
      })
      .filter(Boolean);
  }

  if (source.type === "manual") {
    const entries = source.entries || [];
    return sortDexEntries(
      entries
        .map((entry, index) =>
          {
            if (!entry) return null;
            const speciesId = entry.speciesId ?? entry.id ?? null;
            if (!speciesId) {
              console.warn("Handmatige lijst-entry mist speciesId en wordt overgeslagen.");
              return null;
            }
            const fallbackNumber = entry.dexNumber ?? index + 1;
            const override = { ...entry, dexNumber: fallbackNumber };
            delete override.id;
            const definition = createEntryDefinition(
              speciesId,
              override,
              fallbackNumber
            );
            return buildDexEntry(definition, speciesById);
          }
        )
        .filter(Boolean)
    );
  }

  if (source.type === "other-available") {
    const existingDexEntries = context.existingDexEntries || new Map();
    const speciesMap = new Map();

    const versionGroupSpecies = await fetchVersionGroupSpecies(
      source.versionGroups || []
    );
    versionGroupSpecies.forEach((id) => {
      if (!id || id > MAX_SPECIES_ID) return;
      speciesMap.set(id, { speciesId: id });
    });

    if (Array.isArray(source.includePokedexSlugs)) {
      const extra = await fetchPokedexEntries(source.includePokedexSlugs);
      extra.forEach(({ speciesId }) => {
        if (!speciesId || speciesId > MAX_SPECIES_ID) return;
        speciesMap.set(speciesId, { speciesId });
      });
    }

    if (Array.isArray(source.ensureSpecies)) {
      source.ensureSpecies.forEach((entry) => {
        if (entry === null || entry === undefined) return;
        if (typeof entry === "number") {
          if (entry > 0 && entry <= MAX_SPECIES_ID) {
            speciesMap.set(entry, { speciesId: entry });
          }
          return;
        }
        const speciesId = entry.speciesId ?? entry.id;
        if (speciesId && speciesId <= MAX_SPECIES_ID) {
          speciesMap.set(speciesId, { speciesId });
        }
      });
    }

    const excludeSpeciesIds = new Set(source.excludeSpeciesIds || []);
    if (Array.isArray(source.excludeDexIds)) {
      source.excludeDexIds.forEach((dexId) => {
        const entries = existingDexEntries.get(dexId) || [];
        entries.forEach((entry) => {
          excludeSpeciesIds.add(entry.speciesId);
        });
      });
    }

    const removalKeys = new Set();
    if (Array.isArray(source.manualRemovals)) {
      source.manualRemovals.forEach((removal) => {
        if (!removal) return;
        const speciesId = removal.speciesId ?? removal.id;
        if (!speciesId) return;
        const formKey = removal.form ? `${speciesId}:${removal.form}` : `${speciesId}:*`;
        removalKeys.add(formKey);
      });
    }

    excludeSpeciesIds.forEach((speciesId) => {
      speciesMap.delete(speciesId);
    });

    const sortedSpecies = Array.from(speciesMap.keys()).sort((a, b) => a - b);
    const definitions = [];
    let autoIndex = 0;
    sortedSpecies.forEach((speciesId) => {
      const speciesOverride =
        getOverride(source.speciesOverrides, speciesId) || {};
      if (speciesOverride.skip) {
        return;
      }

      const form = speciesOverride.form ?? null;
      const hasRemoval =
        removalKeys.has(`${speciesId}:${form ?? ""}`) ||
        removalKeys.has(`${speciesId}:*`);
      if (hasRemoval) {
        return;
      }

      autoIndex += 1;
      const dexNumber = speciesOverride.dexNumber ?? autoIndex;
      const definition = createEntryDefinition(
        speciesId,
        { ...speciesOverride, form, dexNumber },
        dexNumber
      );
      definitions.push(definition);
    });

    const manualEntries = Array.isArray(source.manualEntries)
      ? source.manualEntries
      : [];
    const manualStartIndex = definitions.length + 1;
    manualEntries.forEach((entry, index) => {
      if (!entry) return;
      const speciesId = entry.speciesId ?? entry.id;
      if (!speciesId) return;
      const dexNumber = entry.dexNumber ?? manualStartIndex + index;
      const definition = createEntryDefinition(
        speciesId,
        { ...entry, dexNumber },
        dexNumber
      );
      definitions.push(definition);
    });

    return sortDexEntries(
      definitions
        .map((definition) => buildDexEntry(definition, speciesById))
        .filter(Boolean)
    );
  }

  return [];
}

function toTitleCase(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
}

function formatTypeLabel(type) {
  if (!type && type !== 0) return "";
  return toTitleCase(type);
}

function formatVersionName(version) {
  if (!version && version !== 0) return "";
  return toTitleCase(version);
}

async function fetchPokemonResource(identifier) {
  if (identifier === null || identifier === undefined) return null;
  const key = String(identifier).toLowerCase();
  if (pokemonResourceCache.has(key)) {
    return pokemonResourceCache.get(key);
  }
  try {
    const data = await fetchJson(`${API_BASE_URL}/pokemon/${key}`);
    pokemonResourceCache.set(key, data);
    return data;
  } catch (error) {
    console.warn(`Kon pokemon resource '${key}' niet laden:`, error);
    pokemonResourceCache.set(key, null);
    return null;
  }
}

async function fetchSpeciesResource(speciesId) {
  if (!speciesId) return null;
  const key = Number(speciesId);
  if (speciesResourceCache.has(key)) {
    return speciesResourceCache.get(key);
  }
  try {
    const data = await fetchJson(`${API_BASE_URL}/pokemon-species/${key}`);
    speciesResourceCache.set(key, data);
    return data;
  } catch (error) {
    console.warn(`Kon species resource '${key}' niet laden:`, error);
    speciesResourceCache.set(key, null);
    return null;
  }
}

async function fetchEvolutionChainData(url) {
  if (!url) return null;
  if (evolutionChainCache.has(url)) {
    return evolutionChainCache.get(url);
  }
  try {
    const data = await fetchJson(url);
    evolutionChainCache.set(url, data);
    return data;
  } catch (error) {
    console.warn(`Kon evolutieketen '${url}' niet laden:`, error);
    evolutionChainCache.set(url, null);
    return null;
  }
}

function describeEncounterDetail(detail) {
  if (!detail) return "Standaard";
  const parts = [];
  const methodName = detail.method?.name;
  if (methodName) {
    parts.push(toTitleCase(methodName));
  }
  if (detail.min_level && detail.max_level) {
    if (detail.min_level === detail.max_level) {
      parts.push(`Lv. ${detail.min_level}`);
    } else {
      parts.push(`Lv. ${detail.min_level}-${detail.max_level}`);
    }
  } else if (detail.min_level) {
    parts.push(`Lv. ${detail.min_level}`);
  }
  if (Array.isArray(detail.condition_values) && detail.condition_values.length) {
    parts.push(
      detail.condition_values
        .map((entry) => toTitleCase(entry.name))
        .join(", ")
    );
  }
  if (detail.time_of_day) {
    parts.push(toTitleCase(detail.time_of_day));
  }
  if (detail.needs_overworld_rain) {
    parts.push("Regen");
  }
  if (detail.turn_upside_down) {
    parts.push("Keer console om");
  }
  if (detail.relative_physical_stats !== null && detail.relative_physical_stats !== undefined) {
    const value = Number(detail.relative_physical_stats);
    if (value > 0) parts.push("Aanval > Verdediging");
    if (value === 0) parts.push("Aanval = Verdediging");
    if (value < 0) parts.push("Aanval < Verdediging");
  }
  if (detail.party_type) {
    parts.push(`Partijtype: ${formatTypeLabel(detail.party_type.name)}`);
  }
  if (detail.party_species) {
    parts.push(`Partij Pokémon: ${formatSpeciesName(detail.party_species.name)}`);
  }
  if (detail.held_item) {
    parts.push(`Houd ${toTitleCase(detail.held_item.name)}`);
  }
  if (detail.item) {
    parts.push(`Gebruik ${toTitleCase(detail.item.name)}`);
  }
  if (detail.known_move) {
    parts.push(`Kent ${toTitleCase(detail.known_move.name)}`);
  }
  if (detail.known_move_type) {
    parts.push(`Met type ${formatTypeLabel(detail.known_move_type.name)}`);
  }
  if (detail.location) {
    parts.push(`Bij ${toTitleCase(detail.location.name)}`);
  }
  if (detail.gender === 1) {
    parts.push("Vrouwelijk");
  } else if (detail.gender === 2) {
    parts.push("Mannelijk");
  }
  return parts.join(" • ") || "Standaard";
}

async function fetchEncounterData(url) {
  if (!url) return [];
  if (encounterCache.has(url)) {
    return encounterCache.get(url);
  }
  try {
    const data = await fetchJson(url);
    const versionMap = new Map();
    (Array.isArray(data) ? data : []).forEach((entry) => {
      const locationName = entry.location_area?.name || "onbekend";
      (entry.version_details || []).forEach((detail) => {
        const version = detail.version?.name;
        if (!version) return;
        if (!versionMap.has(version)) {
          versionMap.set(version, new Map());
        }
        const locationMap = versionMap.get(version);
        if (!locationMap.has(locationName)) {
          locationMap.set(locationName, []);
        }
        const methods = locationMap.get(locationName);
        if (Array.isArray(detail.encounter_details) && detail.encounter_details.length) {
          detail.encounter_details.forEach((encDetail) => {
            const description = describeEncounterDetail(encDetail);
            if (description && !methods.includes(description)) {
              methods.push(description);
            }
          });
        } else if (!methods.length) {
          methods.push("Standaard");
        }
      });
    });

    const formatted = Array.from(versionMap.entries())
      .map(([version, locations]) => ({
        version,
        versionName: formatVersionName(version),
        locations: Array.from(locations.entries()).map(([name, methods]) => ({
          name,
          methods,
        })),
      }))
      .sort((a, b) => a.versionName.localeCompare(b.versionName, "nl", { sensitivity: "base" }));

    encounterCache.set(url, formatted);
    return formatted;
  } catch (error) {
    console.warn(`Kon encounters van '${url}' niet laden:`, error);
    encounterCache.set(url, []);
    return [];
  }
}

function extractTypesFromPokemon(pokemonData) {
  if (!pokemonData?.types) return [];
  return pokemonData.types
    .slice()
    .sort((a, b) => (a.slot || 0) - (b.slot || 0))
    .map((entry) => ({
      slug: entry.type?.name || "",
      name: formatTypeLabel(entry.type?.name || ""),
    }))
    .filter((type) => type.slug);
}

function describeEvolutionDetail(detail) {
  if (!detail) return "Speciale methode";
  const parts = [];
  const trigger = detail.trigger?.name || "";
  if (trigger === "level-up") {
    if (detail.min_level) {
      parts.push(`Bereik level ${detail.min_level}`);
    } else {
      parts.push("Level omhoog");
    }
  } else if (trigger === "trade") {
    parts.push("Ruil");
  } else if (trigger === "use-item" && detail.item) {
    parts.push(`Gebruik ${toTitleCase(detail.item.name)}`);
  } else if (trigger) {
    parts.push(toTitleCase(trigger));
  }

  if (detail.held_item) {
    parts.push(`Houd ${toTitleCase(detail.held_item.name)}`);
  }
  if (detail.location) {
    parts.push(`Bij ${toTitleCase(detail.location.name)}`);
  }
  if (detail.time_of_day) {
    parts.push(toTitleCase(detail.time_of_day));
  }
  if (detail.min_happiness) {
    parts.push(`Vriendschap ${detail.min_happiness}+`);
  }
  if (detail.min_affection) {
    parts.push(`Genegenheid ${detail.min_affection}+`);
  }
  if (detail.min_beauty) {
    parts.push(`Schoonheid ${detail.min_beauty}+`);
  }
  if (detail.min_level && trigger !== "level-up") {
    parts.push(`Level ${detail.min_level}`);
  }
  if (detail.needs_overworld_rain) {
    parts.push("Regen");
  }
  if (detail.turn_upside_down) {
    parts.push("Keer console om");
  }
  if (detail.gender === 1) {
    parts.push("Vrouwelijk");
  } else if (detail.gender === 2) {
    parts.push("Mannelijk");
  }
  if (detail.relative_physical_stats !== null && detail.relative_physical_stats !== undefined) {
    const value = Number(detail.relative_physical_stats);
    if (value > 0) parts.push("Aanval > Verdediging");
    if (value === 0) parts.push("Aanval = Verdediging");
    if (value < 0) parts.push("Aanval < Verdediging");
  }
  if (detail.known_move) {
    parts.push(`Kent ${toTitleCase(detail.known_move.name)}`);
  }
  if (detail.known_move_type) {
    parts.push(`Met type ${formatTypeLabel(detail.known_move_type.name)}`);
  }
  if (detail.party_species) {
    parts.push(`Partij Pokémon: ${formatSpeciesName(detail.party_species.name)}`);
  }
  if (detail.party_type) {
    parts.push(`Partijtype: ${formatTypeLabel(detail.party_type.name)}`);
  }
  if (detail.trade_species) {
    parts.push(`Ruil met ${formatSpeciesName(detail.trade_species.name)}`);
  }
  return parts.join(" • ") || "Speciale methode";
}

function buildEvolutionSteps(chainData, targetSpeciesId) {
  if (!chainData?.chain) {
    return { steps: [] };
  }
  const steps = [];

  function traverse(node, parent) {
    if (!node || !node.species) return;
    const speciesId = parseIdFromUrl(node.species.url);
    const speciesName = formatSpeciesName(node.species.name);
    const currentNode = { speciesId, speciesName };

    if (parent) {
      const details = Array.isArray(node.evolution_details) && node.evolution_details.length
        ? node.evolution_details.map(describeEvolutionDetail)
        : ["Speciale methode"];
      steps.push({
        from: {
          id: parent.speciesId,
          name: parent.speciesName,
          isCurrent: parent.speciesId === targetSpeciesId,
        },
        to: {
          id: speciesId,
          name: speciesName,
          isCurrent: speciesId === targetSpeciesId,
        },
        methods: details,
      });
    }

    (node.evolves_to || []).forEach((child) => traverse(child, currentNode));
  }

  traverse(chainData.chain, null);
  return { steps };
}

function resolvePokemonIdentifierFromEntry(entry) {
  if (!entry) return null;
  if (entry.pokemonSlug) return entry.pokemonSlug;
  if (entry.pokemonId) return entry.pokemonId;
  const variant = getVariantDefinition(entry.speciesId, entry.form);
  if (variant?.pokemonSlug) return variant.pokemonSlug;
  if (variant?.pokemonId) return variant.pokemonId;
  return entry.speciesId;
}

async function getPokemonDetails(entry) {
  if (!entry) return null;
  const identifier = resolvePokemonIdentifierFromEntry(entry);
  const [pokemonData, speciesData] = await Promise.all([
    fetchPokemonResource(identifier),
    fetchSpeciesResource(entry.speciesId),
  ]);

  if (!pokemonData) {
    return null;
  }

  const types = extractTypesFromPokemon(pokemonData);
  const height = Number.isFinite(pokemonData.height) ? pokemonData.height : null;
  const weight = Number.isFinite(pokemonData.weight) ? pokemonData.weight : null;
  const sprites = {
    default: pokemonData.sprites?.front_default || null,
    artwork:
      pokemonData.sprites?.other?.["official-artwork"]?.front_default ||
      pokemonData.sprites?.other?.["official-artwork"]?.front_shiny ||
      null,
    home:
      pokemonData.sprites?.other?.home?.front_default ||
      pokemonData.sprites?.other?.home?.front_shiny ||
      null,
  };

  const encounterUrl = pokemonData.location_area_encounters || null;
  const encounters = encounterUrl ? await fetchEncounterData(encounterUrl) : [];

  let evolution = { steps: [] };
  if (speciesData?.evolution_chain?.url) {
    const chainData = await fetchEvolutionChainData(speciesData.evolution_chain.url);
    evolution = buildEvolutionSteps(chainData, entry.speciesId);
  }

  return {
    key: entry.key || `${entry.speciesId}`,
    speciesId: entry.speciesId,
    name: entry.name,
    types,
    sprites,
    height,
    weight,
    encounters,
    evolution,
  };
}



async function loadPokedexData() {
  await preloadVariantSprites();
  const species = await loadAllSpecies();
  const speciesById = new Map(species.map((entry) => [entry.id, entry]));

  const games = [];
  for (const game of GAME_CONFIG) {
    const dexes = [];
    const existingDexEntries = new Map();
    for (const dex of game.dexes) {
      const entries = await createDexEntries(
        dex.source,
        speciesById,
        species,
        {
          gameId: game.id,
          existingDexEntries,
        }
      );
      dexes.push({ id: dex.id, name: dex.name, entries });
      existingDexEntries.set(dex.id, entries);
    }
    games.push({ id: game.id, name: game.name, dexes });
  }

  const megaFormsBySpecies = groupVariantsBySpecies(
    ALL_VARIANTS.filter((variant) => variant.category === "mega")
  );
  const gmaxFormsBySpecies = groupVariantsBySpecies(
    ALL_VARIANTS.filter((variant) => variant.category === "gmax")
  );

  return {
    games,
    species,
    sprites: {
      default: (id) => `${SPRITE_BASE_URL}/${id}.png`,
      artwork: (id) => `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`,
    },
    variants: {
      mega: megaFormsBySpecies,
      gmax: gmaxFormsBySpecies,
      all: ALL_VARIANTS.map((variant) => ({
        speciesId: variant.speciesId,
        form: variant.form,
        name: variant.name,
        regionCode: variant.regionCode || null,
        formSlug: variant.formSlug || null,
        pokemonSlug: variant.pokemonSlug || null,
        pokemonId: variant.pokemonId || null,
        sprite: variant.sprite || null,
        category: variant.category || null,
      })),
    },
  };
}

const pokedexDataPromise = loadPokedexData()
  .then((data) => {
    window.POKEDEX_DATA = data;
    return data;
  })
  .catch((error) => {
    window.POKEDEX_DATA_ERROR = error;
    throw error;
  });

window.POKEDEX_DATA_PROMISE = pokedexDataPromise;
window.getPokemonDetails = getPokemonDetails;
