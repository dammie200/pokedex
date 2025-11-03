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
  { speciesId: 110, form: "galar", regionCode: "G", name: "Weezing (Galarian)", formSlug: "weezing-galar" },
  { speciesId: 122, form: "galar", regionCode: "G", name: "Mr. Mime (Galarian)", formSlug: "mr-mime-galar" },
  { speciesId: 128, form: "paldea-combat", regionCode: "P", name: "Tauros (Paldean Combat)", formSlug: "tauros-paldea-combat" },
  { speciesId: 128, form: "paldea-blaze", regionCode: "P", name: "Tauros (Paldean Blaze)", formSlug: "tauros-paldea-blaze" },
  { speciesId: 128, form: "paldea-aqua", regionCode: "P", name: "Tauros (Paldean Aqua)", formSlug: "tauros-paldea-aqua" },
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
    name: "Darmanitan (Galarian Standard)",
    formSlug: "darmanitan-galar",
  },
  {
    speciesId: 555,
    form: "galar-zen",
    regionCode: "G",
    name: "Darmanitan (Galarian Zen)",
    formSlug: "darmanitan-galar-zen",
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

const VARIANT_MAP = new Map(
  REGIONAL_VARIANTS.map((variant) => [
    `${variant.speciesId}:${variant.form}`,
    {
      key: `${variant.speciesId}:${variant.form}`,
      regionCode: variant.regionCode,
      name: variant.name,
      sprite: variant.sprite || null,
      formSlug: variant.formSlug || null,
    },
  ])
);

async function preloadVariantSprites() {
  const variants = Array.from(VARIANT_MAP.values());
  await Promise.all(
    variants.map(async (variant) => {
      if (variant.sprite || !variant.formSlug) {
        return;
      }

      try {
        const data = await fetchJson(
          `${API_BASE_URL}/pokemon-form/${variant.formSlug}`
        );
        const sprite =
          data.sprites?.front_default ||
          data.sprites?.front_shiny ||
          data.sprites?.back_default ||
          data.sprites?.other?.["official-artwork"]?.front_default ||
          data.sprites?.other?.home?.front_default ||
          null;
        if (sprite) {
          variant.sprite = sprite;
        }
      } catch (error) {
        console.warn(
          `Kon sprite voor variant '${variant.formSlug}' niet laden:`,
          error
        );
      }
    })
  );
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
            128: { form: "paldea-combat" },
            194: { form: "paldea" },
          },
          entryOverrides: {
            223: { variantRegionCode: "P" },
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
            69: { displayDexNumber: "069*" },
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
            158: { displayDexNumber: "158*" },
          },
          manualEntries: [
            {
              referenceDexNumber: 4,
              variantRegionCode: "A",
              displayDexNumber: "004*A",
              sortIndex: 4.1,
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
            { speciesId: 128, form: "paldea-blaze" },
            { speciesId: 128, form: "paldea-aqua" },
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
            { speciesId: 52, variantRegionCode: "G" },
            { speciesId: 77, variantRegionCode: "G" },
            { speciesId: 78, variantRegionCode: "G" },
            { speciesId: 79, variantRegionCode: "G" },
            { speciesId: 80, variantRegionCode: "G" },
            { speciesId: 83, variantRegionCode: "G" },
            { speciesId: 110, variantRegionCode: "G" },
            { speciesId: 122, variantRegionCode: "G" },
            { speciesId: 144, variantRegionCode: "G" },
            { speciesId: 145, variantRegionCode: "G" },
            { speciesId: 146, variantRegionCode: "G" },
            { speciesId: 222, variantRegionCode: "G" },
            { speciesId: 263, variantRegionCode: "G" },
            { speciesId: 264, variantRegionCode: "G" },
            { speciesId: 554, variantRegionCode: "G" },
            { speciesId: 555, form: "galar-standard" },
            { speciesId: 562, variantRegionCode: "G" },
            { speciesId: 618, variantRegionCode: "G" },
          ],
        },
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
          ],
        },
      },
    ],
  },
  {
    id: "brilliant-diamond-pearl",
    name: "Brilliant Diamond & Shining Pearl",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
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
          type: "other-available",
          versionGroups: ["brilliant-diamond-and-shining-pearl"],
          excludeDexIds: ["sinnoh"],
          ensureSpecies: [151, 385, 489, 490, 491, 492, 493],
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
  const sprite =
    spriteOverride ||
    variant?.sprite ||
    (spriteSlugOverride ? `${SPRITE_BASE_URL}/${spriteSlugOverride}.png` : null);
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
  };
}

const pokedexCache = new Map();
const versionGroupCache = new Map();

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
    REGIONAL_VARIANTS.find(
      (variant) =>
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
    return allSpecies
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

    includeDexIds.forEach((dexId) => {
      const entries = existingDexEntries.get(dexId) || [];
      entries.forEach((entry) => {
        if (!entry) return;
        const key = entry.key || `${entry.speciesId}:${entry.form ?? ""}`;
        if (seenKeys.has(key)) return;
        seenKeys.add(key);
        aggregated.push(entry);
      });
    });

    aggregated.sort((a, b) => {
      const aIndex = a.sortIndex ??
        (typeof a.dexNumber === "number" && Number.isFinite(a.dexNumber)
          ? a.dexNumber
          : Number.MAX_SAFE_INTEGER);
      const bIndex = b.sortIndex ??
        (typeof b.dexNumber === "number" && Number.isFinite(b.dexNumber)
          ? b.dexNumber
          : Number.MAX_SAFE_INTEGER);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });

    return aggregated
      .map((entry, index) => {
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
    const variants = [...REGIONAL_VARIANTS].sort((a, b) => {
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

  return {
    games,
    species,
    sprites: {
      default: (id) => `${SPRITE_BASE_URL}/${id}.png`,
      artwork: (id) => `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`,
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
