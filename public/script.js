
const BOX_SIZE = 30;
const STORAGE_KEY = "living-dex-state-v2";
const LEGACY_STORAGE_KEYS = ["living-dex-state-v1"];

const dom = {
  gameSelect: document.getElementById("game-select"),
  dexSelect: document.getElementById("dex-select"),
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  caughtFilter: document.getElementById("caught-filter"),
  specialFilter: document.getElementById("special-filter"),
  specialFilterControl: document.getElementById("special-filter-control"),
  viewGridToggle: document.getElementById("view-grid"),
  viewCompactToggle: document.getElementById("view-compact"),
  viewListToggle: document.getElementById("view-list"),
  selectAll: document.getElementById("select-all"),
  clearAll: document.getElementById("clear-all"),
  spriteModeActions: document.getElementById("sprite-mode-actions"),
  showDefaultSprites: document.getElementById("show-default-sprites"),
  showShinySprites: document.getElementById("show-shiny-sprites"),
  showMegaSprites: document.getElementById("show-mega-sprites"),
  showGmaxSprites: document.getElementById("show-gmax-sprites"),
  showNostalgiaSprites: document.getElementById("show-nostalgia-sprites"),
  dexGrid: document.getElementById("dex-grid"),
  dexList: document.getElementById("dex-list"),
  dexListBody: document.getElementById("dex-list-body"),
  dexProgress: document.getElementById("dex-progress"),
  dexProgressText: document.getElementById("dex-progress-text"),
  dexProgressBar: document.getElementById("dex-progress-bar"),
  boxIndicator: document.getElementById("box-indicator"),
  boxInput: document.getElementById("box-input"),
  previousBox: document.getElementById("previous-box"),
  nextBox: document.getElementById("next-box"),
  emptyDialog: document.getElementById("empty-results"),
  closeEmptyResults: document.getElementById("close-empty-results"),
  cardTemplate: document.getElementById("pokemon-card-template"),
  listRowTemplate: document.getElementById("pokemon-list-row-template"),
  detailsDialog: document.getElementById("pokemon-details"),
  closePokemonDetails: document.getElementById("close-pokemon-details"),
  detailName: document.getElementById("pokemon-detail-name"),
  detailNumber: document.getElementById("pokemon-detail-number"),
  detailTypes: document.getElementById("pokemon-detail-types"),
  detailArtwork: document.getElementById("pokemon-detail-artwork"),
  detailCategory: document.getElementById("pokemon-detail-category"),
  detailHeight: document.getElementById("pokemon-detail-height"),
  detailWeight: document.getElementById("pokemon-detail-weight"),
  detailAbilities: document.getElementById("pokemon-detail-abilities"),
  detailSerebii: document.getElementById("pokemon-detail-serebii"),
  detailBulbapedia: document.getElementById("pokemon-detail-bulbapedia"),
  detailTypeChart: document.getElementById("pokemon-detail-type-chart"),
  detailStats: document.getElementById("pokemon-detail-stats"),
  detailGames: document.getElementById("pokemon-detail-games"),
  detailEncounters: document.getElementById("pokemon-detail-encounters"),
  detailEvolution: document.getElementById("pokemon-detail-evolution"),
  detailForms: document.getElementById("pokemon-detail-forms"),
  detailGallery: document.getElementById("pokemon-detail-gallery"),
  detailEntries: document.getElementById("pokemon-detail-entries"),
};

const state = {
  currentGameId: null,
  currentDexId: null,
  currentBox: 0,
  totalBoxes: 1,
  viewMode: "grid",
  sort: "dex",
  caughtFilter: "all",
  specialFilter: "all",
  spriteMode: "default",
  filters: {
    search: "",
  },
  caughtByGame: {},
  selectedDexByGame: {},
  variantsBySpecies: { mega: {}, gmax: {} },
  variantDefinitionMap: new Map(),
  detailSelectedGameId: null,
  detailAvailability: [],
  detailEncounters: [],
  detailEncountersLoading: false,
};

const TYPE_COLORS = {
  normal: { background: "#A8A77A", color: "#1f1f1f" },
  fire: { background: "#EE8130", color: "#ffffff" },
  water: { background: "#6390F0", color: "#ffffff" },
  electric: { background: "#F7D02C", color: "#1f1f1f" },
  grass: { background: "#7AC74C", color: "#0f2810" },
  ice: { background: "#96D9D6", color: "#0f1f1f" },
  fighting: { background: "#C22E28", color: "#ffffff" },
  poison: { background: "#A33EA1", color: "#ffffff" },
  ground: { background: "#E2BF65", color: "#1f1f1f" },
  flying: { background: "#A98FF3", color: "#1f1f1f" },
  psychic: { background: "#F95587", color: "#ffffff" },
  bug: { background: "#A6B91A", color: "#1f1f1f" },
  rock: { background: "#B6A136", color: "#1f1f1f" },
  ghost: { background: "#735797", color: "#ffffff" },
  dragon: { background: "#6F35FC", color: "#ffffff" },
  dark: { background: "#705746", color: "#ffffff" },
  steel: { background: "#B7B7CE", color: "#1f1f1f" },
  fairy: { background: "#D685AD", color: "#1f1f1f" },
};

const DEFENSIVE_TYPE_EFFECTIVENESS = {
  normal: { weakTo: ["fighting"], resist: [], immune: ["ghost"] },
  fire: {
    weakTo: ["water", "ground", "rock"],
    resist: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immune: [],
  },
  water: { weakTo: ["electric", "grass"], resist: ["fire", "water", "ice", "steel"], immune: [] },
  electric: { weakTo: ["ground"], resist: ["electric", "flying", "steel"], immune: [] },
  grass: {
    weakTo: ["fire", "ice", "poison", "flying", "bug"],
    resist: ["water", "electric", "grass", "ground"],
    immune: [],
  },
  ice: { weakTo: ["fire", "fighting", "rock", "steel"], resist: ["ice"], immune: [] },
  fighting: { weakTo: ["flying", "psychic", "fairy"], resist: ["bug", "rock", "dark"], immune: [] },
  poison: {
    weakTo: ["ground", "psychic"],
    resist: ["grass", "fighting", "poison", "bug", "fairy"],
    immune: [],
  },
  ground: { weakTo: ["water", "grass", "ice"], resist: ["poison", "rock"], immune: ["electric"] },
  flying: { weakTo: ["electric", "ice", "rock"], resist: ["grass", "fighting", "bug"], immune: ["ground"] },
  psychic: { weakTo: ["bug", "ghost", "dark"], resist: ["fighting", "psychic"], immune: [] },
  bug: { weakTo: ["fire", "flying", "rock"], resist: ["grass", "fighting", "ground"], immune: [] },
  rock: {
    weakTo: ["water", "grass", "fighting", "ground", "steel"],
    resist: ["normal", "fire", "poison", "flying"],
    immune: [],
  },
  ghost: { weakTo: ["ghost", "dark"], resist: ["poison", "bug"], immune: ["normal", "fighting"] },
  dragon: { weakTo: ["ice", "dragon", "fairy"], resist: ["fire", "water", "electric", "grass"], immune: [] },
  dark: { weakTo: ["fighting", "bug", "fairy"], resist: ["ghost", "dark"], immune: ["psychic"] },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    resist: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immune: ["poison"],
  },
  fairy: { weakTo: ["poison", "steel"], resist: ["fighting", "bug", "dark"], immune: ["dragon"] },
};

const VERSION_GAME_MAP = {
  red: "red-blue-yellow",
  blue: "red-blue-yellow",
  yellow: "red-blue-yellow",
  gold: "gold-silver-crystal",
  silver: "gold-silver-crystal",
  crystal: "gold-silver-crystal",
  ruby: "ruby-sapphire",
  sapphire: "ruby-sapphire",
  emerald: "emerald",
  "fire-red": "firered-leafgreen",
  "leaf-green": "firered-leafgreen",
  diamond: "diamond-pearl",
  pearl: "diamond-pearl",
  platinum: "platinum",
  heartgold: "heartgold-soulsilver",
  soulsilver: "heartgold-soulsilver",
  black: "black-white",
  white: "black-white",
  "black-2": "black-2-white-2",
  "white-2": "black-2-white-2",
  x: "x-y",
  y: "x-y",
  "omega-ruby": "omega-ruby-alpha-sapphire",
  "alpha-sapphire": "omega-ruby-alpha-sapphire",
  sun: "sun-moon",
  moon: "sun-moon",
  "ultra-sun": "ultra-sun-moon",
  "ultra-moon": "ultra-sun-moon",
  "lets-go-pikachu": "lets-go",
  "lets-go-eevee": "lets-go",
  sword: "sword-shield",
  shield: "sword-shield",
  "isle-of-armor": "sword-shield",
  "crown-tundra": "sword-shield",
  "brilliant-diamond": "brilliant-diamond-pearl",
  "shining-pearl": "brilliant-diamond-pearl",
  "legends-arceus": "legends-arceus",
  scarlet: "scarlet-violet",
  violet: "scarlet-violet",
  "teal-mask": "scarlet-violet",
  "indigo-disk": "scarlet-violet",
  home: "pokemon-home",
  "legends-za": "legends-za",
};

const GAME_COLOR_OVERRIDES = {
  "pokemon-home": "#29B6F6",
  "scarlet-violet": "#D72638",
  "legends-za": "#5D9CEC",
  "legends-arceus": "#507D6A",
  "sword-shield": "#4C6EF5",
  "brilliant-diamond-pearl": "#5DD1FF",
  "lets-go": "#F6AA1C",
  "sun-moon": "#F57C00",
  "ultra-sun-moon": "#FB8C00",
  "omega-ruby-alpha-sapphire": "#FF7043",
  "x-y": "#7E57C2",
  "black-white": "#424242",
  "black-2-white-2": "#616161",
  "heartgold-soulsilver": "#D4AF37",
  "diamond-pearl": "#90CAF9",
  platinum: "#B39DDB",
  emerald: "#2E7D32",
  "ruby-sapphire": "#C62828",
  "firered-leafgreen": "#EF5350",
  "gold-silver-crystal": "#C0A95F",
  "red-blue-yellow": "#E53935",
};

let gameOrderMap = new Map();

const VERSION_NAME_OVERRIDES = {
  scarlet: "Scarlet",
  violet: "Violet",
  sword: "Sword",
  shield: "Shield",
  "isle-of-armor": "Isle of Armor",
  "crown-tundra": "Crown Tundra",
  "brilliant-diamond": "Brilliant Diamond",
  "shining-pearl": "Shining Pearl",
  "legends-arceus": "Legends Arceus",
  "lets-go-pikachu": "Let's Go Pikachu",
  "lets-go-eevee": "Let's Go Eevee",
  "ultra-sun": "Ultra Sun",
  "ultra-moon": "Ultra Moon",
  "omega-ruby": "Omega Ruby",
  "alpha-sapphire": "Alpha Sapphire",
  "black-2": "Black 2",
  "white-2": "White 2",
  home: "HOME",
};

const SPECIAL_FORM_METADATA = {
  mega: { symbol: "M", className: "special-icon--mega", label: "Mega evolutie" },
  gmax: { symbol: "G", className: "special-icon--gmax", label: "Gigantamax" },
};

const VERSION_RELEASE_ORDER = [
  "red",
  "blue",
  "yellow",
  "gold",
  "silver",
  "crystal",
  "ruby",
  "sapphire",
  "emerald",
  "fire-red",
  "leaf-green",
  "diamond",
  "pearl",
  "platinum",
  "heartgold",
  "soulsilver",
  "black",
  "white",
  "black-2",
  "white-2",
  "x",
  "y",
  "omega-ruby",
  "alpha-sapphire",
  "sun",
  "moon",
  "ultra-sun",
  "ultra-moon",
  "lets-go-pikachu",
  "lets-go-eevee",
  "sword",
  "shield",
  "isle-of-armor",
  "crown-tundra",
  "brilliant-diamond",
  "shining-pearl",
  "legends-arceus",
  "scarlet",
  "violet",
  "teal-mask",
  "indigo-disk",
  "home",
];

const VERSION_ORDER_MAP = new Map(
  VERSION_RELEASE_ORDER.map((slug, index) => [slug, index])
);

const VIEW_MODES = {
  GRID: "grid",
  COMPACT: "compact",
  LIST: "list",
};

const NOSTALGIA_VERSION_BY_DEX = {
  home: "home",
  "home-alternate": "home",
  "home-mega": "home",
  "home-gmax": "home",
  "legends-za-main": "scarlet-violet",
  paldea: "scarlet-violet",
  kitakami: "scarlet-violet",
  blueberry: "scarlet-violet",
  "scarlet-violet-other": "scarlet-violet",
  "scarlet-violet-alternate": "scarlet-violet",
  "scarlet-violet-all": "scarlet-violet",
  hisui: "legends-arceus",
  galar: "sword-shield",
  "isle-of-armor": "sword-shield",
  "crown-tundra": "sword-shield",
  "sword-shield-other": "sword-shield",
  "sword-shield-alternate": "sword-shield",
  "sword-shield-gmax": "sword-shield",
  "sword-shield-all": "sword-shield",
  sinnoh: "brilliant-diamond-shining-pearl",
  "bdsp-other": "brilliant-diamond-shining-pearl",
  "kanto-lgpe": "lets-go-pikachu-lets-go-eevee",
  "lgpe-regional": "lets-go-pikachu-lets-go-eevee",
  "lgpe-mega": "lets-go-pikachu-lets-go-eevee",
  "lgpe-all": "lets-go-pikachu-lets-go-eevee",
  "sun-moon-mega": "sun-moon",
  "ultra-mega": "ultra-sun-ultra-moon",
  "kalos-mega": "x-y",
  "kalos-all": "x-y",
  "oras-mega": "omega-ruby-alpha-sapphire",
};

const NOSTALGIA_VERSION_BY_GAME = {
  "pokemon-home": "home",
  "legends-za": "scarlet-violet",
  "scarlet-violet": "scarlet-violet",
  "legends-arceus": "legends-arceus",
  "sword-shield": "sword-shield",
  "brilliant-diamond-pearl": "brilliant-diamond-shining-pearl",
  "lets-go": "lets-go-pikachu-lets-go-eevee",
  "sun-moon": "sun-moon",
  "ultra-sun-moon": "ultra-sun-ultra-moon",
  "omega-ruby-alpha-sapphire": "omega-ruby-alpha-sapphire",
  "x-y": "x-y",
  "black-white": "black-white",
  "black-2-white-2": "black-2-white-2",
  "heartgold-soulsilver": "heartgold-soulsilver",
  "diamond-pearl": "diamond-pearl",
  platinum: "platinum",
  emerald: "emerald",
  "ruby-sapphire": "ruby-sapphire",
  "firered-leafgreen": "firered-leafgreen",
  "gold-silver-crystal": "gold-silver",
  "red-blue-yellow": "red-blue",
};

const FALLBACK_ENCOUNTERS_BY_DEX = {
  paldea: [
    {
      version: "scarlet",
      versionName: "Scarlet",
      locations: [
        { name: "South Province (Areas One–Six)", methods: ["Overworld"] },
        { name: "West & North Province", methods: ["Habitat verkenning"] },
        { name: "Area Zero", methods: ["Late-game overworld"] },
        { name: "Tera Raid Dens", methods: ["Tera Raids"] },
      ],
    },
    {
      version: "violet",
      versionName: "Violet",
      locations: [
        { name: "South Province (Areas One–Six)", methods: ["Overworld"] },
        { name: "Area Zero", methods: ["Late-game overworld"] },
        { name: "Tera Raid Dens", methods: ["Tera Raids"] },
      ],
    },
  ],
  kitakami: [
    {
      version: "teal-mask",
      versionName: "Teal Mask",
      locations: [
        { name: "Kitakami Road & Mossfell Confluence", methods: ["Overworld"] },
        { name: "Timeless Woods", methods: ["Nacht spawns & events"] },
        { name: "Crystal Pool", methods: ["Speciale ontmoetingen"] },
      ],
    },
  ],
  blueberry: [
    {
      version: "indigo-disk",
      versionName: "Indigo Disk",
      locations: [
        { name: "Savanna & Coastal Biome", methods: ["Blueberry Biome overworld"] },
        { name: "Canyon & Polar Biome", methods: ["Blueberry Biome overworld"] },
        { name: "BB Quests", methods: ["Blueberry Quests beloningen"] },
      ],
    },
  ],
  "scarlet-violet-other": [
    {
      version: "scarlet",
      versionName: "Scarlet",
      locations: [
        { name: "Tera Raid Dens", methods: ["5★-7★ evenementen"] },
        { name: "Blueberry Academy", methods: ["BB Quests en legendarische excursies"] },
      ],
    },
    {
      version: "violet",
      versionName: "Violet",
      locations: [
        { name: "Tera Raid Dens", methods: ["5★-7★ evenementen"] },
        { name: "Blueberry Academy", methods: ["BB Quests en legendarische excursies"] },
      ],
    },
  ],
  galar: [
    {
      version: "sword",
      versionName: "Sword",
      locations: [
        { name: "Wild Area", methods: ["Overworld", "Max Raid Battles"] },
        { name: "Routes & Cities", methods: ["Grasvelden", "Fishing"] },
      ],
    },
    {
      version: "shield",
      versionName: "Shield",
      locations: [
        { name: "Wild Area", methods: ["Overworld", "Max Raid Battles"] },
        { name: "Routes & Cities", methods: ["Grasvelden", "Fishing"] },
      ],
    },
  ],
  "isle-of-armor": [
    {
      version: "isle-of-armor",
      versionName: "Isle of Armor",
      locations: [
        { name: "Fields of Honor & Soothing Wetlands", methods: ["Overworld"] },
        { name: "Courageous Cavern", methods: ["Grotten"] },
        { name: "Max Raid Dens", methods: ["Dynamax Raids"] },
      ],
    },
  ],
  "crown-tundra": [
    {
      version: "crown-tundra",
      versionName: "Crown Tundra",
      locations: [
        { name: "Slippery Slope & Giant's Bed", methods: ["Overworld"] },
        { name: "Max Lair", methods: ["Dynamax Adventures"] },
        { name: "Crown Shrine", methods: ["Verhaal evenementen"] },
      ],
    },
  ],
  "sword-shield-other": [
    {
      version: "crown-tundra",
      versionName: "Crown Tundra",
      locations: [
        { name: "Max Lair", methods: ["Dynamax Adventures (legendaries)"] },
      ],
    },
    {
      version: "sword",
      versionName: "Sword",
      locations: [
        { name: "Mystery Gift", methods: ["Evenementen & transfers"] },
      ],
    },
    {
      version: "shield",
      versionName: "Shield",
      locations: [
        { name: "Mystery Gift", methods: ["Evenementen & transfers"] },
      ],
    },
  ],
  hisui: [
    {
      version: "legends-arceus",
      versionName: "Legends Arceus",
      locations: [
        { name: "Obsidian Fieldlands", methods: ["Verkenning & Mass Outbreaks"] },
        { name: "Crimson Mirelands", methods: ["Ruimtijdverstoringen"] },
        { name: "Coronet Highlands / Alabaster Icelands", methods: ["Postgame"] },
      ],
    },
  ],
};

const pokemonDetailsCache = new Map();
const pendingDetailRequests = new Map();
let lastFocusedElement = null;

const DEX_SELECTION_STORAGE_KEY = `${STORAGE_KEY}:dex-selection`;

async function ensurePokedexData() {
  if (window.POKEDEX_DATA && !window.POKEDEX_DATA.then) {
    return window.POKEDEX_DATA;
  }

  if (
    window.POKEDEX_DATA_PROMISE &&
    typeof window.POKEDEX_DATA_PROMISE.then === "function"
  ) {
    const data = await window.POKEDEX_DATA_PROMISE;
    window.POKEDEX_DATA = data;
    return data;
  }

  if (window.POKEDEX_DATA && typeof window.POKEDEX_DATA.then === "function") {
    const data = await window.POKEDEX_DATA;
    window.POKEDEX_DATA = data;
    return data;
  }

  return null;
}

function capitalizeWord(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function titleCase(value) {
  if (!value) return "";
  return value
    .split(/\s|-/)
    .filter(Boolean)
    .map((segment) => capitalizeWord(segment.replace(/_/g, " ")))
    .join(" ");
}

function formatTypeLabel(type) {
  if (!type) return "";
  return titleCase(String(type));
}

function formatLocationName(name) {
  if (!name) return "Onbekende locatie";
  return titleCase(String(name));
}

function escapeSelector(value) {
  return CSS.escape ? CSS.escape(value) : value.replace(/"/g, '\"');
}

function stringToColor(value) {
  if (!value) return "#546E7A";
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

function hslToRgb(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseColor(color) {
  if (!color) return { r: 84, g: 110, b: 122 };
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized = hex.length === 3
      ? hex.split("").map((char) => char + char).join("")
      : hex;
    const value = Number.parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return { r, g, b };
  }
  const hslMatch = color.match(/hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)/i);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    return hslToRgb(h, s, l);
  }
  return { r: 84, g: 110, b: 122 };
}

function getContrastingTextColor(color) {
  const { r, g, b } = parseColor(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0b0d17" : "#ffffff";
}

function getGameColor(gameId) {
  if (!gameId) return "#546E7A";
  if (GAME_COLOR_OVERRIDES[gameId]) {
    return GAME_COLOR_OVERRIDES[gameId];
  }
  return stringToColor(gameId);
}

function getGameOrder(gameId) {
  if (gameOrderMap.has(gameId)) {
    return gameOrderMap.get(gameId);
  }
  return Number.MAX_SAFE_INTEGER;
}

function getGameIdForVersion(version) {
  const slug = normalizeVersionSlug(version);
  if (VERSION_GAME_MAP[slug]) {
    return VERSION_GAME_MAP[slug];
  }
  return null;
}

function normalizeVersionSlug(version) {
  if (version === null || version === undefined) return "";
  return String(version)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getVersionOrder(version) {
  const slug = normalizeVersionSlug(version);
  if (!slug) return Number.MAX_SAFE_INTEGER;
  if (VERSION_ORDER_MAP.has(slug)) {
    return VERSION_ORDER_MAP.get(slug);
  }
  return Number.MAX_SAFE_INTEGER;
}

function buildVariantDefinitionMap(definitions = []) {
  const map = new Map();
  definitions.forEach((variant) => {
    if (!variant || !variant.speciesId || !variant.form) return;
    map.set(`${Number(variant.speciesId)}:${variant.form}`, variant);
  });
  return map;
}

function getGames() {
  return Array.isArray(window.POKEDEX_DATA?.games)
    ? window.POKEDEX_DATA.games
    : [];
}

function getCaughtSet(gameId) {
  if (!state.caughtByGame[gameId]) {
    state.caughtByGame[gameId] = new Set();
  }
  return state.caughtByGame[gameId];
}

function getCurrentGame() {
  const games = getGames();
  return games.find((game) => game.id === state.currentGameId) || null;
}

function getDexesForGame(game) {
  if (!game) return [];
  return Array.isArray(game.dexes) ? game.dexes : [];
}

function getCurrentDex() {
  const game = getCurrentGame();
  const dexes = getDexesForGame(game);
  if (!dexes.length) return null;

  let current = dexes.find((dex) => dex.id === state.currentDexId) || null;
  if (!current) {
    current = dexes[0];
    setCurrentDex(current.id, false);
    if (dom.dexSelect) {
      dom.dexSelect.value = current.id;
    }
  }

  return current;
}

function setCurrentDex(dexId, shouldPersist = true) {
  state.currentDexId = dexId;
  if (state.currentGameId) {
    state.selectedDexByGame[state.currentGameId] = dexId;
    if (shouldPersist) {
      persistDexSelection();
    }
  }
}

function matchesSearch(entry, searchTerm) {
  if (!searchTerm) return true;
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return true;

  const name = entry.name?.toLowerCase?.() || "";
  if (name.includes(normalized)) return true;

  const dexNumber = entry.displayDexNumber?.toLowerCase?.() || "";
  const nationalNumber = entry.displayNationalNumber?.toLowerCase?.() || "";
  const combined = entry.displayNumber?.toLowerCase?.() || "";

  return (
    dexNumber.includes(normalized) ||
    nationalNumber.includes(normalized) ||
    combined.includes(normalized)
  );
}

function applyCaughtFilter(entries, caughtSet) {
  if (state.caughtFilter === "all") {
    return entries;
  }
  return entries.filter((entry) => {
    const key = getEntryCatchKey(entry);
    if (!key) return false;
    const isCaught = caughtSet.has(String(key));
    return state.caughtFilter === "caught" ? isCaught : !isCaught;
  });
}

function hasSpecialForm(entry, type) {
  if (!entry) return false;
  return getSpecialFormsForSpecies(entry.speciesId).some((form) => form.type === type);
}

function applySpecialFormFilter(entries, filter = state.specialFilter) {
  if (filter === "all") {
    return entries;
  }
  return entries.filter((entry) => hasSpecialForm(entry, filter));
}

function computeSpecialAvailability(entries = []) {
  return entries.reduce(
    (result, entry) => {
      const forms = getSpecialFormsForSpecies(entry.speciesId);
      forms.forEach(({ type }) => {
        if (type === "mega") result.mega = true;
        if (type === "gmax") result.gmax = true;
      });
      return result;
    },
    { mega: false, gmax: false }
  );
}

function resolveActiveSpecialFilter(availability) {
  const hasMega = Boolean(availability?.mega);
  const hasGmax = Boolean(availability?.gmax);
  const supportsFilter = state.currentGameId === "pokemon-home" && (hasMega || hasGmax);
  let filter = state.specialFilter;
  if (!supportsFilter) {
    filter = "all";
  } else {
    if (filter === "mega" && !hasMega) filter = "all";
    if (filter === "gmax" && !hasGmax) filter = "all";
  }
  if (filter !== state.specialFilter) {
    state.specialFilter = filter;
    if (dom.specialFilter) {
      dom.specialFilter.value = filter;
    }
  }
  return filter;
}

function getSortValue(entry, sortKey) {
  if (sortKey === "name") {
    return entry.name?.toLowerCase?.() || "";
  }
  if (sortKey === "national") {
    if (Number.isFinite(entry.nationalDexNumber)) {
      return entry.nationalDexNumber;
    }
    const match = (entry.displayNationalNumber || "").match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
  }
  if (Number.isFinite(entry.sortIndex)) {
    return entry.sortIndex;
  }
  if (Number.isFinite(entry.dexNumber)) {
    return entry.dexNumber;
  }
  const match = (entry.displayDexNumber || "").match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

function sortEntries(entries) {
  if (state.sort === "dex") {
    return [...entries];
  }
  const sorted = [...entries];
  sorted.sort((a, b) => {
    const aValue = getSortValue(a, state.sort);
    const bValue = getSortValue(b, state.sort);
    if (aValue === bValue) {
      return (a.displayNumber || "").localeCompare(
        b.displayNumber || "",
        "nl",
        { numeric: true, sensitivity: "base" }
      );
    }
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    return aValue < bValue ? -1 : 1;
  });
  return sorted;
}

function getEntryCatchKey(entry) {
  if (!entry) return null;
  if (entry.key) return String(entry.key);
  const suffix = entry.form ? `:${entry.form}` : "";
  return `${entry.speciesId}${suffix}`;
}

function getEntryDetailKey(entry) {
  return getEntryCatchKey(entry);
}

function getCachedPokemonDetails(entry) {
  const key = getEntryDetailKey(entry);
  if (!key) return null;
  return pokemonDetailsCache.get(key) || null;
}

function ensurePokemonDetails(entry) {
  const key = getEntryDetailKey(entry);
  if (!key) return Promise.resolve(null);
  if (pokemonDetailsCache.has(key)) {
    return Promise.resolve(pokemonDetailsCache.get(key));
  }
  if (pendingDetailRequests.has(key)) {
    return pendingDetailRequests.get(key);
  }
  if (typeof window.getPokemonDetails !== "function") {
    return Promise.resolve(null);
  }

  const request = window
    .getPokemonDetails(entry)
    .then((details) => {
      if (details) {
        pokemonDetailsCache.set(key, details);
      }
      pendingDetailRequests.delete(key);
      return details || null;
    })
    .catch((error) => {
      pendingDetailRequests.delete(key);
      console.warn("Kon Pokémondetails niet laden:", error);
      return null;
    });

  pendingDetailRequests.set(key, request);
  return request;
}

function buildTypeEffectiveness(types = []) {
  const multipliers = {};
  Object.keys(DEFENSIVE_TYPE_EFFECTIVENESS).forEach((type) => {
    multipliers[type] = 1;
  });

  (types || []).forEach((type) => {
    if (!type) return;
    const slug = normalizeVersionSlug(type.slug || type.name || type);
    const data = DEFENSIVE_TYPE_EFFECTIVENESS[slug];
    if (!data) return;
    (data.weakTo || []).forEach((attackType) => {
      multipliers[attackType] = (multipliers[attackType] || 1) * 2;
    });
    (data.resist || []).forEach((attackType) => {
      multipliers[attackType] = (multipliers[attackType] || 1) * 0.5;
    });
    (data.immune || []).forEach((attackType) => {
      multipliers[attackType] = 0;
    });
  });

  const groups = {
    quadruple: [],
    double: [],
    neutral: [],
    half: [],
    quarter: [],
    immune: [],
  };

  Object.entries(multipliers).forEach(([attackType, multiplier]) => {
    const value = Number.isFinite(multiplier) ? multiplier : 1;
    const slug = normalizeVersionSlug(attackType);
    if (value === 0) {
      groups.immune.push(slug);
    } else if (value >= 3.5) {
      groups.quadruple.push(slug);
    } else if (value >= 1.5) {
      groups.double.push(slug);
    } else if (value <= 0.26) {
      groups.quarter.push(slug);
    } else if (value <= 0.6) {
      groups.half.push(slug);
    } else {
      groups.neutral.push(slug);
    }
  });

  return groups;
}

function renderTypeGroup(container, label, types) {
  if (!types?.length) return;
  const block = document.createElement("div");
  block.className = "pokemon-details__type-group";
  const title = document.createElement("h4");
  title.textContent = label;
  block.append(title);

  const list = document.createElement("ul");
  types.forEach((type) => {
    const item = document.createElement("li");
    item.textContent = formatTypeLabel(type);
    list.append(item);
  });
  block.append(list);
  container.append(block);
}

function renderTypeEffectiveness(container, types = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!types || !types.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen typegegevens beschikbaar.";
    container.append(empty);
    return;
  }

  const effectiveness = buildTypeEffectiveness(types);
  renderTypeGroup(container, "Zeer zwak (4×)", effectiveness.quadruple);
  renderTypeGroup(container, "Zwak (2×)", effectiveness.double);
  renderTypeGroup(container, "Weerstand (½×)", effectiveness.half);
  renderTypeGroup(container, "Sterke weerstand (¼×)", effectiveness.quarter);
  renderTypeGroup(container, "Immuun (0×)", effectiveness.immune);

  if (
    !effectiveness.quadruple.length &&
    !effectiveness.double.length &&
    !effectiveness.half.length &&
    !effectiveness.quarter.length &&
    !effectiveness.immune.length
  ) {
    const neutral = document.createElement("p");
    neutral.className = "pokemon-details__empty";
    neutral.textContent = "Geen opvallende type-effectiviteit.";
    container.append(neutral);
  }
}

function renderAbilities(container, abilities = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!abilities?.length) {
    const item = document.createElement("li");
    item.textContent = "Onbekend";
    container.append(item);
    return;
  }

  abilities.forEach((ability) => {
    const item = document.createElement("li");
    item.dataset.hidden = String(Boolean(ability?.hidden));
    item.textContent = ability?.hidden
      ? `${ability.name || "Onbekend"} (verborgen)`
      : ability.name || "Onbekend";
    if (ability?.effect) {
      item.title = ability.effect;
    }
    container.append(item);
  });
}

const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

function sortStats(stats = []) {
  return [...stats].sort((a, b) => {
    const indexA = STAT_ORDER.indexOf(a.slug);
    const indexB = STAT_ORDER.indexOf(b.slug);
    return indexA - indexB;
  });
}

function renderStats(container, stats = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!stats?.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen statistieken beschikbaar.";
    container.append(empty);
    return;
  }

  const sorted = sortStats(stats);
  sorted.forEach((stat) => {
    const row = document.createElement("div");
    row.className = "pokemon-details__stat";

    const name = document.createElement("span");
    name.className = "pokemon-details__stat-name";
    name.textContent = stat.label || stat.slug;

    const bar = document.createElement("div");
    bar.className = "pokemon-details__stat-bar";
    const fill = document.createElement("span");
    const max = 255;
    const ratio = Math.max(0, Math.min(1, (stat.value || 0) / max));
    fill.style.width = `${Math.round(ratio * 100)}%`;
    bar.append(fill);

    const value = document.createElement("span");
    value.className = "pokemon-details__stat-value";
    value.textContent = String(stat.value ?? "-");

    row.append(name, bar, value);
    container.append(row);
  });
}

function getAllVariantForms(speciesId) {
  if (!speciesId || !Array.isArray(window.POKEDEX_DATA?.variants?.all)) {
    return [];
  }
  const id = Number(speciesId);
  return window.POKEDEX_DATA.variants.all.filter(
    (variant) => Number(variant.speciesId) === id
  );
}

function buildFormDefinitions(entry, details) {
  const forms = [];
  const seen = new Set();

  const addForm = (label, sprite) => {
    if (!sprite || seen.has(`${label}:${sprite}`)) return;
    seen.add(`${label}:${sprite}`);
    forms.push({ label, sprite });
  };

  const baseSprite =
    details?.sprites?.home ||
    details?.sprites?.default ||
    details?.sprites?.artwork ||
    entry?.sprite ||
    "";
  addForm("Standaard", baseSprite);
  if (details?.sprites?.shiny) {
    addForm("Shiny", details.sprites.shiny);
  }
  if (details?.sprites?.female) {
    addForm("Vrouwelijk", details.sprites.female);
  }
  if (details?.sprites?.shinyFemale) {
    addForm("Shiny (vrouwelijk)", details.sprites.shinyFemale);
  }

  getAllVariantForms(entry?.speciesId).forEach((variant) => {
    const sprite = getVariantSprite(variant);
    const label = variant.name || titleCase(variant.form || "Variant");
    addForm(label, sprite);
  });

  return forms;
}

function renderForms(container, forms = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!forms?.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen speciale vormen bekend.";
    container.append(empty);
    return;
  }

  forms.forEach((form) => {
    const card = document.createElement("div");
    card.className = "pokemon-details__form-card";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = form.label || "Variant";
    img.src = form.sprite;
    const label = document.createElement("span");
    label.textContent = form.label || "Variant";
    card.append(img, label);
    container.append(card);
  });
}

function buildGallerySources(entry, details, forms = []) {
  const gallery = [];
  const seen = new Set();
  const add = (label, url) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    gallery.push({ label, url });
  };

  add("Official artwork", details?.sprites?.artwork);
  add("HOME sprite", details?.sprites?.home);
  add("Standaard sprite", details?.sprites?.default || entry?.sprite);
  add("Shiny sprite", details?.sprites?.shiny);
  add("Female sprite", details?.sprites?.female);
  add("Shiny female sprite", details?.sprites?.shinyFemale);

  forms.forEach((form) => add(form.label, form.sprite));

  return gallery;
}

function renderGallery(container, gallery = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!gallery?.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen extra artwork gevonden.";
    container.append(empty);
    return;
  }

  gallery.forEach((item) => {
    const card = document.createElement("div");
    card.className = "pokemon-details__gallery-item";
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.label || "Artwork";
    img.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = item.label || "Artwork";
    card.append(img, label);
    container.append(card);
  });
}

function renderPokedexEntries(container, entries = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!entries?.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen Pokédex entries beschikbaar.";
    container.append(empty);
    return;
  }

  const sorted = [...entries].sort((a, b) => {
    return getVersionOrder(a.version) - getVersionOrder(b.version);
  });

  sorted.forEach((entry) => {
    const block = document.createElement("div");
    block.className = "pokemon-details__entry";
    const title = document.createElement("h4");
    title.textContent = entry.versionName || formatVersionName(entry.version);
    const text = document.createElement("p");
    text.textContent = entry.text || "Geen beschrijving";
    block.append(title, text);
    container.append(block);
  });
}

function getNationalDexNumber(entry) {
  if (Number.isFinite(entry?.nationalDexNumber)) {
    return entry.nationalDexNumber;
  }
  const match = (entry?.displayNationalNumber || "").match(/\d+/);
  if (match) {
    return Number.parseInt(match[0], 10);
  }
  return null;
}

function buildExternalLinks(entry) {
  const national = getNationalDexNumber(entry);
  const padded = national ? String(national).padStart(4, "0") : null;
  const name = entry?.name || "";
  const normalizedName = name.replace(/\s+/g, "_");
  const bulbapediaName = encodeURIComponent(normalizedName);
  return {
    serebii: padded ? `https://www.serebii.net/pokedex-sv/${padded}.shtml` : "#",
    bulbapedia: bulbapediaName
      ? `https://bulbapedia.bulbagarden.net/wiki/${bulbapediaName}_(Pok%C3%A9mon)`
      : "#",
  };
}

function getDefaultSpriteForSpecies(speciesId) {
  if (!speciesId) return "";
  if (typeof window.POKEDEX_DATA?.sprites?.default === "function") {
    return window.POKEDEX_DATA.sprites.default(speciesId);
  }
  return "";
}

function resolveEvolutionSprite(node) {
  if (!node) return "";
  return node.sprite || getDefaultSpriteForSpecies(node.id);
}

function filterEncountersByGame(encounters = [], gameId) {
  if (!gameId) return encounters || [];
  const filtered = (encounters || []).filter((entry) => {
    const mapped = getGameIdForVersion(entry.version || entry.versionName);
    if (!mapped) return false;
    return mapped === gameId;
  });
  if (filtered.length) {
    return filtered;
  }
  return encounters || [];
}

function updateEncounterPanel() {
  if (!dom.detailEncounters) return;
  if (state.detailEncountersLoading) {
    dom.detailEncounters.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailEncounters.append(loading);
    return;
  }
  const selectedGameId = state.detailSelectedGameId;
  const availabilityEntry = state.detailAvailability.find(
    (entry) => entry.gameId === selectedGameId
  );
  renderEncounters(dom.detailEncounters, state.detailEncounters, {
    gameId: selectedGameId,
    availability: availabilityEntry,
  });
}

function renderTypeBadges(container, types = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(types) || !types.length) {
    container.classList.add("pokemon-types--empty");
    return;
  }
  container.classList.remove("pokemon-types--empty");
  types.forEach((type) => {
    if (!type) return;
    const badge = document.createElement("span");
    badge.className = "type-badge";
    const slug = type.slug || type.name || type;
    const meta = TYPE_COLORS[slug];
    if (meta) {
      badge.style.setProperty("--badge-bg", meta.background);
      badge.style.setProperty("--badge-fg", meta.color);
      badge.style.backgroundColor = meta.background;
      badge.style.color = meta.color;
    }
    badge.textContent = type.name || formatTypeLabel(slug);
    container.append(badge);
  });
}

function updateEntryTypes(entry, types = []) {
  const key = getEntryDetailKey(entry);
  if (!key) return;
  const selector = `[data-entry-key="${escapeSelector(key)}"]`;
  const card = dom.dexGrid?.querySelector(`.pokemon-card${selector}`);
  if (card) {
    const container = card.querySelector(".pokemon-types");
    renderTypeBadges(container, types);
  }
  const row = dom.dexListBody?.querySelector(`.dex-list__row${selector}`);
  if (row) {
    const cell = row.querySelector(".dex-list__cell--types");
    renderTypeBadges(cell, types);
  }
}

function resolveSprite(entry, details, options = {}) {
  const preferHome = Boolean(options.preferHome);
  const preferEntry = Boolean(options.preferEntry);
  if (options.overrideSprite) {
    return options.overrideSprite;
  }
  if (preferEntry && entry?.sprite) {
    return entry.sprite;
  }
  if (details?.sprites) {
    if (preferHome && details.sprites.home) {
      return details.sprites.home;
    }
    if (!preferHome && details.sprites.default) {
      return details.sprites.default;
    }
    if (details.sprites.home) {
      return details.sprites.home;
    }
    if (details.sprites.default) {
      return details.sprites.default;
    }
    if (details.sprites.artwork) {
      return details.sprites.artwork;
    }
  }
  if (!preferHome && entry?.sprite) return entry.sprite;
  if (entry?.sprite) return entry.sprite;
  if (typeof window.POKEDEX_DATA?.sprites?.default === "function") {
    const id = entry?.pokemonId || entry?.speciesId;
    return window.POKEDEX_DATA.sprites.default(id);
  }
  return "";
}

function getSpriteForEntry(entry, details) {
  if (!entry) return "";
  if (state.spriteMode === "mega" || state.spriteMode === "gmax") {
    const forms = getSpecialFormsForSpecies(entry.speciesId);
    const match = forms.find((form) => form.type === state.spriteMode);
    if (match?.variant) {
      const variantSprite = getVariantSprite(match.variant);
      if (variantSprite) {
        return variantSprite;
      }
    }
  }
  if (state.spriteMode === "shiny") {
    if (details?.sprites?.shiny) {
      return details.sprites.shiny;
    }
  }
  if (state.spriteMode === "nostalgia") {
    const nostalgic = getNostalgiaSprite(entry, details);
    if (nostalgic) {
      return nostalgic;
    }
  }
  return resolveSprite(entry, details, { preferHome: false, preferEntry: true });
}

function getSpecialFormsForSpecies(speciesId) {
  const id = String(speciesId);
  const results = [];
  const mega = state.variantsBySpecies?.mega?.[id] || [];
  mega.forEach((variant) => results.push({ type: "mega", variant }));
  const gmax = state.variantsBySpecies?.gmax?.[id] || [];
  gmax.forEach((variant) => results.push({ type: "gmax", variant }));
  return results;
}

function getVariantSprite(variant) {
  if (!variant) return "";
  if (variant.sprite) return variant.sprite;
  if (variant.pokemonId && typeof window.POKEDEX_DATA?.sprites?.default === "function") {
    return window.POKEDEX_DATA.sprites.default(variant.pokemonId);
  }
  return "";
}

function getNostalgiaVersionKey(gameId = state.currentGameId, dexId = state.currentDexId) {
  if (dexId && NOSTALGIA_VERSION_BY_DEX[dexId]) {
    return NOSTALGIA_VERSION_BY_DEX[dexId];
  }
  if (gameId && NOSTALGIA_VERSION_BY_GAME[gameId]) {
    return NOSTALGIA_VERSION_BY_GAME[gameId];
  }
  return null;
}

function supportsNostalgiaSprites(gameId = state.currentGameId, dexId = state.currentDexId) {
  return Boolean(getNostalgiaVersionKey(gameId, dexId));
}

function pickVersionSprite(spriteSet) {
  if (!spriteSet) return "";
  return (
    spriteSet.front_default ||
    spriteSet.front_female ||
    spriteSet.front_shiny ||
    spriteSet.front_shiny_female ||
    spriteSet.animated ||
    ""
  );
}

function getNostalgiaSprite(entry, details) {
  if (!details) return "";
  const key = getNostalgiaVersionKey();
  if (!key) return "";
  if (key === "home") {
    return details.sprites?.home || details.sprites?.default || "";
  }
  const versions = details.sprites?.versions || {};
  const spriteSet = versions[key];
  if (!spriteSet) {
    return details.sprites?.default || "";
  }
  const resolved = pickVersionSprite(spriteSet);
  return resolved || details.sprites?.default || "";
}

function findVariantDefinition(speciesId, form) {
  if (!form) return null;
  return state.variantDefinitionMap.get(`${Number(speciesId)}:${form}`) || null;
}

function applyRegionToDisplayNumber(display, regionCode) {
  if (!display || !regionCode) return display;
  if (display.includes(`*${regionCode}`)) {
    return display;
  }
  const normalized = display.replace(/^#/, "");
  if (normalized.includes("*")) {
    return `#${normalized}`;
  }
  return `#${normalized}*${regionCode}`;
}

function buildNationalDisplayNumber(speciesId, regionCode) {
  if (!speciesId) return "";
  const padded = String(speciesId).padStart(3, "0");
  return regionCode ? `#${padded}*${regionCode}` : `#${padded}`;
}

function getVariantDisplayInfo(baseEntry, variantDef) {
  const regionCode = variantDef?.regionCode || baseEntry?.regionCode || null;
  let national = baseEntry?.displayNationalNumber || "";
  if (national) {
    national = applyRegionToDisplayNumber(national, regionCode);
  } else {
    national = buildNationalDisplayNumber(baseEntry?.speciesId, regionCode);
  }
  let dex = baseEntry?.displayDexNumber || "";
  if (dex) {
    dex = applyRegionToDisplayNumber(dex, regionCode);
  } else {
    dex = national;
  }
  const displayNumber = dex && national && dex !== national
    ? `${dex} (${national})`
    : dex || national || "";
  return {
    displayNumber,
    displayDexNumber: dex,
    displayNationalNumber: national,
  };
}

function buildVariantEntry(baseEntry, variant, type) {
  if (!baseEntry || !variant) return null;
  const speciesId = Number(variant.speciesId || baseEntry.speciesId);
  const form = variant.form || null;
  const definition = findVariantDefinition(speciesId, form);
  const display = getVariantDisplayInfo(baseEntry, definition || variant);
  return {
    key: variant.key || `${speciesId}:${form}`,
    speciesId,
    form,
    name: variant.name || definition?.name || baseEntry.name,
    sprite: variant.sprite || definition?.sprite || baseEntry.sprite || null,
    regionCode:
      definition?.regionCode || variant.regionCode || baseEntry.regionCode || null,
    pokemonSlug:
      variant.pokemonSlug || definition?.pokemonSlug || baseEntry.pokemonSlug || null,
    pokemonId:
      variant.pokemonId || definition?.pokemonId || baseEntry.pokemonId || null,
    displayNumber: display.displayNumber,
    displayDexNumber: display.displayDexNumber,
    displayNationalNumber: display.displayNationalNumber,
    sortIndex: baseEntry.sortIndex,
  };
}

function createSpecialFormButton(baseEntry, variant, type) {
  const meta = SPECIAL_FORM_METADATA[type] || SPECIAL_FORM_METADATA.mega;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `special-icon ${meta.className}`;
  button.textContent = meta.symbol;
  const variantName = variant.name || baseEntry.name;
  button.title = `${meta.label}: ${variantName}`;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openVariantDetailsForEntry(baseEntry, variant, type);
  });
  return button;
}

function appendSpecialForms(container, entry) {
  if (!container || !entry) return;
  container.innerHTML = "";
  const forms = getSpecialFormsForSpecies(entry.speciesId);
  if (!forms.length) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  forms.forEach(({ type, variant }) => {
    const button = createSpecialFormButton(entry, variant, type);
    if (button) {
      container.append(button);
    }
  });
}

function openVariantDetailsForEntry(baseEntry, variant, type) {
  const entry = buildVariantEntry(baseEntry, variant, type);
  if (entry) {
    openPokemonDetails(entry);
  }
}

function renderGrid(entries, caughtSet) {
  if (!dom.dexGrid || !dom.cardTemplate) return;
  dom.dexGrid.replaceChildren();
  const isCompact = state.viewMode === VIEW_MODES.COMPACT;
  dom.dexGrid.classList.toggle("dex-grid--compact", isCompact);
  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => {
    const card = dom.cardTemplate.content.firstElementChild.cloneNode(true);
    const sprite = card.querySelector(".pokemon-sprite");
    const number = card.querySelector(".pokemon-number");
    const name = card.querySelector(".pokemon-name");
    const special = card.querySelector(".pokemon-special");
    const typesContainer = card.querySelector(".pokemon-types");

    if (number) {
      number.textContent = entry.displayNumber || "";
    }

    if (name) {
      name.textContent = entry.name;
      name.setAttribute("aria-label", `Toon details voor ${entry.name}`);
      name.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPokemonDetails(entry);
      });
      name.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          openPokemonDetails(entry);
        }
      });
    }

    const cachedDetails = getCachedPokemonDetails(entry);
    const spriteUrl = getSpriteForEntry(entry, cachedDetails);
    if (sprite) {
      sprite.src = spriteUrl || "";
      sprite.alt = `${entry.name} sprite`;
      sprite.dataset.mode = state.spriteMode;
    }

    card.classList.toggle("pokemon-card--compact", isCompact);

    renderTypeBadges(typesContainer, entry.types || cachedDetails?.types || []);
    appendSpecialForms(special, entry);

    const catchKey = getEntryCatchKey(entry);
    const isCaught = catchKey ? caughtSet.has(String(catchKey)) : false;
    card.dataset.id = catchKey || "";
    card.dataset.caught = String(isCaught);
    const detailKey = getEntryDetailKey(entry);
    if (detailKey) {
      card.dataset.entryKey = detailKey;
    }
    card.dataset.spriteMode = state.spriteMode;

    card.addEventListener("click", () => {
      toggleCaught(catchKey);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCaught(catchKey);
      }
    });

    ensurePokemonDetails(entry).then((details) => {
      if (!details) return;
      if (details.types?.length) {
        updateEntryTypes(entry, details.types);
      }
      const cardNode = detailKey
        ? dom.dexGrid?.querySelector(
            `.pokemon-card[data-entry-key="${escapeSelector(detailKey)}"]`
          )
        : null;
      const imageNode = cardNode?.querySelector?.(".pokemon-sprite");
      const nextSprite = getSpriteForEntry(entry, details);
      if (imageNode && nextSprite && imageNode.src !== nextSprite) {
        imageNode.src = nextSprite;
      }
    });

    fragment.append(card);
  });
  dom.dexGrid.append(fragment);
}

function createListRow(entry, caughtSet) {
  if (!dom.listRowTemplate) return null;
  const node = dom.listRowTemplate.content.firstElementChild.cloneNode(true);
  const catchKey = getEntryCatchKey(entry);
  node.dataset.id = catchKey || "";

  const numberCell = node.querySelector(".dex-list__cell--number");
  if (numberCell) {
    numberCell.textContent =
      entry.displayNumber || entry.displayDexNumber || entry.displayNationalNumber || "";
  }

  const nameButton = node.querySelector(".dex-list__name-button");
  if (nameButton) {
    nameButton.textContent = entry.name;
    nameButton.addEventListener("click", (event) => {
      event.preventDefault();
      openPokemonDetails(entry);
    });
  }

  const typesCell = node.querySelector(".dex-list__cell--types");
  renderTypeBadges(typesCell, entry.types || getCachedPokemonDetails(entry)?.types || []);

  const specialContainer = node.querySelector(".pokemon-special");
  appendSpecialForms(specialContainer, entry);

  const statusButton = node.querySelector(".status-toggle");
  if (statusButton) {
    statusButton.addEventListener("click", (event) => {
      event.preventDefault();
      toggleCaught(catchKey);
    });
  }

  const isCaught = catchKey ? caughtSet.has(String(catchKey)) : false;
  node.dataset.caught = String(isCaught);
  if (statusButton) {
    statusButton.textContent = isCaught
      ? "Verwijder markering"
      : "Markeer als gevangen";
  }

  const detailKey = getEntryDetailKey(entry);
  if (detailKey) {
    node.dataset.entryKey = detailKey;
  }

  return node;
}

function renderList(entries, caughtSet = getCaughtSet(state.currentGameId)) {
  if (!dom.dexListBody || !dom.listRowTemplate) return;
  dom.dexListBody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => {
    const row = createListRow(entry, caughtSet);
    if (row) {
      fragment.append(row);
      ensurePokemonDetails(entry).then((details) => {
        if (details?.types?.length) {
          updateEntryTypes(entry, details.types);
        }
      });
    }
  });
  dom.dexListBody.append(fragment);
}

function updateListRow(catchKey) {
  if (!dom.dexListBody) return;
  const row = dom.dexListBody.querySelector(
    `.dex-list__row[data-id="${escapeSelector(catchKey)}"]`
  );
  if (!row) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  const isCaught = caughtSet.has(String(catchKey));
  row.dataset.caught = String(isCaught);
  const button = row.querySelector(".status-toggle");
  if (button) {
    button.textContent = isCaught
      ? "Verwijder markering"
      : "Markeer als gevangen";
  }
}

function updateCard(catchKey) {
  if (!dom.dexGrid) return;
  const card = dom.dexGrid.querySelector(
    `.pokemon-card[data-id="${escapeSelector(catchKey)}"]`
  );
  if (!card) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  card.dataset.caught = String(caughtSet.has(String(catchKey)));
}

function updateEntryStatus(catchKey) {
  if (!catchKey) return;
  updateCard(catchKey);
  updateListRow(catchKey);
}

function toggleCaught(catchKey) {
  if (!state.currentGameId || !catchKey) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  const normalized = String(catchKey);
  if (caughtSet.has(normalized)) {
    caughtSet.delete(normalized);
  } else {
    caughtSet.add(normalized);
  }
  persistState();
  if (state.caughtFilter === "all") {
    updateEntryStatus(normalized);
  } else {
    renderDex();
  }
}

function markEntries(entries, shouldMark) {
  if (!state.currentGameId) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  entries.forEach((entry) => {
    const key = getEntryCatchKey(entry);
    if (!key) return;
    if (shouldMark) {
      caughtSet.add(String(key));
    } else {
      caughtSet.delete(String(key));
    }
  });
  persistState();
  renderDex();
}

function selectAllVisible() {
  const currentDex = getCurrentDex();
  if (!currentDex) return;
  const entries = getVisibleEntries();
  markEntries(entries, true);
}

function clearAllVisible() {
  const entries = getVisibleEntries();
  markEntries(entries, false);
}

function getVisibleEntries() {
  return getFilterContext().filteredEntries;
}

function isGridView() {
  return state.viewMode === VIEW_MODES.GRID || state.viewMode === VIEW_MODES.COMPACT;
}

function updateViewToggleButtons() {
  const isGrid = state.viewMode === VIEW_MODES.GRID;
  const isCompact = state.viewMode === VIEW_MODES.COMPACT;
  const isList = state.viewMode === VIEW_MODES.LIST;
  if (dom.viewGridToggle) {
    dom.viewGridToggle.classList.toggle("is-active", isGrid);
    dom.viewGridToggle.setAttribute("aria-pressed", String(isGrid));
  }
  if (dom.viewCompactToggle) {
    dom.viewCompactToggle.classList.toggle("is-active", isCompact);
    dom.viewCompactToggle.setAttribute("aria-pressed", String(isCompact));
  }
  if (dom.viewListToggle) {
    dom.viewListToggle.classList.toggle("is-active", isList);
    dom.viewListToggle.setAttribute("aria-pressed", String(isList));
  }
  if (dom.dexGrid) {
    dom.dexGrid.hidden = isList;
  }
  if (dom.dexList) {
    dom.dexList.hidden = !isList;
  }
}

function updateBoxControls() {
  const isGrid = isGridView();
  const total = Math.max(1, state.totalBoxes || 1);
  if (dom.previousBox) {
    dom.previousBox.disabled = !isGrid || total <= 1 || state.currentBox <= 0;
  }
  if (dom.nextBox) {
    dom.nextBox.disabled = !isGrid || total <= 1 || state.currentBox >= total - 1;
  }
  if (dom.boxInput) {
    dom.boxInput.disabled = !isGrid;
  }
}

function updateBoxIndicator(current, total) {
  if (dom.boxIndicator) {
    if (state.viewMode === VIEW_MODES.LIST) {
      dom.boxIndicator.textContent = "Lijstweergave";
    } else {
      const label = state.viewMode === VIEW_MODES.COMPACT ? "Compacte box" : "Box";
      dom.boxIndicator.textContent = `${label} ${current + 1} / ${total}`;
    }
  }
  if (dom.boxInput) {
    if (isGridView()) {
      dom.boxInput.max = total;
      dom.boxInput.value = Math.min(total, Math.max(1, current + 1));
    } else {
      dom.boxInput.value = 1;
    }
  }
  updateBoxControls();
}

function resolveSpriteMode(baseAvailability) {
  const hasMega = Boolean(baseAvailability?.mega);
  const hasGmax = Boolean(baseAvailability?.gmax);
  const hasNostalgia = supportsNostalgiaSprites();
  if (state.spriteMode === "mega" && !hasMega) {
    state.spriteMode = "default";
  }
  if (state.spriteMode === "gmax" && !hasGmax) {
    state.spriteMode = "default";
  }
  if (state.spriteMode === "nostalgia" && !hasNostalgia) {
    state.spriteMode = "default";
  }
  if (!isGridView() && state.spriteMode !== "default") {
    state.spriteMode = "default";
  }
}

function updateSpecialFilterControl(baseAvailability) {
  const hasMega = Boolean(baseAvailability?.mega);
  const hasGmax = Boolean(baseAvailability?.gmax);
  const shouldShow = state.currentGameId === "pokemon-home" && (hasMega || hasGmax);
  if (dom.specialFilterControl) {
    dom.specialFilterControl.hidden = !shouldShow;
  }
  if (dom.specialFilter) {
    const megaOption = dom.specialFilter.querySelector('option[value="mega"]');
    const gmaxOption = dom.specialFilter.querySelector('option[value="gmax"]');
    if (megaOption) megaOption.disabled = !hasMega;
    if (gmaxOption) gmaxOption.disabled = !hasGmax;
    dom.specialFilter.value = state.specialFilter;
  }
}

function updateSpriteModeActions(baseAvailability) {
  const hasMega = Boolean(baseAvailability?.mega);
  const hasGmax = Boolean(baseAvailability?.gmax);
  const isGrid = isGridView();
  const hasNostalgia = supportsNostalgiaSprites();
  if (dom.spriteModeActions) {
    dom.spriteModeActions.hidden = !isGrid;
  }
  if (dom.showDefaultSprites) {
    dom.showDefaultSprites.disabled = !isGrid || state.spriteMode === "default";
    dom.showDefaultSprites.classList.toggle("is-active", state.spriteMode === "default");
  }
  if (dom.showShinySprites) {
    const isShiny = state.spriteMode === "shiny";
    dom.showShinySprites.disabled = !isGrid || isShiny;
    dom.showShinySprites.classList.toggle("is-active", isShiny);
  }
  if (dom.showMegaSprites) {
    dom.showMegaSprites.disabled = !isGrid || !hasMega;
    dom.showMegaSprites.classList.toggle("is-active", state.spriteMode === "mega");
  }
  if (dom.showGmaxSprites) {
    dom.showGmaxSprites.disabled = !isGrid || !hasGmax;
    dom.showGmaxSprites.classList.toggle("is-active", state.spriteMode === "gmax");
  }
  if (dom.showNostalgiaSprites) {
    const isNostalgia = state.spriteMode === "nostalgia";
    dom.showNostalgiaSprites.disabled = !isGrid || !hasNostalgia || isNostalgia;
    dom.showNostalgiaSprites.classList.toggle(
      "is-active",
      isNostalgia
    );
  }
}

function setSpriteMode(mode) {
  let normalized = "default";
  if (mode === "mega") {
    normalized = "mega";
  } else if (mode === "gmax") {
    normalized = "gmax";
  } else if (mode === "shiny") {
    normalized = "shiny";
  } else if (mode === "nostalgia") {
    normalized = supportsNostalgiaSprites() ? "nostalgia" : "default";
  }
  if (state.spriteMode === normalized) return;
  state.spriteMode = normalized;
  renderDex();
}

function setViewMode(mode) {
  const normalized =
    mode === VIEW_MODES.LIST
      ? VIEW_MODES.LIST
      : mode === VIEW_MODES.COMPACT
      ? VIEW_MODES.COMPACT
      : VIEW_MODES.GRID;
  if (state.viewMode === normalized) return;
  state.viewMode = normalized;
  state.currentBox = 0;
  updateViewToggleButtons();
  renderDex();
}

function changeBox(step) {
  if (!isGridView()) return;
  const total = Math.max(1, state.totalBoxes || 1);
  const next = Math.min(Math.max(state.currentBox + step, 0), total - 1);
  if (next !== state.currentBox) {
    state.currentBox = next;
    renderDex();
  } else {
    updateBoxIndicator(state.currentBox, total);
  }
}

function jumpToBox(boxNumber) {
  if (!isGridView()) {
    updateBoxIndicator(state.currentBox, state.totalBoxes || 1);
    return;
  }
  const total = Math.max(1, state.totalBoxes || 1);
  if (!Number.isFinite(boxNumber)) {
    updateBoxIndicator(state.currentBox, total);
    return;
  }
  const index = Math.min(Math.max(Math.floor(boxNumber) - 1, 0), total - 1);
  if (index !== state.currentBox) {
    state.currentBox = index;
    renderDex();
  } else {
    updateBoxIndicator(state.currentBox, total);
  }
}

function sortEncounterEntries(encounters = []) {
  return encounters
    .slice()
    .sort((a, b) => {
      const order =
        getVersionOrder(a.version || a.versionName) -
        getVersionOrder(b.version || b.versionName);
      if (order !== 0) return order;
      const nameA = normalizeVersionSlug(a.version || a.versionName);
      const nameB = normalizeVersionSlug(b.version || b.versionName);
      return nameA.localeCompare(nameB);
    });
}

function renderAvailability(container, availability = [], options = {}) {
  if (!container) return;
  const { preserveSelection = false } = options;
  container.innerHTML = "";
  const list = Array.isArray(availability) ? availability : [];
  state.detailAvailability = list;

  if (!list.length) {
    state.detailSelectedGameId = null;
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen koppelingen met geselecteerde games.";
    container.append(empty);
    updateEncounterPanel();
    return;
  }

  const sorted = [...list].sort(
    (a, b) => getGameOrder(a.gameId) - getGameOrder(b.gameId)
  );

  const hasSelection = sorted.some((entry) => entry.gameId === state.detailSelectedGameId);
  if (!preserveSelection || !hasSelection) {
    state.detailSelectedGameId = sorted[0].gameId;
  }

  sorted.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pokemon-details__game-badge";
    button.textContent = entry.gameName;
    const color = getGameColor(entry.gameId);
    button.style.setProperty("--game-color", color);
    button.style.setProperty("--game-text-color", getContrastingTextColor(color));
    const dexSummary = (entry.dexes || [])
      .map((dex) => (dex.number ? `${dex.name} — ${dex.number}` : dex.name))
      .join("\n");
    if (dexSummary) {
      button.title = dexSummary;
    }
    if (entry.gameId === state.detailSelectedGameId) {
      button.classList.add("is-active");
    }
    button.addEventListener("click", () => {
      if (state.detailSelectedGameId === entry.gameId) return;
      state.detailSelectedGameId = entry.gameId;
      renderAvailability(container, state.detailAvailability, { preserveSelection: true });
      updateEncounterPanel();
    });
    container.append(button);
  });

  updateEncounterPanel();
}

function renderEncounters(container, encounters = [], options = {}) {
  if (!container) return;
  const { gameId, availability } = options || {};
  container.innerHTML = "";
  const filtered = filterEncountersByGame(encounters, gameId);
  const sorted = sortEncounterEntries(filtered);

  if (!sorted.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = gameId
      ? "Geen vanglocaties bekend voor dit spel."
      : "Geen bekende vanglocaties.";
    container.append(empty);
    if (availability?.dexes?.length) {
      const hint = document.createElement("p");
      hint.className = "pokemon-details__empty";
      hint.textContent = `Beschikbaar via: ${availability.dexes
        .map((dex) => dex.name)
        .join(", ")}`;
      container.append(hint);
    }
    return;
  }

  sorted.forEach((entry) => {
    const details = document.createElement("details");
    details.className = "pokemon-details__encounter";

    const summary = document.createElement("summary");
    summary.className = "pokemon-details__encounter-title";
    summary.textContent = entry.versionName || entry.version || "Onbekende versie";
    details.append(summary);

    const list = document.createElement("ul");
    list.className = "pokemon-details__locations";
    (entry.locations || []).forEach((location) => {
      const item = document.createElement("li");
      const methods = (location.methods || []).filter(Boolean).join(" • ");
      item.textContent = methods
        ? `${formatLocationName(location.name)} — ${methods}`
        : formatLocationName(location.name);
      list.append(item);
    });

    details.append(list);
    container.append(details);
  });
}

function renderEvolution(container, evolution = {}, entry) {
  if (!container) return;
  container.innerHTML = "";
  const steps = Array.isArray(evolution.steps) ? evolution.steps : [];
  if (!steps.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen evolutiegegevens beschikbaar.";
    container.append(empty);
    return;
  }

  steps.forEach((step) => {
    const block = document.createElement("div");
    block.className = "pokemon-details__evolution-step";

    const spriteRow = document.createElement("div");
    spriteRow.className = "pokemon-details__evolution-sprites";

    const fromImg = document.createElement("img");
    fromImg.src = resolveEvolutionSprite(step.from);
    fromImg.alt = step.from?.name || "Onbekend";
    spriteRow.append(fromImg);

    const arrow = document.createElement("span");
    arrow.className = "pokemon-details__evolution-arrow";
    arrow.textContent = "→";
    spriteRow.append(arrow);

    const toImg = document.createElement("img");
    toImg.src = resolveEvolutionSprite(step.to);
    toImg.alt = step.to?.name || "Onbekend";
    spriteRow.append(toImg);

    block.append(spriteRow);

    const info = document.createElement("div");
    info.className = "pokemon-details__evolution-info";

    const title = document.createElement("p");
    title.className = "pokemon-details__evolution-title";
    const fromLabel = document.createElement(step.from?.isCurrent ? "strong" : "span");
    fromLabel.textContent = step.from?.name || "Onbekend";
    const toLabel = document.createElement(step.to?.isCurrent ? "strong" : "span");
    toLabel.textContent = step.to?.name || "Onbekend";
    title.append(fromLabel, document.createTextNode(" → "), toLabel);
    info.append(title);

    const methods = Array.isArray(step.methods) ? step.methods.filter(Boolean) : [];
    if (methods.length) {
      const list = document.createElement("ul");
      list.className = "pokemon-details__evolution-methods";
      methods.forEach((method) => {
        const item = document.createElement("li");
        item.textContent = method;
        list.append(item);
      });
      info.append(list);
    }

    block.append(info);
    container.append(block);
  });
}

function buildFallbackEncounters(entry, availability) {
  if (!availability || !availability.length) return [];
  const results = [];
  const seen = new Set();

  availability.forEach((gameEntry) => {
    (gameEntry.dexes || []).forEach((dex) => {
      const fallback = FALLBACK_ENCOUNTERS_BY_DEX[dex.id];
      if (!fallback) return;
      fallback.forEach((encounter) => {
        const key = `${dex.id}:${encounter.version}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push(encounter);
      });
    });
  });

  return results;
}

function computeAvailability(entry) {
  const games = getGames();
  const key = getEntryDetailKey(entry);
  if (!key || !games.length) return [];

  return games
    .map((game) => {
      const dexes = (game.dexes || []).filter((dex) => {
        if (!Array.isArray(dex.entries)) return false;
        if (dex.id && dex.id.endsWith("-all")) return false;
        return dex.entries.some((dexEntry) => dexEntry.key === key);
      });
      if (!dexes.length) return null;
      return {
        gameId: game.id,
        gameName: game.name,
        dexes: dexes.map((dex) => {
          const entryMatch = dex.entries.find((dexEntry) => dexEntry.key === key);
          return {
            id: dex.id,
            name: dex.name,
            number:
              entryMatch?.displayNumber ||
              entryMatch?.displayNationalNumber ||
              entryMatch?.displayDexNumber ||
              entryMatch?.displayNumber ||
              "",
          };
        }),
      };
    })
    .filter(Boolean);
}

function showPokemonDetailsLoading(entry, availability) {
  if (!entry || !dom.detailsDialog) return;
  if (dom.detailName) dom.detailName.textContent = entry.name;
  if (dom.detailNumber) {
    dom.detailNumber.textContent =
      entry.displayNumber || entry.displayNationalNumber || entry.displayDexNumber || "";
  }

  const cached = getCachedPokemonDetails(entry) || {};
  if (dom.detailTypes) {
    renderTypeBadges(dom.detailTypes, cached.types || entry.types || []);
  }
  if (dom.detailTypeChart) {
    renderTypeEffectiveness(dom.detailTypeChart, cached.types || entry.types || []);
  }
  if (cached?.types?.length || entry.types?.length) {
    updateEntryTypes(entry, cached.types || entry.types || []);
  }

  if (dom.detailArtwork) {
    const spriteUrl =
      cached?.sprites?.artwork ||
      cached?.sprites?.home ||
      resolveSprite(entry, cached, { preferHome: true });
    dom.detailArtwork.src = spriteUrl || "";
    dom.detailArtwork.alt = `${entry.name} artwork`;
  }

  if (dom.detailCategory) {
    dom.detailCategory.textContent = "";
  }
  if (dom.detailAbilities) {
    renderAbilities(dom.detailAbilities, []);
  }
  if (dom.detailStats) {
    renderStats(dom.detailStats, []);
  }

  if (dom.detailHeight) dom.detailHeight.textContent = "Laden…";
  if (dom.detailWeight) dom.detailWeight.textContent = "Laden…";

  state.detailEncountersLoading = true;
  state.detailEncounters = [];
  state.detailAvailability = Array.isArray(availability) ? availability : [];
  state.detailSelectedGameId = null;
  renderAvailability(dom.detailGames, availability);

  if (dom.detailEncounters) {
    updateEncounterPanel();
  }

  if (dom.detailEvolution) {
    dom.detailEvolution.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailEvolution.append(loading);
  }

  if (dom.detailForms) {
    dom.detailForms.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailForms.append(loading);
  }

  if (dom.detailGallery) {
    dom.detailGallery.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailGallery.append(loading);
  }

  if (dom.detailEntries) {
    dom.detailEntries.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailEntries.append(loading);
  }

  if (dom.detailSerebii) {
    dom.detailSerebii.href = "#";
    dom.detailSerebii.setAttribute("aria-disabled", "true");
  }
  if (dom.detailBulbapedia) {
    dom.detailBulbapedia.href = "#";
    dom.detailBulbapedia.setAttribute("aria-disabled", "true");
  }
}

function applyPokemonDetails(entry, details, availability) {
  if (!details) return;
  if (dom.detailName) dom.detailName.textContent = details.name || entry.name;
  if (dom.detailNumber) {
    dom.detailNumber.textContent =
      entry.displayNumber || entry.displayNationalNumber || entry.displayDexNumber || "";
  }
  const resolvedTypes = details.types || entry.types || [];
  if (dom.detailTypes) {
    renderTypeBadges(dom.detailTypes, resolvedTypes);
  }
  if (dom.detailTypeChart) {
    renderTypeEffectiveness(dom.detailTypeChart, resolvedTypes);
  }
  updateEntryTypes(entry, resolvedTypes);

  if (dom.detailArtwork) {
    const spriteUrl =
      details.sprites?.artwork ||
      details.sprites?.home ||
      resolveSprite(entry, details, { preferHome: true });
    if (spriteUrl) {
      dom.detailArtwork.src = spriteUrl;
    }
  }
  if (dom.detailHeight) {
    dom.detailHeight.textContent = formatHeight(details.height);
  }
  if (dom.detailWeight) {
    dom.detailWeight.textContent = formatWeight(details.weight);
  }

  if (dom.detailCategory) {
    dom.detailCategory.textContent = details.category || "";
  }
  if (dom.detailAbilities) {
    renderAbilities(dom.detailAbilities, details.abilities || []);
  }
  if (dom.detailStats) {
    renderStats(dom.detailStats, details.stats || []);
  }

  const links = buildExternalLinks(entry);
  if (dom.detailSerebii) {
    dom.detailSerebii.href = links.serebii || "#";
    if (links.serebii && links.serebii !== "#") {
      dom.detailSerebii.setAttribute("aria-disabled", "false");
    } else {
      dom.detailSerebii.setAttribute("aria-disabled", "true");
    }
  }
  if (dom.detailBulbapedia) {
    dom.detailBulbapedia.href = links.bulbapedia || "#";
    if (links.bulbapedia && links.bulbapedia !== "#") {
      dom.detailBulbapedia.setAttribute("aria-disabled", "false");
    } else {
      dom.detailBulbapedia.setAttribute("aria-disabled", "true");
    }
  }

  const forms = buildFormDefinitions(entry, details);
  renderForms(dom.detailForms, forms);
  renderGallery(dom.detailGallery, buildGallerySources(entry, details, forms));
  renderPokedexEntries(dom.detailEntries, details.pokedexEntries || []);

  const manualFallback = buildFallbackEncounters(entry, availability);
  const encounters = details.encounters && details.encounters.length
    ? details.encounters
    : manualFallback;
  state.detailEncountersLoading = false;
  state.detailAvailability = Array.isArray(availability) ? availability : [];
  state.detailEncounters = encounters;
  renderAvailability(dom.detailGames, availability, { preserveSelection: true });
  updateEncounterPanel();

  renderEvolution(dom.detailEvolution, details.evolution || {}, entry);
}

function showPokemonDetailsError(message) {
  state.detailEncountersLoading = false;
  state.detailEncounters = [];
  if (dom.detailEncounters) {
    dom.detailEncounters.innerHTML = "";
    const error = document.createElement("p");
    error.className = "pokemon-details__empty";
    error.textContent = message;
    dom.detailEncounters.append(error);
  }
  if (dom.detailEvolution) {
    dom.detailEvolution.innerHTML = "";
    const error = document.createElement("p");
    error.className = "pokemon-details__empty";
    error.textContent = message;
    dom.detailEvolution.append(error);
  }
}

async function openPokemonDetails(entry) {
  if (!entry || !dom.detailsDialog) return;
  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const availability = computeAvailability(entry);
  showPokemonDetailsLoading(entry, availability);
  if (!dom.detailsDialog.open) {
    dom.detailsDialog.showModal();
  }

  const cached = getCachedPokemonDetails(entry);
  if (cached) {
    applyPokemonDetails(entry, cached, availability);
  }

  try {
    const details = await ensurePokemonDetails(entry);
    if (!details) {
      showPokemonDetailsError("Kon details niet laden.");
      return;
    }
    applyPokemonDetails(entry, details, availability);
  } catch (error) {
    showPokemonDetailsError("Kon details niet laden.");
  }
}

function closePokemonDetails() {
  if (dom.detailsDialog?.open) {
    dom.detailsDialog.close();
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function setupDetailsDialog() {
  if (!dom.detailsDialog) return;
  if (dom.closePokemonDetails) {
    dom.closePokemonDetails.addEventListener("click", () => {
      closePokemonDetails();
    });
  }
  dom.detailsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePokemonDetails();
  });
}

function formatHeight(decimeters) {
  if (!Number.isFinite(decimeters)) return "-";
  const meters = decimeters / 10;
  return `${meters.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} m`;
}

function formatWeight(hectograms) {
  if (!Number.isFinite(hectograms)) return "-";
  const kilograms = hectograms / 10;
  return `${kilograms.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kg`;
}

function normalizeStoredIds(ids) {
  if (!Array.isArray(ids)) return new Set();
  return new Set(
    ids
      .map((value) => {
        if (typeof value === "number") return String(value);
        if (typeof value === "string") return value;
        return null;
      })
      .filter(Boolean)
  );
}

function loadLegacyState() {
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") continue;
      return Object.fromEntries(
        Object.entries(parsed).map(([gameId, ids]) => [
          gameId,
          Array.isArray(ids) ? new Set(ids.map((value) => String(value))) : new Set(),
        ])
      );
    } catch (error) {
      console.warn("Kon legacy voortgang niet laden:", error);
    }
  }
  return null;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.caughtByGame = Object.fromEntries(
          Object.entries(parsed).map(([gameId, ids]) => [
            gameId,
            normalizeStoredIds(ids),
          ])
        );
      }
    }

    if (!Object.keys(state.caughtByGame).length) {
      const legacy = loadLegacyState();
      if (legacy) {
        state.caughtByGame = legacy;
      }
    }

    const storedDexSelection = localStorage.getItem(DEX_SELECTION_STORAGE_KEY);
    if (storedDexSelection) {
      try {
        const selection = JSON.parse(storedDexSelection);
        if (selection && typeof selection === "object") {
          state.selectedDexByGame = Object.fromEntries(
            Object.entries(selection).map(([gameId, dexId]) => [gameId, String(dexId)])
          );
        }
      } catch (error) {
        console.warn("Kon dex selectie niet laden:", error);
      }
    }
  } catch (error) {
    console.warn("Kon lokale data niet laden:", error);
  }
}

function persistState() {
  try {
    const serializable = Object.fromEntries(
      Object.entries(state.caughtByGame).map(([gameId, idSet]) => [
        gameId,
        Array.from(idSet.values()),
      ])
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    LEGACY_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn("Kon legacy opslag niet verwijderen:", error);
      }
    });
  } catch (error) {
    console.warn("Kon voortgang niet opslaan:", error);
  }
}

function persistDexSelection() {
  try {
    localStorage.setItem(
      DEX_SELECTION_STORAGE_KEY,
      JSON.stringify(state.selectedDexByGame)
    );
  } catch (error) {
    console.warn("Kon dex selectie niet opslaan:", error);
  }
}

function populateGameSelect() {
  const games = getGames();
  if (dom.gameSelect) {
    dom.gameSelect.innerHTML = "";
    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = game.name;
      dom.gameSelect.append(option);
    });

    if (games.length) {
      const storedGame = localStorage.getItem(`${STORAGE_KEY}:current-game`);
      const defaultGame =
        storedGame && games.some((game) => game.id === storedGame)
          ? storedGame
          : games[0].id;
      dom.gameSelect.value = defaultGame;
      state.currentGameId = defaultGame;
    }
  }
}

function populateDexSelect() {
  if (!dom.dexSelect) return;
  const currentGame = getCurrentGame();
  dom.dexSelect.innerHTML = "";
  if (!currentGame) {
    state.currentDexId = null;
    return;
  }

  const dexes = getDexesForGame(currentGame);
  dexes.forEach((dex) => {
    const option = document.createElement("option");
    option.value = dex.id;
    option.textContent = dex.name;
    dom.dexSelect.append(option);
  });

  if (!dexes.length) {
    state.currentDexId = null;
    return;
  }

  const storedDexId = state.selectedDexByGame[currentGame.id];
  const defaultDex =
    storedDexId && dexes.some((dex) => dex.id === storedDexId)
      ? storedDexId
      : dexes[0].id;
  dom.dexSelect.value = defaultDex;
  setCurrentDex(defaultDex, false);
  persistDexSelection();
}

function getFilteredEntries() {
  return getFilterContext().filteredEntries;
}

function getFilterContext() {
  const currentDex = getCurrentDex();
  const baseEntries = Array.isArray(currentDex?.entries) ? currentDex.entries : [];
  const baseAvailability = computeSpecialAvailability(baseEntries);
  const searchTerm = state.filters.search || "";
  const caughtSet = getCaughtSet(state.currentGameId);
  const searchEntries = baseEntries.filter((entry) => matchesSearch(entry, searchTerm));
  const activeSpecialFilter = resolveActiveSpecialFilter(baseAvailability);
  const specialFiltered = applySpecialFormFilter(searchEntries, activeSpecialFilter);
  const filteredEntries = applyCaughtFilter(specialFiltered, caughtSet);
  return {
    baseEntries,
    searchEntries,
    filteredEntries,
    baseAvailability,
    caughtSet,
  };
}

function updateDexProgress(entries = [], caughtSet = new Set()) {
  if (!dom.dexProgress) return;
  const total = Array.isArray(entries) ? entries.length : 0;
  if (!total) {
    dom.dexProgress.hidden = true;
    if (dom.dexProgressBar) {
      dom.dexProgressBar.value = 0;
      dom.dexProgressBar.max = 0;
    }
    if (dom.dexProgressText) {
      dom.dexProgressText.textContent = "0 / 0 gevangen";
    }
    return;
  }

  let caught = 0;
  entries.forEach((entry) => {
    const key = getEntryCatchKey(entry);
    if (!key) return;
    if (caughtSet.has(String(key))) {
      caught += 1;
    }
  });

  dom.dexProgress.hidden = false;
  if (dom.dexProgressText) {
    dom.dexProgressText.textContent = `${caught} / ${total} gevangen`;
  }
  if (dom.dexProgressBar) {
    dom.dexProgressBar.max = total;
    dom.dexProgressBar.value = caught;
    const percentage = total ? Math.round((caught / total) * 100) : 0;
    dom.dexProgressBar.textContent = `${percentage}%`;
  }
}

function renderDex() {
  const currentGame = getCurrentGame();
  if (!currentGame) {
    if (dom.dexGrid) dom.dexGrid.innerHTML = "<p>Geen spel geselecteerd.</p>";
    if (dom.dexListBody) dom.dexListBody.innerHTML = "";
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    updateSpecialFilterControl({ mega: false, gmax: false });
    updateSpriteModeActions({ mega: false, gmax: false });
    updateDexProgress([], new Set());
    updateViewToggleButtons();
    updateBoxControls();
    return;
  }

  const currentDex = getCurrentDex();
  if (!currentDex) {
    if (dom.dexGrid) dom.dexGrid.innerHTML = "<p>Geen Pokédex beschikbaar.</p>";
    if (dom.dexListBody) dom.dexListBody.innerHTML = "";
    if (dom.emptyDialog?.open) dom.emptyDialog.close();
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    updateSpecialFilterControl({ mega: false, gmax: false });
    updateSpriteModeActions({ mega: false, gmax: false });
    updateDexProgress([], new Set());
    updateViewToggleButtons();
    updateBoxControls();
    return;
  }

  const context = getFilterContext();
  resolveSpriteMode(context.baseAvailability);
  updateSpecialFilterControl(context.baseAvailability);
  updateSpriteModeActions(context.baseAvailability);
  updateDexProgress(context.baseEntries, context.caughtSet);

  const entries = context.filteredEntries;
  if (!entries.length) {
    if (dom.dexGrid) dom.dexGrid.innerHTML = "";
    if (dom.dexListBody) dom.dexListBody.innerHTML = "";
    if (dom.emptyDialog && !dom.emptyDialog.open) {
      dom.emptyDialog.showModal();
    }
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    updateDexProgress([], context.caughtSet);
    updateViewToggleButtons();
    updateBoxControls();
    return;
  }

  if (dom.emptyDialog?.open) dom.emptyDialog.close();

  const ordered = state.sort === "dex" ? entries : sortEntries(entries);

  if (isGridView()) {
    const totalBoxes = Math.max(1, Math.ceil(ordered.length / BOX_SIZE));
    if (state.currentBox >= totalBoxes) {
      state.currentBox = totalBoxes - 1;
    }
    state.totalBoxes = totalBoxes;
    const start = state.currentBox * BOX_SIZE;
    const end = start + BOX_SIZE;
    const subset = ordered.slice(start, end);
    renderGrid(subset, context.caughtSet);
    updateBoxIndicator(state.currentBox, totalBoxes);
  } else {
    state.totalBoxes = 1;
    renderList(ordered, context.caughtSet);
    if (dom.dexGrid) dom.dexGrid.innerHTML = "";
    updateBoxIndicator(0, 1);
  }

  updateViewToggleButtons();
  updateBoxControls();
}

function onGameChange(event) {
  state.currentGameId = event.target.value;
  state.currentBox = 0;
  localStorage.setItem(`${STORAGE_KEY}:current-game`, state.currentGameId);
  populateDexSelect();
  renderDex();
}

function onDexChange(event) {
  setCurrentDex(event.target.value);
  state.currentBox = 0;
  renderDex();
}

function onSearchInput(event) {
  state.filters.search = event.target.value.toLowerCase();
  state.currentBox = 0;
  renderDex();
}

function onSortChange(event) {
  state.sort = event.target.value;
  state.currentBox = 0;
  renderDex();
}

function onCaughtFilterChange(event) {
  state.caughtFilter = event.target.value;
  state.currentBox = 0;
  renderDex();
}

function onSpecialFilterChange(event) {
  state.specialFilter = event.target.value || "all";
  state.currentBox = 0;
  renderDex();
}

function onBoxInputChange(event) {
  const value = Number.parseInt(event.target.value, 10);
  if (Number.isNaN(value)) {
    updateBoxIndicator(state.currentBox, state.totalBoxes || 1);
    return;
  }
  jumpToBox(value);
}

function onBoxInputKeyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const value = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(value)) {
      jumpToBox(value);
    }
  }
}

function setupDialog() {
  if (!dom.emptyDialog) return;
  if (dom.closeEmptyResults) {
    dom.closeEmptyResults.addEventListener("click", () => {
      dom.emptyDialog.close();
      dom.searchInput?.focus();
    });
  }
  dom.emptyDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dom.emptyDialog.close();
  });
}

async function init() {
  if (dom.dexGrid) {
    dom.dexGrid.innerHTML = '<p class="loading-message">Pokédexgegevens laden…</p>';
  }

  let data;
  try {
    data = await ensurePokedexData();
    if (!data || !Array.isArray(data.games) || !data.games.length) {
      if (dom.dexGrid) {
        dom.dexGrid.innerHTML =
          "<p>Geen Pokédex data beschikbaar. Controleer je internetverbinding.</p>";
      }
      return;
    }
  } catch (error) {
    console.error("Kon Pokédex data niet laden:", error);
    if (dom.dexGrid) {
      dom.dexGrid.innerHTML =
        "<p>Kon Pokédex data niet laden. Controleer je internetverbinding en probeer opnieuw.</p>";
    }
    return;
  }

  state.variantsBySpecies = {
    mega: data?.variants?.mega || {},
    gmax: data?.variants?.gmax || {},
  };
  state.variantDefinitionMap = buildVariantDefinitionMap(data?.variants?.all || []);

  loadState();
  populateGameSelect();
  populateDexSelect();
  setupDialog();
  setupDetailsDialog();

  if (dom.gameSelect) {
    dom.gameSelect.addEventListener("change", onGameChange);
  }
  if (dom.dexSelect) {
    dom.dexSelect.addEventListener("change", onDexChange);
  }
  dom.searchInput?.addEventListener("input", onSearchInput);
  dom.sortSelect?.addEventListener("change", onSortChange);
  dom.caughtFilter?.addEventListener("change", onCaughtFilterChange);
  dom.specialFilter?.addEventListener("change", onSpecialFilterChange);
  dom.viewGridToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.GRID));
  dom.viewCompactToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.COMPACT));
  dom.viewListToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.LIST));
  dom.selectAll?.addEventListener("click", selectAllVisible);
  dom.clearAll?.addEventListener("click", clearAllVisible);
  dom.previousBox?.addEventListener("click", () => changeBox(-1));
  dom.nextBox?.addEventListener("click", () => changeBox(1));
  dom.boxInput?.addEventListener("change", onBoxInputChange);
  dom.boxInput?.addEventListener("keydown", onBoxInputKeyDown);
  dom.showDefaultSprites?.addEventListener("click", () => setSpriteMode("default"));
  dom.showShinySprites?.addEventListener("click", () => setSpriteMode("shiny"));
  dom.showMegaSprites?.addEventListener("click", () => setSpriteMode("mega"));
  dom.showGmaxSprites?.addEventListener("click", () => setSpriteMode("gmax"));
  dom.showNostalgiaSprites?.addEventListener("click", () => setSpriteMode("nostalgia"));

  renderDex();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
