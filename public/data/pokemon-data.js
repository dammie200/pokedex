const MAX_SPECIES_ID = 1025;
const API_BASE_URL = "https://pokeapi.co/api/v2";

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
]);

const GAME_CONFIG = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
      { id: "paldea", name: "Paldea Pokédex", source: { type: "pokedex", slugs: ["paldea"] } },
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
    ],
  },
  {
    id: "legends-arceus",
    name: "Legends Arceus",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
      { id: "hisui", name: "Hisui Pokédex", source: { type: "pokedex", slugs: ["hisui"] } },
    ],
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    dexes: [
      { id: "national", name: "National Pokédex", source: { type: "all" } },
      { id: "galar", name: "Galar Pokédex", source: { type: "pokedex", slugs: ["galar"] } },
      {
        id: "isle-of-armor",
        name: "Isle of Armor Pokédex",
        source: { type: "pokedex", slugs: ["isle-of-armor"] },
      },
      {
        id: "crown-tundra",
        name: "Crown Tundra Pokédex",
        source: { type: "pokedex", slugs: ["crown-tundra"] },
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
        source: { type: "pokedex", slugs: ["original-sinnoh", "extended-sinnoh"] },
      },
    ],
  },
  {
    id: "pokemon-home",
    name: "Pokémon HOME",
    dexes: [
      { id: "home", name: "HOME Pokédex", source: { type: "all" } },
    ],
  },
];

const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

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

const pokedexCache = new Map();

async function fetchPokedexEntries(slugs) {
  for (const slug of slugs) {
    if (!slug) continue;
    try {
      if (!pokedexCache.has(slug)) {
        const data = await fetchJson(`${API_BASE_URL}/pokedex/${slug}`);
        const seen = new Set();
        const ids = data.pokemon_entries
          .map((entry) => parseIdFromUrl(entry.pokemon_species.url))
          .filter((id) => id && id <= MAX_SPECIES_ID && !seen.has(id))
          .map((id) => {
            seen.add(id);
            return id;
          });
        pokedexCache.set(slug, ids);
      }
      return pokedexCache.get(slug);
    } catch (error) {
      console.warn(`Kon Pokédex '${slug}' niet laden:`, error);
    }
  }

  throw new Error(`Geen Pokédex data gevonden voor slugs: ${slugs.join(", ")}`);
}

async function createDexEntries(source, speciesById, allSpecies) {
  if (!source) return [];

  if (source.type === "all") {
    return allSpecies.map((entry) => ({ ...entry }));
  }

  if (source.type === "pokedex") {
    const ids = await fetchPokedexEntries(source.slugs || []);
    return ids
      .map((id) => {
        const species = speciesById.get(id);
        if (!species) {
          console.warn(`Pokémon met id ${id} ontbreekt in de species lijst.`);
          return null;
        }
        return { ...species };
      })
      .filter(Boolean);
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
