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
  { speciesId: 19, form: "alola", regionCode: "A", name: "Rattata (Alolan)", spriteSlug: "rattata-alola" },
  { speciesId: 20, form: "alola", regionCode: "A", name: "Raticate (Alolan)", spriteSlug: "raticate-alola" },
  { speciesId: 26, form: "alola", regionCode: "A", name: "Raichu (Alolan)", spriteSlug: "raichu-alola" },
  { speciesId: 27, form: "alola", regionCode: "A", name: "Sandshrew (Alolan)", spriteSlug: "sandshrew-alola" },
  { speciesId: 28, form: "alola", regionCode: "A", name: "Sandslash (Alolan)", spriteSlug: "sandslash-alola" },
  { speciesId: 37, form: "alola", regionCode: "A", name: "Vulpix (Alolan)", spriteSlug: "vulpix-alola" },
  { speciesId: 38, form: "alola", regionCode: "A", name: "Ninetales (Alolan)", spriteSlug: "ninetales-alola" },
  { speciesId: 50, form: "alola", regionCode: "A", name: "Diglett (Alolan)", spriteSlug: "diglett-alola" },
  { speciesId: 51, form: "alola", regionCode: "A", name: "Dugtrio (Alolan)", spriteSlug: "dugtrio-alola" },
  { speciesId: 52, form: "alola", regionCode: "A", name: "Meowth (Alolan)", spriteSlug: "meowth-alola" },
  { speciesId: 52, form: "galar", regionCode: "G", name: "Meowth (Galarian)", spriteSlug: "meowth-galar" },
  { speciesId: 53, form: "alola", regionCode: "A", name: "Persian (Alolan)", spriteSlug: "persian-alola" },
  { speciesId: 83, form: "galar", regionCode: "G", name: "Farfetch'd (Galarian)", spriteSlug: "farfetchd-galar" },
  { speciesId: 58, form: "hisui", regionCode: "H", name: "Growlithe (Hisuian)", spriteSlug: "growlithe-hisui" },
  { speciesId: 59, form: "hisui", regionCode: "H", name: "Arcanine (Hisuian)", spriteSlug: "arcanine-hisui" },
  { speciesId: 74, form: "alola", regionCode: "A", name: "Geodude (Alolan)", spriteSlug: "geodude-alola" },
  { speciesId: 75, form: "alola", regionCode: "A", name: "Graveler (Alolan)", spriteSlug: "graveler-alola" },
  { speciesId: 76, form: "alola", regionCode: "A", name: "Golem (Alolan)", spriteSlug: "golem-alola" },
  { speciesId: 77, form: "galar", regionCode: "G", name: "Ponyta (Galarian)", spriteSlug: "ponyta-galar" },
  { speciesId: 78, form: "galar", regionCode: "G", name: "Rapidash (Galarian)", spriteSlug: "rapidash-galar" },
  { speciesId: 79, form: "galar", regionCode: "G", name: "Slowpoke (Galarian)", spriteSlug: "slowpoke-galar" },
  { speciesId: 80, form: "galar", regionCode: "G", name: "Slowbro (Galarian)", spriteSlug: "slowbro-galar" },
  { speciesId: 88, form: "alola", regionCode: "A", name: "Grimer (Alolan)", spriteSlug: "grimer-alola" },
  { speciesId: 89, form: "alola", regionCode: "A", name: "Muk (Alolan)", spriteSlug: "muk-alola" },
  { speciesId: 100, form: "hisui", regionCode: "H", name: "Voltorb (Hisuian)", spriteSlug: "voltorb-hisui" },
  { speciesId: 101, form: "hisui", regionCode: "H", name: "Electrode (Hisuian)", spriteSlug: "electrode-hisui" },
  { speciesId: 110, form: "galar", regionCode: "G", name: "Weezing (Galarian)", spriteSlug: "weezing-galar" },
  { speciesId: 122, form: "galar", regionCode: "G", name: "Mr. Mime (Galarian)", spriteSlug: "mr-mime-galar" },
  { speciesId: 128, form: "paldea-combat", regionCode: "P", name: "Tauros (Paldean Combat)", spriteSlug: "tauros-paldea-combat" },
  { speciesId: 128, form: "paldea-blaze", regionCode: "P", name: "Tauros (Paldean Blaze)", spriteSlug: "tauros-paldea-blaze" },
  { speciesId: 128, form: "paldea-aqua", regionCode: "P", name: "Tauros (Paldean Aqua)", spriteSlug: "tauros-paldea-aqua" },
  { speciesId: 144, form: "galar", regionCode: "G", name: "Articuno (Galarian)", spriteSlug: "articuno-galar" },
  { speciesId: 145, form: "galar", regionCode: "G", name: "Zapdos (Galarian)", spriteSlug: "zapdos-galar" },
  { speciesId: 146, form: "galar", regionCode: "G", name: "Moltres (Galarian)", spriteSlug: "moltres-galar" },
  { speciesId: 157, form: "hisui", regionCode: "H", name: "Typhlosion (Hisuian)", spriteSlug: "typhlosion-hisui" },
  { speciesId: 194, form: "paldea", regionCode: "P", name: "Wooper (Paldean)", spriteSlug: "wooper-paldea" },
  { speciesId: 199, form: "galar", regionCode: "G", name: "Slowking (Galarian)", spriteSlug: "slowking-galar" },
  { speciesId: 211, form: "hisui", regionCode: "H", name: "Qwilfish (Hisuian)", spriteSlug: "qwilfish-hisui" },
  { speciesId: 215, form: "hisui", regionCode: "H", name: "Sneasel (Hisuian)", spriteSlug: "sneasel-hisui" },
  { speciesId: 222, form: "galar", regionCode: "G", name: "Corsola (Galarian)", spriteSlug: "corsola-galar" },
  { speciesId: 263, form: "galar", regionCode: "G", name: "Zigzagoon (Galarian)", spriteSlug: "zigzagoon-galar" },
  { speciesId: 264, form: "galar", regionCode: "G", name: "Linoone (Galarian)", spriteSlug: "linoone-galar" },
  { speciesId: 503, form: "hisui", regionCode: "H", name: "Samurott (Hisuian)", spriteSlug: "samurott-hisui" },
  { speciesId: 549, form: "hisui", regionCode: "H", name: "Lilligant (Hisuian)", spriteSlug: "lilligant-hisui" },
  { speciesId: 550, form: "hisui", regionCode: "H", name: "Basculin (White-Striped)", spriteSlug: "basculin-white-striped" },
  { speciesId: 554, form: "galar", regionCode: "G", name: "Darumaka (Galarian)", spriteSlug: "darumaka-galar" },
  { speciesId: 555, form: "galar-standard", regionCode: "G", name: "Darmanitan (Galarian Standard)", spriteSlug: "darmanitan-galar-standard" },
  { speciesId: 555, form: "galar-zen", regionCode: "G", name: "Darmanitan (Galarian Zen)", spriteSlug: "darmanitan-galar-zen" },
  { speciesId: 562, form: "galar", regionCode: "G", name: "Yamask (Galarian)", spriteSlug: "yamask-galar" },
  { speciesId: 570, form: "hisui", regionCode: "H", name: "Zorua (Hisuian)", spriteSlug: "zorua-hisui" },
  { speciesId: 571, form: "hisui", regionCode: "H", name: "Zoroark (Hisuian)", spriteSlug: "zoroark-hisui" },
  { speciesId: 618, form: "galar", regionCode: "G", name: "Stunfisk (Galarian)", spriteSlug: "stunfisk-galar" },
  { speciesId: 628, form: "hisui", regionCode: "H", name: "Braviary (Hisuian)", spriteSlug: "braviary-hisui" },
  { speciesId: 705, form: "hisui", regionCode: "H", name: "Sliggoo (Hisuian)", spriteSlug: "sliggoo-hisui" },
  { speciesId: 706, form: "hisui", regionCode: "H", name: "Goodra (Hisuian)", spriteSlug: "goodra-hisui" },
  { speciesId: 713, form: "hisui", regionCode: "H", name: "Avalugg (Hisuian)", spriteSlug: "avalugg-hisui" },
  { speciesId: 724, form: "hisui", regionCode: "H", name: "Decidueye (Hisuian)", spriteSlug: "decidueye-hisui" },
  { speciesId: 905, form: "therian", regionCode: "H", name: "Enamorus (Therian)", spriteSlug: "enamorus-therian" },
  { speciesId: 1007, form: "bloodmoon", regionCode: "K", name: "Ursaluna (Bloodmoon)", spriteSlug: "ursaluna-bloodmoon" },
];

const VARIANT_MAP = new Map(
  REGIONAL_VARIANTS.map((variant) => [
    `${variant.speciesId}:${variant.form}`,
    {
      key: `${variant.speciesId}:${variant.form}`,
      regionCode: variant.regionCode,
      name: variant.name,
      sprite:
        variant.sprite ||
        `${SPRITE_BASE_URL}/${variant.spriteSlug || `${variant.speciesId}`}.png`,
      spriteSlug: variant.spriteSlug || null,
    },
  ])
);

const GAME_CONFIG = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
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
          manualEntries: [
            {
              speciesId: 128,
              form: "paldea-blaze",
              dexNumber: 217,
              displayDexNumber: "217*P",
              name: "Tauros (Paldean Blaze)",
              sortIndex: 217.1,
            },
            {
              speciesId: 128,
              form: "paldea-aqua",
              dexNumber: 218,
              displayDexNumber: "218*P",
              name: "Tauros (Paldean Aqua)",
              sortIndex: 218.1,
            },
          ],
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
        source: { type: "pokedex", slugs: ["blueberry", "blueberry-academy", "indigo-disk"] },
      },
      {
        id: "scarlet-violet-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 6, dexNumber: 1 },
            { speciesId: 150, dexNumber: 2 },
            { speciesId: 151, dexNumber: 3 },
            { speciesId: 808, dexNumber: 4 },
            { speciesId: 809, dexNumber: 5 },
            { speciesId: 1009, dexNumber: 6 },
            { speciesId: 1010, dexNumber: 7 },
            { speciesId: 1024, dexNumber: 8 },
            { speciesId: 1025, dexNumber: 9 },
          ],
        },
      },
    ],
  },
  {
    id: "legends-arceus",
    name: "Legends Arceus",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
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
      {
        id: "legends-arceus-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 144, form: "galar", dexNumber: 1 },
            { speciesId: 145, form: "galar", dexNumber: 2 },
            { speciesId: 146, form: "galar", dexNumber: 3 },
            { speciesId: 493, dexNumber: 4 },
          ],
        },
      },
    ],
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
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
            { speciesId: 1, dexNumber: 1 },
            { speciesId: 4, dexNumber: 2 },
            { speciesId: 7, dexNumber: 3 },
            { speciesId: 144, form: "galar", dexNumber: 4 },
            { speciesId: 145, form: "galar", dexNumber: 5 },
            { speciesId: 146, form: "galar", dexNumber: 6 },
            { speciesId: 150, dexNumber: 7 },
            { speciesId: 151, dexNumber: 8 },
            { speciesId: 251, dexNumber: 9 },
            { speciesId: 385, dexNumber: 10 },
            { speciesId: 489, dexNumber: 11 },
            { speciesId: 490, dexNumber: 12 },
            { speciesId: 491, dexNumber: 13 },
            { speciesId: 492, dexNumber: 14 },
            { speciesId: 493, dexNumber: 15 },
            { speciesId: 808, dexNumber: 16 },
            { speciesId: 809, dexNumber: 17 },
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
          type: "manual",
          entries: [
            { speciesId: 151, dexNumber: 1 },
            { speciesId: 251, dexNumber: 2 },
            { speciesId: 385, dexNumber: 3 },
            { speciesId: 489, dexNumber: 4 },
            { speciesId: 490, dexNumber: 5 },
            { speciesId: 491, dexNumber: 6 },
            { speciesId: 492, dexNumber: 7 },
            { speciesId: 493, dexNumber: 8 },
            { speciesId: 808, dexNumber: 9 },
            { speciesId: 809, dexNumber: 10 },
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
        id: "home-other",
        name: "Other Available Pokémon",
        source: {
          type: "manual",
          entries: [
            { speciesId: 808, dexNumber: 1 },
            { speciesId: 809, dexNumber: 2 },
          ],
        },
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
  const spriteSlug = spriteSlugOverride ?? variant?.spriteSlug ?? null;
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
    sortIndex: sortIndex ?? (typeof dexNumber === "number" ? dexNumber : null),
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

function mergeOverrides(baseOverride = {}, specificOverride = {}) {
  return { ...baseOverride, ...specificOverride };
}

async function createDexEntries(source, speciesById, allSpecies) {
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
        return buildDexEntry(
          {
            speciesId,
            dexNumber: override.dexNumber ?? entryNumber,
            form: override.form,
            displayDexNumber: override.displayDexNumber,
            nameOverride: override.name,
            spriteOverride: override.sprite,
            spriteSlugOverride: override.spriteSlug,
            regionCodeOverride: override.regionCode,
            catchKeyOverride: override.catchKey,
            sortIndex: override.sortIndex ?? entryNumber,
          },
          speciesById
        );
      })
      .filter(Boolean);

    if (Array.isArray(source.manualEntries) && source.manualEntries.length) {
      const manual = source.manualEntries
        .map((entry, index) =>
          buildDexEntry(
            {
              speciesId: entry.speciesId ?? entry.id,
              dexNumber: entry.dexNumber ?? entry.entryNumber ?? index + 1,
              displayDexNumber: entry.displayDexNumber,
              form: entry.form,
              nameOverride: entry.name,
              spriteOverride: entry.sprite,
              spriteSlugOverride: entry.spriteSlug,
              regionCodeOverride: entry.regionCode,
              catchKeyOverride: entry.catchKey,
              sortIndex:
                entry.sortIndex ??
                entry.dexNumber ??
                entry.entryNumber ??
                (entries.length + index + 1),
            },
            speciesById
          )
        )
        .filter(Boolean);
      results.push(...manual);
    }

    return results.sort((a, b) => {
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

  if (source.type === "manual") {
    const entries = source.entries || [];
    return entries
      .map((entry, index) =>
        buildDexEntry(
          {
            speciesId: entry.speciesId ?? entry.id,
            dexNumber: entry.dexNumber ?? index + 1,
            displayDexNumber: entry.displayDexNumber,
            form: entry.form,
            nameOverride: entry.name,
            spriteOverride: entry.sprite,
            spriteSlugOverride: entry.spriteSlug,
            regionCodeOverride: entry.regionCode,
            catchKeyOverride: entry.catchKey,
            sortIndex: entry.sortIndex ?? (entry.dexNumber ?? index + 1),
          },
          speciesById
        )
      )
      .filter(Boolean)
      .sort((a, b) => {
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

  return [];
}

async function loadPokedexData() {
  const species = await loadAllSpecies();
  const speciesById = new Map(species.map((entry) => [entry.id, entry]));

  const games = [];
  for (const game of GAME_CONFIG) {
    const dexes = [];
    for (const dex of game.dexes) {
      const entries = await createDexEntries(dex.source, speciesById, species);
      dexes.push({ id: dex.id, name: dex.name, entries });
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
