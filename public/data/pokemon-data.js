const SPECIES = [
  { id: 1, name: "Bulbasaur" },
  { id: 2, name: "Ivysaur" },
  { id: 3, name: "Venusaur" },
  { id: 4, name: "Charmander" },
  { id: 5, name: "Charmeleon" },
  { id: 6, name: "Charizard" },
  { id: 7, name: "Squirtle" },
  { id: 8, name: "Wartortle" },
  { id: 9, name: "Blastoise" },
  { id: 10, name: "Caterpie" },
  { id: 11, name: "Metapod" },
  { id: 12, name: "Butterfree" },
  { id: 13, name: "Weedle" },
  { id: 14, name: "Kakuna" },
  { id: 15, name: "Beedrill" },
  { id: 16, name: "Pidgey" },
  { id: 17, name: "Pidgeotto" },
  { id: 18, name: "Pidgeot" },
  { id: 19, name: "Rattata" },
  { id: 20, name: "Raticate" },
  { id: 21, name: "Spearow" },
  { id: 22, name: "Fearow" },
  { id: 23, name: "Ekans" },
  { id: 24, name: "Arbok" },
  { id: 25, name: "Pikachu" },
  { id: 26, name: "Raichu" },
  { id: 27, name: "Sandshrew" },
  { id: 28, name: "Sandslash" },
  { id: 29, name: "Nidoran♀" },
  { id: 30, name: "Nidorina" },
  { id: 31, name: "Nidoqueen" },
  { id: 32, name: "Nidoran♂" },
  { id: 33, name: "Nidorino" },
  { id: 34, name: "Nidoking" },
  { id: 35, name: "Clefairy" },
  { id: 36, name: "Clefable" },
  { id: 37, name: "Vulpix" },
  { id: 38, name: "Ninetales" },
  { id: 39, name: "Jigglypuff" },
  { id: 40, name: "Wigglytuff" },
  { id: 41, name: "Zubat" },
  { id: 42, name: "Golbat" },
  { id: 43, name: "Oddish" },
  { id: 44, name: "Gloom" },
  { id: 45, name: "Vileplume" },
  { id: 46, name: "Paras" },
  { id: 47, name: "Parasect" },
  { id: 48, name: "Venonat" },
  { id: 49, name: "Venomoth" },
  { id: 50, name: "Diglett" },
  { id: 51, name: "Dugtrio" },
  { id: 52, name: "Meowth" },
  { id: 53, name: "Persian" },
  { id: 54, name: "Psyduck" },
  { id: 55, name: "Golduck" },
  { id: 56, name: "Mankey" },
  { id: 57, name: "Primeape" },
  { id: 58, name: "Growlithe" },
  { id: 59, name: "Arcanine" },
  { id: 60, name: "Poliwag" },
  { id: 61, name: "Poliwhirl" },
  { id: 62, name: "Poliwrath" },
  { id: 63, name: "Abra" },
  { id: 64, name: "Kadabra" },
  { id: 65, name: "Alakazam" },
  { id: 66, name: "Machop" },
  { id: 67, name: "Machoke" },
  { id: 68, name: "Machamp" },
  { id: 69, name: "Bellsprout" },
  { id: 70, name: "Weepinbell" },
  { id: 71, name: "Victreebel" },
  { id: 72, name: "Tentacool" },
  { id: 73, name: "Tentacruel" },
  { id: 74, name: "Geodude" },
  { id: 75, name: "Graveler" },
  { id: 76, name: "Golem" },
  { id: 77, name: "Ponyta" },
  { id: 78, name: "Rapidash" },
  { id: 79, name: "Slowpoke" },
  { id: 80, name: "Slowbro" },
  { id: 81, name: "Magnemite" },
  { id: 82, name: "Magneton" },
  { id: 83, name: "Farfetch'd" },
  { id: 84, name: "Doduo" },
  { id: 85, name: "Dodrio" },
  { id: 86, name: "Seel" },
  { id: 87, name: "Dewgong" },
  { id: 88, name: "Grimer" },
  { id: 89, name: "Muk" },
  { id: 90, name: "Shellder" },
  { id: 91, name: "Cloyster" },
  { id: 92, name: "Gastly" },
  { id: 93, name: "Haunter" },
  { id: 94, name: "Gengar" },
  { id: 95, name: "Onix" },
  { id: 96, name: "Drowzee" },
  { id: 97, name: "Hypno" },
  { id: 98, name: "Krabby" },
  { id: 99, name: "Kingler" },
  { id: 100, name: "Voltorb" },
  { id: 101, name: "Electrode" },
  { id: 102, name: "Exeggcute" },
  { id: 103, name: "Exeggutor" },
  { id: 104, name: "Cubone" },
  { id: 105, name: "Marowak" },
  { id: 106, name: "Hitmonlee" },
  { id: 107, name: "Hitmonchan" },
  { id: 108, name: "Lickitung" },
  { id: 109, name: "Koffing" },
  { id: 110, name: "Weezing" },
  { id: 111, name: "Rhyhorn" },
  { id: 112, name: "Rhydon" },
  { id: 113, name: "Chansey" },
  { id: 114, name: "Tangela" },
  { id: 115, name: "Kangaskhan" },
  { id: 116, name: "Horsea" },
  { id: 117, name: "Seadra" },
  { id: 118, name: "Goldeen" },
  { id: 119, name: "Seaking" },
  { id: 120, name: "Staryu" },
  { id: 121, name: "Starmie" },
  { id: 122, name: "Mr. Mime" },
  { id: 123, name: "Scyther" },
  { id: 124, name: "Jynx" },
  { id: 125, name: "Electabuzz" },
  { id: 126, name: "Magmar" },
  { id: 127, name: "Pinsir" },
  { id: 128, name: "Tauros" },
  { id: 129, name: "Magikarp" },
  { id: 130, name: "Gyarados" },
  { id: 131, name: "Lapras" },
  { id: 132, name: "Ditto" },
  { id: 133, name: "Eevee" },
  { id: 134, name: "Vaporeon" },
  { id: 135, name: "Jolteon" },
  { id: 136, name: "Flareon" },
  { id: 137, name: "Porygon" },
  { id: 138, name: "Omanyte" },
  { id: 139, name: "Omastar" },
  { id: 140, name: "Kabuto" },
  { id: 141, name: "Kabutops" },
  { id: 142, name: "Aerodactyl" },
  { id: 143, name: "Snorlax" },
  { id: 144, name: "Articuno" },
  { id: 145, name: "Zapdos" },
  { id: 146, name: "Moltres" },
  { id: 147, name: "Dratini" },
  { id: 148, name: "Dragonair" },
  { id: 149, name: "Dragonite" },
  { id: 150, name: "Mewtwo" },
  { id: 151, name: "Mew" },
  { id: 387, name: "Turtwig" },
  { id: 388, name: "Grotle" },
  { id: 389, name: "Torterra" },
  { id: 390, name: "Chimchar" },
  { id: 391, name: "Monferno" },
  { id: 392, name: "Infernape" },
  { id: 393, name: "Piplup" },
  { id: 394, name: "Prinplup" },
  { id: 395, name: "Empoleon" },
  { id: 396, name: "Starly" },
  { id: 397, name: "Staravia" },
  { id: 398, name: "Staraptor" },
  { id: 399, name: "Bidoof" },
  { id: 400, name: "Bibarel" },
  { id: 401, name: "Kricketot" },
  { id: 402, name: "Kricketune" },
  { id: 403, name: "Shinx" },
  { id: 404, name: "Luxio" },
  { id: 405, name: "Luxray" },
  { id: 810, name: "Grookey" },
  { id: 811, name: "Thwackey" },
  { id: 812, name: "Rillaboom" },
  { id: 813, name: "Scorbunny" },
  { id: 814, name: "Raboot" },
  { id: 815, name: "Cinderace" },
  { id: 816, name: "Sobble" },
  { id: 817, name: "Drizzile" },
  { id: 818, name: "Inteleon" },
  { id: 819, name: "Skwovet" },
  { id: 820, name: "Greedent" },
  { id: 821, name: "Rookidee" },
  { id: 822, name: "Corvisquire" },
  { id: 823, name: "Corviknight" },
  { id: 824, name: "Blipbug" },
  { id: 825, name: "Dottler" },
  { id: 826, name: "Orbeetle" },
  { id: 827, name: "Nickit" },
  { id: 828, name: "Thievul" },
  { id: 829, name: "Gossifleur" },
  { id: 830, name: "Eldegoss" },
  { id: 831, name: "Wooloo" },
  { id: 832, name: "Dubwool" },
  { id: 899, name: "Wyrdeer" },
  { id: 900, name: "Kleavor" },
  { id: 901, name: "Ursaluna" },
  { id: 902, name: "Basculegion" },
  { id: 903, name: "Sneasler" },
  { id: 904, name: "Overqwil" },
  { id: 905, name: "Enamorus" },
  { id: 906, name: "Sprigatito" },
  { id: 907, name: "Floragato" },
  { id: 908, name: "Meowscarada" },
  { id: 909, name: "Fuecoco" },
  { id: 910, name: "Crocalor" },
  { id: 911, name: "Skeledirge" },
  { id: 912, name: "Quaxly" },
  { id: 913, name: "Quaxwell" },
  { id: 914, name: "Quaquaval" },
  { id: 915, name: "Lechonk" },
  { id: 916, name: "Oinkologne" },
  { id: 917, name: "Tarountula" },
  { id: 918, name: "Spidops" },
  { id: 919, name: "Nymble" },
  { id: 920, name: "Lokix" },
  { id: 921, name: "Pawmi" },
  { id: 922, name: "Pawmo" },
  { id: 923, name: "Pawmot" },
  { id: 924, name: "Tandemaus" },
  { id: 925, name: "Maushold" },
  { id: 926, name: "Fidough" },
  { id: 927, name: "Dachsbun" },
  { id: 928, name: "Smoliv" },
  { id: 929, name: "Dolliv" },
  { id: 930, name: "Arboliva" },
  { id: 931, name: "Squawkabilly" },
  { id: 932, name: "Nacli" },
  { id: 933, name: "Naclstack" },
  { id: 934, name: "Garganacl" },
  { id: 1007, name: "Okidogi" },
  { id: 1008, name: "Munkidori" },
  { id: 1009, name: "Fezandipiti" },
  { id: 1010, name: "Ogerpon" },
  { id: 1011, name: "Dipplin" },
  { id: 1012, name: "Poltchageist" },
  { id: 1013, name: "Sinistcha" },
  { id: 1018, name: "Archaludon" },
  { id: 1019, name: "Hydrapple" },
  { id: 1020, name: "Gouging Fire" },
  { id: 1021, name: "Raging Bolt" },
  { id: 1022, name: "Iron Boulder" },
  { id: 1023, name: "Iron Crown" },
  { id: 1024, name: "Terapagos" },
  { id: 1025, name: "Pecharunt" }
];

const SPECIES_BY_ID = new Map(
  SPECIES.map((entry) => [entry.id, { ...entry }])
);

function createDex(ids) {
  return ids
    .map((id) => {
      const entry = SPECIES_BY_ID.get(id);
      if (!entry) {
        console.warn(`Pokémon met id ${id} ontbreekt in de dataset.`);
        return null;
      }
      return { ...entry };
    })
    .filter(Boolean);
}

const NATIONAL_DEX = createDex(
  Array.from(SPECIES_BY_ID.keys()).sort((a, b) => a - b)
);

const SINNOH_DEX = createDex([
  387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402,
  403, 404, 405
]);

const GALAR_DEX = createDex([
  810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825,
  826, 827, 828, 829, 830, 831, 832
]);

const HISUI_DEX = createDex([899, 900, 901, 902, 903, 904, 905]);

const PALDEA_DEX = createDex([
  906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921,
  922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934
]);

const KITAKAMI_DEX = createDex([1007, 1008, 1009, 1010, 1011, 1012, 1013]);

const BLUEBERRY_DEX = createDex([
  1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025
]);

const GAME_OPTIONS = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    dexes: [
      { id: "national", name: "National Pokédex", entries: NATIONAL_DEX },
      { id: "paldea", name: "Paldea Pokédex", entries: PALDEA_DEX },
      { id: "kitakami", name: "Kitakami Pokédex", entries: KITAKAMI_DEX },
      { id: "blueberry", name: "Blueberry Pokédex", entries: BLUEBERRY_DEX }
    ]
  },
  {
    id: "legends-arceus",
    name: "Legends Arceus",
    dexes: [
      { id: "national", name: "National Pokédex", entries: NATIONAL_DEX },
      { id: "hisui", name: "Hisui Pokédex", entries: HISUI_DEX }
    ]
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    dexes: [
      { id: "national", name: "National Pokédex", entries: NATIONAL_DEX },
      { id: "galar", name: "Galar Pokédex", entries: GALAR_DEX }
    ]
  },
  {
    id: "brilliant-diamond-pearl",
    name: "Brilliant Diamond & Shining Pearl",
    dexes: [
      { id: "national", name: "National Pokédex", entries: NATIONAL_DEX },
      { id: "sinnoh", name: "Sinnoh Pokédex", entries: SINNOH_DEX }
    ]
  }
];

const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

const POKEDEX_DATA = {
  games: GAME_OPTIONS,
  sprites: {
    default: (id) => `${SPRITE_BASE_URL}/${id}.png`,
    artwork: (id) => `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`
  }
};

window.POKEDEX_DATA = POKEDEX_DATA;
