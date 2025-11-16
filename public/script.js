
const BOX_SIZE = 30;
const STORAGE_KEY = "living-dex-state-v2";
const LEGACY_STORAGE_KEYS = ["living-dex-state-v1"];
const FLAG_STORAGE_KEY = "living-dex-flags-v1";
const GAME_NOTES_STORAGE_KEY = `${STORAGE_KEY}:game-notes`;
const THEME_STORAGE_KEY = "living-dex-theme";
const CONTROLS_COLLAPSE_STORAGE_KEY = "living-dex-controls-collapsed";
const FLAG_KEYS = ["shiny", "mega", "gmax", "alpha"];
const FLAG_LABELS = {
  shiny: "Shiny",
  mega: "Mega",
  gmax: "G-Max",
  alpha: "Alpha",
};
const FLAG_ICONS = {
  shiny: "✧",
  mega: "M",
  gmax: "G",
  alpha: "α",
};
const API_BASE_URL = "https://pokeapi.co/api/v2";
const GENDER_DEX_ID = "home-gender";
const GENDER_DIFFERENCE_CACHE_KEY = "gender-difference-species-v1";
const VERSION_BADGE_STYLES = {
  scarlet: { label: "Scarlet", color: "#d2483c" },
  violet: { label: "Violet", color: "#6b4bd6" },
  sword: { label: "Sword", color: "#2d8fe5" },
  shield: { label: "Shield", color: "#c54d8c" },
  "lets-go-pikachu": {
    label: "LG Pikachu",
    color: "#f6c445",
    textColor: "#3a2800",
  },
  "lets-go-eevee": {
    label: "LG Eevee",
    color: "#c4874a",
    textColor: "#2b1800",
  },
  "brilliant-diamond": { label: "Brilliant Diamond", color: "#4cb3ff" },
  "shining-pearl": {
    label: "Shining Pearl",
    color: "#f3b1d5",
    textColor: "#4a1031",
  },
  diamond: { label: "Diamond", color: "#5dade2" },
  pearl: { label: "Pearl", color: "#f0b9d0", textColor: "#4e1231" },
  ruby: { label: "Ruby", color: "#d84315" },
  sapphire: { label: "Sapphire", color: "#1565c0" },
  "omega-ruby": { label: "Omega Ruby", color: "#ba2d32" },
  "alpha-sapphire": { label: "Alpha Sapphire", color: "#1c79c0" },
  "fire-red": { label: "FireRed", color: "#e53935" },
  "leaf-green": { label: "LeafGreen", color: "#43a047" },
  gold: { label: "Gold", color: "#c69320" },
  silver: { label: "Silver", color: "#a0b2c2", textColor: "#0c1b2a" },
  heartgold: { label: "HeartGold", color: "#c7902f" },
  soulsilver: { label: "SoulSilver", color: "#90a4ae", textColor: "#0d1b2a" },
  red: { label: "Red", color: "#c62828" },
  blue: { label: "Blue", color: "#1e88e5" },
  sun: { label: "Sun", color: "#ff8f00" },
  moon: { label: "Moon", color: "#5c6bc0" },
  "ultra-sun": { label: "Ultra Sun", color: "#f57c00" },
  "ultra-moon": { label: "Ultra Moon", color: "#7e57c2" },
  x: { label: "Pokémon X", color: "#1e88e5" },
  y: { label: "Pokémon Y", color: "#c62828" },
  black: { label: "Black", color: "#212121" },
  white: { label: "White", color: "#f5f5f5", textColor: "#1f1f1f" },
  "black-2": { label: "Black 2", color: "#424242" },
  "white-2": { label: "White 2", color: "#ededed", textColor: "#1f1f1f" },
};
const GMAX_FLAG_GAMES = new Set(["sword-shield", "pokemon-home"]);
const MEGA_FLAG_GAMES = new Set([
  "x-y",
  "sun-moon",
  "ultra-sun-moon",
  "omega-ruby-alpha-sapphire",
  "lets-go",
  "legends-za",
  "pokemon-home",
]);
const ALPHA_FLAG_GAMES = new Set(["legends-arceus", "legends-za"]);

const DATA_EXPORT_VERSION = 1;

const VIEW_MODES = {
  GRID: "grid",
  COMPACT: "compact",
  LIST: "list",
};

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const dom = {
  controls: document.querySelector(".controls"),
  appHeader: document.querySelector(".app-header"),
  appMain: document.querySelector(".app-main"),
  appFooter: document.querySelector(".app-footer"),
  gameSelect: document.getElementById("game-select"),
  dexSelect: document.getElementById("dex-select"),
  searchInput: document.getElementById("search-input"),
  gameNotes: document.getElementById("game-notes"),
  controlsCollapsible: document.getElementById("controls-collapsible"),
  controlsToggle: document.getElementById("controls-collapse"),
  controlsToggleText: document.getElementById("controls-collapse-text"),
  sortSelect: document.getElementById("sort-select"),
  caughtFilter: document.getElementById("caught-filter"),
  specialFilter: document.getElementById("special-filter"),
  specialFilterControl: document.getElementById("special-filter-control"),
  themeToggle: document.getElementById("toggle-theme"),
  viewGridToggle: document.getElementById("view-grid"),
  viewCompactToggle: document.getElementById("view-compact"),
  viewListToggle: document.getElementById("view-list"),
  selectAll: document.getElementById("select-all"),
  clearAll: document.getElementById("clear-all"),
  exportData: document.getElementById("export-data"),
  importData: document.getElementById("import-data"),
  importDataInput: document.getElementById("import-data-input"),
  spriteModeActions: document.getElementById("sprite-mode-actions"),
  showDefaultSprites: document.getElementById("show-default-sprites"),
  showShinySprites: document.getElementById("show-shiny-sprites"),
  showMegaSprites: document.getElementById("show-mega-sprites"),
  showGmaxSprites: document.getElementById("show-gmax-sprites"),
  showNostalgiaSprites: document.getElementById("show-nostalgia-sprites"),
  genderSpriteToggle: document.getElementById("gender-sprite-toggle"),
  showGenderMale: document.getElementById("show-gender-male"),
  showGenderFemale: document.getElementById("show-gender-female"),
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
  detailSprite: document.getElementById("pokemon-detail-sprite"),
  detailHeight: document.getElementById("pokemon-detail-height"),
  detailWeight: document.getElementById("pokemon-detail-weight"),
  detailLinks: document.getElementById("pokemon-detail-links"),
  detailVersions: document.getElementById("pokemon-detail-versions"),
  detailEvolution: document.getElementById("pokemon-detail-evolution"),
  detailVariants: document.getElementById("pokemon-detail-variants"),
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
  genderDexSpriteMode: "male",
  theme: THEMES.LIGHT,
  controlsCollapsed: false,
  filters: {
    search: "",
  },
  caughtByGame: {},
  selectedDexByGame: {},
  gameNotesByGame: {},
  variantsBySpecies: { mega: {}, gmax: {}, special: {} },
  variantDefinitionMap: new Map(),
  flagSets: {
    shiny: {},
    mega: {},
    gmax: {},
    alpha: {},
  },
  variantGroupsBySpecies: new Map(),
  entryCache: new Map(),
  pokedexData: null,
  genderDex: {
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: { processed: 0, total: 0 },
    speciesSet: null,
  },
};

let compactHeightRaf = null;

function applyTheme(theme) {
  const normalized = theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
  state.theme = normalized;
  if (document.documentElement) {
    document.documentElement.dataset.theme = normalized;
  }
  if (dom.themeToggle) {
    const isDark = normalized === THEMES.DARK;
    dom.themeToggle.setAttribute("aria-pressed", String(isDark));
    dom.themeToggle.classList.toggle("is-active", isDark);
    dom.themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
  }
}

function loadThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEMES.DARK) {
      state.theme = THEMES.DARK;
    }
  } catch (error) {
    console.warn("Could not load theme:", error);
  }
  applyTheme(state.theme);
}

function toggleTheme() {
  const next = state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  applyTheme(next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch (error) {
    console.warn("Could not save theme:", error);
  }
}

function applyControlsCollapsed(collapsed) {
  const isCollapsed = Boolean(collapsed);
  state.controlsCollapsed = isCollapsed;
  dom.controls?.classList.toggle("controls--collapsed", isCollapsed);
  if (dom.controlsCollapsible) {
    dom.controlsCollapsible.hidden = isCollapsed;
  }
  if (dom.controlsToggle) {
    dom.controlsToggle.setAttribute("aria-expanded", String(!isCollapsed));
  }
  if (dom.controlsToggleText) {
    dom.controlsToggleText.textContent = isCollapsed
      ? "Expand filters"
      : "Collapse filters";
  }
  if (state.viewMode === VIEW_MODES.COMPACT) {
    scheduleCompactViewportMeasurement();
  }
}

function loadControlsCollapsePreference() {
  let collapsed = false;
  try {
    collapsed = localStorage.getItem(CONTROLS_COLLAPSE_STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Could not load filter preference:", error);
  }
  applyControlsCollapsed(collapsed);
}

function toggleControlsCollapsed() {
  const next = !state.controlsCollapsed;
  applyControlsCollapsed(next);
  try {
    localStorage.setItem(CONTROLS_COLLAPSE_STORAGE_KEY, next ? "true" : "false");
  } catch (error) {
    console.warn("Could not save filter preference:", error);
  }
}

function loadUiPreferences() {
  loadThemePreference();
  loadControlsCollapsePreference();
}

function clearCompactViewportHeight() {
  if (compactHeightRaf) {
    cancelAnimationFrame(compactHeightRaf);
    compactHeightRaf = null;
  }
  if (document.documentElement) {
    document.documentElement.style.removeProperty("--compact-grid-height");
  }
}

function measureCompactViewportHeight() {
  if (state.viewMode !== VIEW_MODES.COMPACT) return;
  const main = dom.appMain;
  if (!main) return;
  const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 0;
  const headerHeight = dom.appHeader?.offsetHeight || 0;
  const footerHeight = dom.appFooter?.offsetHeight || 0;
  const controlsHeight = dom.controls?.offsetHeight || 0;
  const mainStyles = window.getComputedStyle(main);
  const paddingTop = Number.parseFloat(mainStyles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(mainStyles.paddingBottom) || 0;
  const mainGap = Number.parseFloat(mainStyles.rowGap || mainStyles.gap || 0);
  const availableSpace =
    viewportHeight -
    headerHeight -
    footerHeight -
    controlsHeight -
    paddingTop -
    paddingBottom -
    mainGap;
  const fallback = Math.max(viewportHeight * 0.45, 240);
  const hasRoom = availableSpace > 0;
  const resolvedHeight = hasRoom ? availableSpace : fallback;
  if (document.body) {
    if (hasRoom) {
      document.body.dataset.compactLock = "true";
    } else {
      delete document.body.dataset.compactLock;
    }
  }
  document.documentElement?.style.setProperty(
    "--compact-grid-height",
    `${Math.round(resolvedHeight)}px`
  );
}

function scheduleCompactViewportMeasurement() {
  if (state.viewMode !== VIEW_MODES.COMPACT) {
    document.body?.classList.remove("is-compact-grid");
    if (document.body?.dataset?.compactLock) {
      delete document.body.dataset.compactLock;
    }
    clearCompactViewportHeight();
    return;
  }
  if (!document.body?.classList.contains("is-compact-grid")) {
    document.body?.classList.add("is-compact-grid");
  }
  if (compactHeightRaf) {
    cancelAnimationFrame(compactHeightRaf);
  }
  compactHeightRaf = requestAnimationFrame(() => {
    compactHeightRaf = null;
    measureCompactViewportHeight();
  });
}

function handleViewModeChromeChange() {
  if (state.viewMode === VIEW_MODES.COMPACT) {
    scheduleCompactViewportMeasurement();
  } else {
    document.body?.classList.remove("is-compact-grid");
    if (document.body?.dataset?.compactLock) {
      delete document.body.dataset.compactLock;
    }
    clearCompactViewportHeight();
  }
}

function onWindowResize() {
  if (state.viewMode === VIEW_MODES.COMPACT) {
    scheduleCompactViewportMeasurement();
  }
}

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

const VERSION_NAME_OVERRIDES = {
  scarlet: "Scarlet",
  violet: "Violet",
  sword: "Sword",
  shield: "Shield",
  red: "Red",
  blue: "Blue",
  gold: "Gold",
  silver: "Silver",
  crystal: "Crystal",
  ruby: "Ruby",
  sapphire: "Sapphire",
  emerald: "Emerald",
  "fire-red": "FireRed",
  "leaf-green": "LeafGreen",
  diamond: "Diamond",
  pearl: "Pearl",
  platinum: "Platinum",
  heartgold: "HeartGold",
  soulsilver: "SoulSilver",
  black: "Black",
  white: "White",
  x: "Pokémon X",
  y: "Pokémon Y",
  sun: "Sun",
  moon: "Moon",
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
  mega: { symbol: "M", className: "special-icon--mega", label: "Mega evolution" },
  gmax: { symbol: "G", className: "special-icon--gmax", label: "Gigantamax" },
  special: { symbol: "S", className: "special-icon--special", label: "Special form" },
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

const VERSION_TO_GAME = new Map([
  ["red", { gameId: "red-blue-yellow", gameName: "Red, Blue & Yellow" }],
  ["blue", { gameId: "red-blue-yellow", gameName: "Red, Blue & Yellow" }],
  ["yellow", { gameId: "red-blue-yellow", gameName: "Red, Blue & Yellow" }],
  ["gold", { gameId: "gold-silver-crystal", gameName: "Gold, Silver & Crystal" }],
  ["silver", { gameId: "gold-silver-crystal", gameName: "Gold, Silver & Crystal" }],
  ["crystal", { gameId: "gold-silver-crystal", gameName: "Gold, Silver & Crystal" }],
  ["ruby", { gameId: "ruby-sapphire", gameName: "Ruby & Sapphire" }],
  ["sapphire", { gameId: "ruby-sapphire", gameName: "Ruby & Sapphire" }],
  ["emerald", { gameId: "emerald", gameName: "Emerald" }],
  ["fire-red", { gameId: "firered-leafgreen", gameName: "FireRed & LeafGreen" }],
  ["leaf-green", { gameId: "firered-leafgreen", gameName: "FireRed & LeafGreen" }],
  ["diamond", { gameId: "diamond-pearl", gameName: "Diamond & Pearl" }],
  ["pearl", { gameId: "diamond-pearl", gameName: "Diamond & Pearl" }],
  ["platinum", { gameId: "platinum", gameName: "Platinum" }],
  ["heartgold", { gameId: "heartgold-soulsilver", gameName: "HeartGold & SoulSilver" }],
  ["soulsilver", { gameId: "heartgold-soulsilver", gameName: "HeartGold & SoulSilver" }],
  ["black", { gameId: "black-white", gameName: "Black & White" }],
  ["white", { gameId: "black-white", gameName: "Black & White" }],
  ["black-2", { gameId: "black-2-white-2", gameName: "Black 2 & White 2" }],
  ["white-2", { gameId: "black-2-white-2", gameName: "Black 2 & White 2" }],
  ["x", { gameId: "x-y", gameName: "X & Y" }],
  ["y", { gameId: "x-y", gameName: "X & Y" }],
  ["omega-ruby", { gameId: "omega-ruby-alpha-sapphire", gameName: "Omega Ruby & Alpha Sapphire" }],
  ["alpha-sapphire", { gameId: "omega-ruby-alpha-sapphire", gameName: "Omega Ruby & Alpha Sapphire" }],
  ["sun", { gameId: "sun-moon", gameName: "Sun & Moon" }],
  ["moon", { gameId: "sun-moon", gameName: "Sun & Moon" }],
  ["ultra-sun", { gameId: "ultra-sun-moon", gameName: "Ultra Sun & Ultra Moon" }],
  ["ultra-moon", { gameId: "ultra-sun-moon", gameName: "Ultra Sun & Ultra Moon" }],
  ["lets-go-pikachu", { gameId: "lets-go", gameName: "Let's Go Pikachu & Eevee" }],
  ["lets-go-eevee", { gameId: "lets-go", gameName: "Let's Go Pikachu & Eevee" }],
  ["sword", { gameId: "sword-shield", gameName: "Sword & Shield" }],
  ["shield", { gameId: "sword-shield", gameName: "Sword & Shield" }],
  ["isle-of-armor", { gameId: "sword-shield", gameName: "Sword & Shield" }],
  ["crown-tundra", { gameId: "sword-shield", gameName: "Sword & Shield" }],
  ["brilliant-diamond", { gameId: "brilliant-diamond-pearl", gameName: "Brilliant Diamond & Shining Pearl" }],
  ["shining-pearl", { gameId: "brilliant-diamond-pearl", gameName: "Brilliant Diamond & Shining Pearl" }],
  ["legends-arceus", { gameId: "legends-arceus", gameName: "Legends Arceus" }],
  ["scarlet", { gameId: "scarlet-violet", gameName: "Scarlet & Violet" }],
  ["violet", { gameId: "scarlet-violet", gameName: "Scarlet & Violet" }],
  ["teal-mask", { gameId: "scarlet-violet", gameName: "Scarlet & Violet" }],
  ["indigo-disk", { gameId: "scarlet-violet", gameName: "Scarlet & Violet" }],
  ["home", { gameId: "pokemon-home", gameName: "Pokémon HOME" }],
]);

const GAME_RELEASE_ORDER_MAP = new Map();
VERSION_RELEASE_ORDER.forEach((version, index) => {
  const group = VERSION_TO_GAME.get(version);
  if (!group) return;
  const existing = GAME_RELEASE_ORDER_MAP.get(group.gameId);
  if (existing === undefined || index < existing) {
    GAME_RELEASE_ORDER_MAP.set(group.gameId, index);
  }
});

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
        { name: "West & North Province", methods: ["Habitat exploration"] },
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
        { name: "Timeless Woods", methods: ["Night spawns & events"] },
        { name: "Crystal Pool", methods: ["Special encounters"] },
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
        { name: "BB Quests", methods: ["Blueberry Quests rewards"] },
      ],
    },
  ],
  "scarlet-violet-other": [
    {
      version: "scarlet",
      versionName: "Scarlet",
      locations: [
        { name: "Tera Raid Dens", methods: ["5★-7★ events"] },
        { name: "Blueberry Academy", methods: ["BB Quests & legendary excursions"] },
      ],
    },
    {
      version: "violet",
      versionName: "Violet",
      locations: [
        { name: "Tera Raid Dens", methods: ["5★-7★ events"] },
        { name: "Blueberry Academy", methods: ["BB Quests & legendary excursions"] },
      ],
    },
  ],
  galar: [
    {
      version: "sword",
      versionName: "Sword",
      locations: [
        { name: "Wild Area", methods: ["Overworld", "Max Raid Battles"] },
        { name: "Routes & Cities", methods: ["Grass encounters", "Fishing"] },
      ],
    },
    {
      version: "shield",
      versionName: "Shield",
      locations: [
        { name: "Wild Area", methods: ["Overworld", "Max Raid Battles"] },
        { name: "Routes & Cities", methods: ["Grass encounters", "Fishing"] },
      ],
    },
  ],
  "isle-of-armor": [
    {
      version: "isle-of-armor",
      versionName: "Isle of Armor",
      locations: [
        { name: "Fields of Honor & Soothing Wetlands", methods: ["Overworld"] },
        { name: "Courageous Cavern", methods: ["Caves"] },
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
        { name: "Crown Shrine", methods: ["Story events"] },
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
        { name: "Mystery Gift", methods: ["Events & transfers"] },
      ],
    },
    {
      version: "shield",
      versionName: "Shield",
      locations: [
        { name: "Mystery Gift", methods: ["Events & transfers"] },
      ],
    },
  ],
  hisui: [
    {
      version: "legends-arceus",
      versionName: "Legends Arceus",
      locations: [
        { name: "Obsidian Fieldlands", methods: ["Exploration & Mass Outbreaks"] },
        { name: "Crimson Mirelands", methods: ["Space-time distortions"] },
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
  if (!name) return "Unknown location";
  return titleCase(String(name));
}

function escapeSelector(value) {
  return CSS.escape ? CSS.escape(value) : value.replace(/"/g, '\"');
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

function getGameOrder(gameId) {
  if (!gameId) return Number.MAX_SAFE_INTEGER;
  if (GAME_RELEASE_ORDER_MAP.has(gameId)) {
    return GAME_RELEASE_ORDER_MAP.get(gameId);
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

const VARIANT_CATEGORY_ORDER = {
  regional: 0,
  mega: 1,
  gmax: 2,
  special: 3,
  gender: 4,
};

function groupVariantDefinitionsBySpecies(definitions = []) {
  const map = new Map();
  definitions.forEach((variant) => {
    if (!variant || !variant.speciesId || !variant.form) return;
    const key = String(variant.speciesId);
    const list = map.get(key) || [];
    list.push(variant);
    map.set(key, list);
  });
  map.forEach((list) => {
    list.sort((a, b) => {
      const orderA = VARIANT_CATEGORY_ORDER[a?.category] ?? 99;
      const orderB = VARIANT_CATEGORY_ORDER[b?.category] ?? 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const nameA = a?.name || "";
      const nameB = b?.name || "";
      return nameA.localeCompare(nameB, "en", { sensitivity: "base" });
    });
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

function injectHomeGenderDex(data) {
  if (!data || !Array.isArray(data.games)) return;
  const homeGame = data.games.find((game) => game.id === "pokemon-home");
  if (!homeGame || !Array.isArray(homeGame.dexes)) return;
  if (homeGame.dexes.some((dex) => dex.id === GENDER_DEX_ID)) {
    return;
  }
  homeGame.dexes.push({
    id: GENDER_DEX_ID,
    name: "Gender differences",
    entries: [],
    isGenderDex: true,
  });
}

function getHomeNationalDex() {
  const data = state.pokedexData || window.POKEDEX_DATA;
  if (!data || !Array.isArray(data.games)) return null;
  const homeGame = data.games.find((game) => game.id === "pokemon-home");
  if (!homeGame || !Array.isArray(homeGame.dexes)) return null;
  return homeGame.dexes.find((dex) => dex.id === "home") || null;
}

function ensureGenderDexEntries(dex) {
  if (!dex || dex.id !== GENDER_DEX_ID) {
    return "ready";
  }
  if (Array.isArray(dex.entries) && dex.entries.length) {
    state.genderDex.isLoaded = true;
    return "ready";
  }
  if (state.genderDex.isLoading) {
    return "loading";
  }
  state.genderDex.isLoading = true;
  state.genderDex.error = null;
  const total = (state.pokedexData?.species || window.POKEDEX_DATA?.species || []).length;
  state.genderDex.progress = { processed: 0, total };
  const onProgress = (progress) => {
    state.genderDex.progress = progress;
    updateGenderDexLoadingMessage();
  };
  buildGenderDexEntries(onProgress)
    .then((entries) => {
      dex.entries = entries;
      state.genderDex.isLoaded = true;
      state.genderDex.isLoading = false;
      renderDex();
    })
    .catch((error) => {
      state.genderDex.error = error;
      state.genderDex.isLoading = false;
      console.error("Could not load the gender dex:", error);
      renderDex();
    });
  return "loading";
}

function getGenderDexProgressMessage() {
  const progress = state.genderDex?.progress || { processed: 0, total: 0 };
  if (!progress.total) {
    return "Building gender dex…";
  }
  const percentage = Math.min(
    100,
    Math.round((progress.processed / progress.total) * 100)
  );
  return `Building gender dex… (${progress.processed}/${progress.total}, ${percentage}%)`;
}

function renderGenderDexLoading() {
  if (dom.dexGrid) {
    dom.dexGrid.innerHTML = `<p class="loading-message">${getGenderDexProgressMessage()}</p>`;
  }
  if (dom.dexListBody) {
    dom.dexListBody.innerHTML = "";
  }
  state.totalBoxes = 1;
  updateBoxIndicator(0, 1);
  updateSpecialFilterControl({ mega: false, gmax: false });
  updateSpriteModeActions({ mega: false, gmax: false });
  updateDexProgress([], new Set());
  updateViewToggleButtons();
  updateBoxControls();
}

function renderGenderDexError() {
  if (dom.dexGrid) {
    dom.dexGrid.innerHTML = `<p class="loading-message">Could not load the gender dex. Please try again.</p>`;
  }
  if (dom.dexListBody) {
    dom.dexListBody.innerHTML = "";
  }
  state.totalBoxes = 1;
  updateBoxIndicator(0, 1);
  updateSpecialFilterControl({ mega: false, gmax: false });
  updateSpriteModeActions({ mega: false, gmax: false });
  updateDexProgress([], new Set());
  updateViewToggleButtons();
  updateBoxControls();
}

function getActiveGenderSpriteMode() {
  const currentDex = getCurrentDex();
  if (currentDex?.id === GENDER_DEX_ID) {
    return state.genderDexSpriteMode || "male";
  }
  return null;
}

function updateGenderSpriteToggleVisibility(currentDex = getCurrentDex()) {
  if (!dom.genderSpriteToggle) return;
  const shouldShow = currentDex?.id === GENDER_DEX_ID;
  dom.genderSpriteToggle.hidden = !shouldShow;
  if (shouldShow) {
    updateGenderSpriteToggle();
  }
}

function updateGenderSpriteToggle() {
  const mode = state.genderDexSpriteMode || "male";
  if (dom.showGenderMale) {
    const isActive = mode === "male";
    dom.showGenderMale.classList.toggle("is-active", isActive);
    dom.showGenderMale.setAttribute("aria-pressed", String(isActive));
  }
  if (dom.showGenderFemale) {
    const isActive = mode === "female";
    dom.showGenderFemale.classList.toggle("is-active", isActive);
    dom.showGenderFemale.setAttribute("aria-pressed", String(isActive));
  }
}

function setGenderSpriteMode(mode) {
  if (mode !== "male" && mode !== "female") return;
  if (state.genderDexSpriteMode === mode) return;
  state.genderDexSpriteMode = mode;
  updateGenderSpriteToggle();
  if (getCurrentDex()?.id === GENDER_DEX_ID) {
    renderDex();
  }
}

function updateGenderDexLoadingMessage() {
  if (!dom.dexGrid) return;
  const messageNode = dom.dexGrid.querySelector(".loading-message");
  if (messageNode) {
    messageNode.textContent = getGenderDexProgressMessage();
  }
}

async function buildGenderDexEntries(onProgress) {
  const homeDex = getHomeNationalDex();
  if (!homeDex) return [];
  const speciesSet = await getGenderDifferenceSpeciesSet(onProgress);
  if (!speciesSet || !speciesSet.size) {
    return [];
  }
  const baseEntries = Array.isArray(homeDex.entries) ? homeDex.entries : [];
  const filtered = baseEntries.filter((entry) =>
    speciesSet.has(String(entry.speciesId))
  );
  return filtered.map((entry, index) => ({ ...entry, sortIndex: index + 1 }));
}

async function getGenderDifferenceSpeciesSet(onProgress) {
  if (state.genderDex.speciesSet instanceof Set) {
    return state.genderDex.speciesSet;
  }
  const cached = readGenderDifferenceCache();
  if (cached && cached.size) {
    state.genderDex.speciesSet = cached;
    return cached;
  }
  const computed = await loadGenderDifferenceSpeciesSet(onProgress);
  state.genderDex.speciesSet = computed;
  return computed;
}

function readGenderDifferenceCache() {
  try {
    const raw = localStorage.getItem(GENDER_DIFFERENCE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return new Set(parsed.map((id) => String(id)));
  } catch (error) {
    console.warn("Could not read gender cache:", error);
    return null;
  }
}

function writeGenderDifferenceCache(ids = []) {
  try {
    localStorage.setItem(GENDER_DIFFERENCE_CACHE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn("Could not store gender cache:", error);
  }
}

async function loadGenderDifferenceSpeciesSet(onProgress) {
  const data = state.pokedexData || window.POKEDEX_DATA;
  const speciesList = Array.isArray(data?.species) ? [...data.species] : [];
  const total = speciesList.length;
  const results = [];
  let processed = 0;
  let nextIndex = 0;
  const workerCount = Math.min(8, Math.max(1, total));

  async function worker() {
    while (nextIndex < speciesList.length) {
      const entry = speciesList[nextIndex++];
      const speciesId = entry?.id;
      let hasDifference = false;
      if (speciesId) {
        hasDifference = await fetchSpeciesGenderDifferenceFlag(speciesId);
        if (hasDifference) {
          results.push(Number(speciesId));
        }
      }
      processed += 1;
      if (typeof onProgress === "function") {
        onProgress({ processed, total });
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, worker));
  results.sort((a, b) => a - b);
  writeGenderDifferenceCache(results);
  return new Set(results.map((id) => String(id)));
}

async function fetchSpeciesGenderDifferenceFlag(speciesId) {
  if (!speciesId) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon-species/${speciesId}`);
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
    const data = await response.json();
    return Boolean(data?.has_gender_differences);
  } catch (error) {
    console.warn(`Could not load gender info for species :`, error);
    return false;
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
        "en",
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
      console.warn("Could not load Pokémon details:", error);
      return null;
    });

  pendingDetailRequests.set(key, request);
  return request;
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

function formatVersionLabel(version) {
  if (!version && version !== 0) return "";
  if (VERSION_NAME_OVERRIDES[version]) {
    return VERSION_NAME_OVERRIDES[version];
  }
  return String(version)
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function renderVersionBadges(container, entry) {
  if (!container) return;
  container.innerHTML = "";
  const versions = Array.isArray(entry?.versionExclusive)
    ? entry.versionExclusive
    : [];
  if (!versions.length) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  versions.forEach((version) => {
    const badge = document.createElement("span");
    badge.className = "pokemon-version-badge";
    const meta = VERSION_BADGE_STYLES[version] || {};
    badge.textContent = meta.label || formatVersionLabel(version);
    if (meta.color) {
      badge.style.backgroundColor = meta.color;
      badge.style.borderColor = meta.color;
      badge.style.color = meta.textColor || "#fff";
    } else {
      badge.style.removeProperty("background-color");
      badge.style.removeProperty("border-color");
      badge.style.removeProperty("color");
    }
    container.append(badge);
  });
}

function renderDetailVersionBadges(entry) {
  if (!dom.detailVersions) return;
  const container = dom.detailVersions.querySelector("[data-version-badges]");
  renderVersionBadges(container, entry);
  dom.detailVersions.hidden = !(entry?.versionExclusive?.length);
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

function buildSpriteOptions(extra = {}) {
  const options = { ...extra };
  const genderMode = getActiveGenderSpriteMode();
  if (genderMode) {
    options.genderMode = genderMode;
  }
  return options;
}

function getSpriteForEntry(entry, details, options = {}) {
  if (!entry) return "";
  const spriteMode = options.spriteMode || state.spriteMode;
  const catchKey = options.catchKey || getEntryCatchKey(entry);
  const gameId = options.gameId || state.currentGameId;
  const genderPreference = (() => {
    if (options.genderMode === "male" || options.genderMode === "female") {
      return options.genderMode;
    }
    return getActiveGenderSpriteMode();
  })();
  const preferFemale = genderPreference === "female";

  if (spriteMode === "mega" || spriteMode === "gmax") {
    const specialSprite = getSpecialFormSprite(entry, spriteMode);
    if (specialSprite) {
      return specialSprite;
    }
  }
  if (spriteMode === "shiny") {
    if (preferFemale && details?.sprites?.shinyFemale) {
      return details.sprites.shinyFemale;
    }
    if (details?.sprites?.shiny) {
      return details.sprites.shiny;
    }
  }
  if (spriteMode === "nostalgia") {
    const nostalgic = getNostalgiaSprite(entry, details);
    if (nostalgic) {
      return nostalgic;
    }
  }
  if (catchKey && spriteMode !== "mega" && spriteMode !== "gmax") {
    const specialFlagType = getActiveSpecialFlagType(catchKey, gameId);
    if (specialFlagType) {
      const flaggedSprite = getSpecialFormSprite(entry, specialFlagType);
      if (flaggedSprite) {
        return flaggedSprite;
      }
    }
  }
  if (spriteMode !== "shiny" && catchKey && isFlagActive("shiny", catchKey, gameId)) {
    if (preferFemale && details?.sprites?.shinyFemale) {
      return details.sprites.shinyFemale;
    }
    if (details?.sprites?.shiny) {
      return details.sprites.shiny;
    }
  }
  if (preferFemale) {
    if (details?.sprites?.female) {
      return details.sprites.female;
    }
    if (details?.sprites?.shinyFemale) {
      return details.sprites.shinyFemale;
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
  const special = state.variantsBySpecies?.special?.[id] || [];
  special.forEach((variant) => results.push({ type: "special", variant }));
  return results;
}

function getSpecialFormSprite(entry, type) {
  if (!entry || !type) return "";
  const forms = getSpecialFormsForSpecies(entry.speciesId);
  const match = forms.find((form) => form.type === type);
  if (match?.variant) {
    return getVariantSprite(match.variant);
  }
  return "";
}

function getVariantSprite(variant) {
  if (!variant) return "";
  if (variant.sprite) return variant.sprite;
  const definition = findVariantDefinition(variant.speciesId, variant.form);
  if (definition?.sprite) {
    return definition.sprite;
  }
  const pokemonId = variant.pokemonId || definition?.pokemonId;
  if (pokemonId && typeof window.POKEDEX_DATA?.sprites?.default === "function") {
    try {
      return window.POKEDEX_DATA.sprites.default(pokemonId);
    } catch (error) {
      console.warn("Could not load variant sprite:", pokemonId, error);
    }
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
  const meta = SPECIAL_FORM_METADATA[type] || SPECIAL_FORM_METADATA.special;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `special-icon ${meta.className}`;
  button.textContent = meta.symbol;
  const variantName = variant.name || baseEntry.name;
  button.title = `${meta.label}: ${variantName}`;
  button.setAttribute("aria-label", button.title);
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

function isCaughtInOtherGames(catchKey, excludeGameId = state.currentGameId) {
  if (!catchKey) return false;
  const key = String(catchKey);
  return Object.entries(state.caughtByGame).some(([gameId, set]) => {
    if (gameId === excludeGameId) return false;
    if (!(set instanceof Set)) return false;
    return set.has(key);
  });
}

function shouldHighlightHome(catchKey, gameId = state.currentGameId) {
  if (gameId !== "pokemon-home") return false;
  return isCaughtInOtherGames(catchKey, gameId);
}

function syncFlagLabelState(label, input) {
  if (!label || !input) return;
  const isChecked = Boolean(input.checked);
  label.classList.toggle("is-active", isChecked);
  label.dataset.active = String(isChecked);
}

function renderStatusCheckboxes(container, entry, catchKey) {
  if (!container) return;
  container.innerHTML = "";
  const gameId = state.currentGameId;
  if (!gameId || !catchKey) {
    container.hidden = true;
    return;
  }
  const availableFlags = FLAG_KEYS.filter(
    (flag) => isFlagEnabledForGame(flag, gameId) && supportsFlagForEntry(flag, entry)
  );
  if (!availableFlags.length) {
    container.hidden = true;
    container.style.removeProperty("--flag-columns");
    return;
  }
  container.hidden = false;
  const columnCount = Math.max(1, Math.min(availableFlags.length, 3));
  container.style.setProperty("--flag-columns", String(columnCount));
  availableFlags.forEach((flag) => {
    const label = document.createElement("label");
    label.className = "pokemon-flag";
    label.dataset.flag = flag;
    label.title = FLAG_LABELS[flag] || "";
    label.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "pokemon-flag__input";
    input.dataset.flag = flag;
    input.checked = isFlagActive(flag, catchKey, gameId);
    input.setAttribute(
      "aria-label",
      `${FLAG_LABELS[flag]} status for ${entry?.name || "this Pokémon"}`
    );
    ["click", "pointerdown", "keydown"].forEach((type) => {
      input.addEventListener(type, (event) => {
        event.stopPropagation();
      });
    });
    input.addEventListener("change", (event) => {
      syncFlagLabelState(label, input);
      setFlagState(flag, catchKey, event.target.checked, gameId);
    });

    syncFlagLabelState(label, input);

    const icon = document.createElement("span");
    icon.className = "pokemon-flag__icon";
    icon.textContent = FLAG_ICONS[flag] || FLAG_LABELS[flag] || "";
    icon.setAttribute("aria-hidden", "true");

    const srText = document.createElement("span");
    srText.className = "pokemon-flag__sr";
    srText.textContent = FLAG_LABELS[flag];

    label.append(input, icon, srText);
    container.append(label);
  });
}

function renderGrid(entries, caughtSet) {
  if (!dom.dexGrid || !dom.cardTemplate) return;
  dom.dexGrid.replaceChildren();
  const isCompact = state.viewMode === VIEW_MODES.COMPACT;
  dom.dexGrid.classList.toggle("dex-grid--compact", isCompact);
  if (state.entryCache) {
    state.entryCache.clear();
  }
  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => {
    const card = dom.cardTemplate.content.firstElementChild.cloneNode(true);
    const sprite = card.querySelector(".pokemon-sprite");
    const number = card.querySelector(".pokemon-number");
    const name = card.querySelector(".pokemon-name");
    const special = card.querySelector(".pokemon-special");
    const typesContainer = card.querySelector(".pokemon-types");
    const flagContainer = card.querySelector("[data-flag-container]");
    const versionContainer = card.querySelector("[data-version-badges]");

    if (number) {
      number.textContent = entry.displayNumber || "";
    }

    if (name) {
      name.textContent = entry.name;
      name.setAttribute("aria-label", `View details for ${entry.name}`);
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

    const catchKey = getEntryCatchKey(entry);
    if (catchKey) {
      state.entryCache.set(String(catchKey), entry);
    }

    const cachedDetails = getCachedPokemonDetails(entry);
    const spriteOptions = buildSpriteOptions({ catchKey });
    const spriteUrl = getSpriteForEntry(entry, cachedDetails, spriteOptions);
    if (sprite) {
      sprite.src = spriteUrl || "";
      sprite.alt = `${entry.name} sprite`;
      sprite.dataset.mode = state.spriteMode;
    }

    card.classList.toggle("pokemon-card--compact", isCompact);

    renderTypeBadges(typesContainer, entry.types || cachedDetails?.types || []);
    appendSpecialForms(special, entry);
    renderVersionBadges(versionContainer, entry);
    const hasExclusive = Boolean(entry?.versionExclusive?.length);
    card.classList.toggle("pokemon-card--exclusive", hasExclusive);

    const isCaught = catchKey ? caughtSet.has(String(catchKey)) : false;
    card.dataset.id = catchKey || "";
    card.dataset.caught = String(isCaught);
    card.setAttribute("aria-pressed", String(isCaught));
    card.dataset.homeOwned = String(shouldHighlightHome(catchKey, state.currentGameId));
    const detailKey = getEntryDetailKey(entry);
    if (detailKey) {
      card.dataset.entryKey = detailKey;
    }
    card.dataset.spriteMode = state.spriteMode;

    renderStatusCheckboxes(flagContainer, entry, catchKey);

    card.addEventListener("click", () => {
      if (catchKey) {
        toggleCaught(catchKey);
      }
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (catchKey) {
          toggleCaught(catchKey);
        }
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
      const nextSprite = getSpriteForEntry(entry, details, buildSpriteOptions({ catchKey }));
      if (imageNode && nextSprite && imageNode.src !== nextSprite) {
        imageNode.src = nextSprite;
      }
    });

    fragment.append(card);
  });
  dom.dexGrid.append(fragment);
  if (state.viewMode === VIEW_MODES.COMPACT) {
    scheduleCompactViewportMeasurement();
  }
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
  const versionContainer = node.querySelector("[data-version-badges]");
  renderVersionBadges(versionContainer, entry);

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
      ? "Clear mark"
      : "Mark as caught";
  }
  node.dataset.homeOwned = String(shouldHighlightHome(catchKey, state.currentGameId));

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
  row.dataset.homeOwned = String(shouldHighlightHome(catchKey, state.currentGameId));
  const button = row.querySelector(".status-toggle");
  if (button) {
    button.textContent = isCaught
      ? "Clear mark"
      : "Mark as caught";
  }
}

function updateCard(catchKey) {
  if (!dom.dexGrid) return;
  const card = dom.dexGrid.querySelector(
    `.pokemon-card[data-id="${escapeSelector(catchKey)}"]`
  );
  if (!card) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  const isCaught = caughtSet.has(String(catchKey));
  card.dataset.caught = String(isCaught);
  card.setAttribute("aria-pressed", String(isCaught));
  card.dataset.homeOwned = String(shouldHighlightHome(catchKey, state.currentGameId));
}

function updateCardFlags(catchKey, gameId = state.currentGameId) {
  if (!catchKey || !dom.dexGrid) return;
  const normalized = String(catchKey);
  const selector = `.pokemon-card[data-id="${escapeSelector(normalized)}"]`;
  const card = dom.dexGrid.querySelector(selector);
  if (!card) return;

  const flagContainer = card.querySelector("[data-flag-container]");
  if (flagContainer) {
    const inputs = flagContainer.querySelectorAll(".pokemon-flag__input");
    inputs.forEach((input) => {
      const flag = input.dataset.flag;
      if (!flag) return;
      input.checked = isFlagActive(flag, normalized, gameId);
      const label = input.closest(".pokemon-flag");
      syncFlagLabelState(label, input);
    });
  }

  const entry = state.entryCache?.get(normalized);
  if (!entry) return;

  const imageNode = card.querySelector(".pokemon-sprite");
  if (!imageNode) return;

  const cachedDetails = getCachedPokemonDetails(entry);
  const options = buildSpriteOptions({ catchKey: normalized, gameId });
  const nextSprite = getSpriteForEntry(entry, cachedDetails, options);
  if (nextSprite && imageNode.src !== nextSprite) {
    imageNode.src = nextSprite;
  } else if (!nextSprite && imageNode.src) {
    imageNode.removeAttribute("src");
  }

  if (!cachedDetails) {
    ensurePokemonDetails(entry).then((details) => {
      const cardNode = dom.dexGrid?.querySelector(selector);
      if (!cardNode) return;
      const spriteNode = cardNode.querySelector(".pokemon-sprite");
      if (!spriteNode) return;
      const resolvedSprite = getSpriteForEntry(
        entry,
        details,
        buildSpriteOptions({ catchKey: normalized, gameId })
      );
      if (resolvedSprite && spriteNode.src !== resolvedSprite) {
        spriteNode.src = resolvedSprite;
      }
    });
  }
}

function updateFlagIndicators(catchKey, gameId = state.currentGameId) {
  if (!catchKey) return;
  updateCardFlags(catchKey, gameId);
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
  handleViewModeChromeChange();
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

const SEREBII_PATH_BUILDERS = {
  "generation-i": (id) => `https://www.serebii.net/pokedex/${id}.shtml`,
  "generation-ii": (id) => `https://www.serebii.net/pokedex-gs/${id}.shtml`,
  "generation-iii": (id) => `https://www.serebii.net/pokedex-rs/${id}.shtml`,
  "generation-iv": (id) => `https://www.serebii.net/pokedex-dp/${id}.shtml`,
  "generation-v": (id) => `https://www.serebii.net/pokedex-bw/${id}.shtml`,
  "generation-vi": (id) => `https://www.serebii.net/pokedex-xy/${id}.shtml`,
  "generation-vii": (id) => `https://www.serebii.net/pokedex-sm/${id}.shtml`,
  "generation-viii": (id, slug) =>
    `https://www.serebii.net/pokedex-swsh/${slug || id}/`,
  "generation-ix": (id, slug) => `https://www.serebii.net/pokedex-sv/${slug || id}/`,
};

function sanitizeSerebiiSlugPart(value) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildSerebiiSlug(details, entry) {
  const slug = details?.speciesSlug || entry?.pokemonSlug || "";
  const sanitizedSlug = sanitizeSerebiiSlugPart(slug);
  if (sanitizedSlug) return sanitizedSlug;
  const fallback = details?.name || entry?.name || "";
  return sanitizeSerebiiSlugPart(fallback);
}

function buildSerebiiUrl(details, entry) {
  const speciesId = details?.speciesId || entry?.speciesId;
  if (!speciesId) return null;
  const paddedId = String(speciesId).padStart(3, "0");
  const generation = details?.generation || null;
  const slug = buildSerebiiSlug(details, entry);
  const builder = generation ? SEREBII_PATH_BUILDERS[generation] : null;
  if (typeof builder === "function") {
    return builder(paddedId, slug);
  }
  return `https://www.serebii.net/pokedex/${paddedId}.shtml`;
}

function buildBulbapediaUrl(details, entry) {
  const name = details?.name || entry?.name;
  if (!name) return null;
  const page = `${name.replace(/\s+/g, "_")}_(Pokémon)`;
  return `https://bulbapedia.bulbagarden.net/wiki/${encodeURI(page)}`;
}

function renderExternalLinks(container, details, entry) {
  if (!container) return;
  container.innerHTML = "";
  const links = [];
  const serebiiUrl = buildSerebiiUrl(details, entry);
  if (serebiiUrl) {
    links.push({ label: "Serebii", url: serebiiUrl });
  }
  const bulbapediaUrl = buildBulbapediaUrl(details, entry);
  if (bulbapediaUrl) {
    links.push({ label: "Bulbapedia", url: bulbapediaUrl });
  }

  if (!links.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "pokemon-details__link";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    container.append(anchor);
  });
}

function getSpeciesSprite(speciesId) {
  if (!speciesId || typeof window.POKEDEX_DATA?.sprites?.default !== "function") {
    return "";
  }
  try {
    return window.POKEDEX_DATA.sprites.default(speciesId) || "";
  } catch (error) {
    console.warn("Could not fetch sprite for", speciesId, error);
    return "";
  }
}

function createEvolutionMonNode(data) {
  const wrapper = document.createElement("div");
  wrapper.className = "pokemon-details__evolution-mon";
  if (data?.isCurrent) {
    wrapper.classList.add("is-current");
  }

  const spriteUrl = data?.sprite || getSpeciesSprite(data?.id);
  if (spriteUrl) {
    const img = document.createElement("img");
    img.className = "pokemon-details__evolution-sprite";
    img.src = spriteUrl;
    img.alt = `${data?.name || "Unknown"} sprite`;
    img.loading = "lazy";
    wrapper.append(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "pokemon-details__evolution-sprite pokemon-details__evolution-sprite--placeholder";
    wrapper.append(placeholder);
  }

  const label = document.createElement("span");
  label.className = "pokemon-details__evolution-name";
  label.textContent = data?.name || "Unknown";
  wrapper.append(label);

  return wrapper;
}

function renderEvolution(container, evolution = {}, entry) {
  if (!container) return;
  container.innerHTML = "";
  const steps = Array.isArray(evolution.steps) ? evolution.steps : [];
  const specialForms = entry ? getSpecialFormsForSpecies(entry.speciesId) : [];
  const relevantSpecialForms = specialForms.filter((form) =>
    form?.type === "mega" || form?.type === "gmax"
  );
  if (!steps.length && !relevantSpecialForms.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "No evolution data available.";
    container.append(empty);
    return;
  }

  steps.forEach((step) => {
    const block = document.createElement("div");
    block.className = "pokemon-details__evolution-step";
    const path = document.createElement("div");
    path.className = "pokemon-details__evolution-path";

    const fromNode = createEvolutionMonNode(step.from);
    const arrow = document.createElement("span");
    arrow.className = "pokemon-details__evolution-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    const toNode = createEvolutionMonNode(step.to);
    path.append(fromNode, arrow, toNode);
    block.append(path);

    const methods = Array.isArray(step.methods) ? step.methods.filter(Boolean) : [];
    if (methods.length) {
      const list = document.createElement("ul");
      list.className = "pokemon-details__evolution-methods";
      methods.forEach((method) => {
        const item = document.createElement("li");
        item.textContent = method;
        list.append(item);
      });
      block.append(list);
    }

    container.append(block);
  });

  if (relevantSpecialForms.length) {
    renderSpecialEvolutionForms(container, entry, relevantSpecialForms);
  }
}

function renderSpecialEvolutionForms(container, entry, forms) {
  if (!container || !entry || !forms.length) return;
  const baseSprite = entry.sprite || getSpeciesSprite(entry.speciesId);
  const baseData = {
    id: entry.speciesId,
    name: entry.name,
    sprite: baseSprite,
    isCurrent: !entry.form,
  };
  forms.forEach(({ type, variant }) => {
    const variantEntry = buildVariantEntry(entry, variant, type);
    if (!variantEntry) return;
    const block = document.createElement("div");
    block.className = "pokemon-details__evolution-step pokemon-details__evolution-step--special";

    const path = document.createElement("div");
    path.className = "pokemon-details__evolution-path";

    const fromNode = createEvolutionMonNode(baseData);
    const arrow = document.createElement("span");
    arrow.className = "pokemon-details__evolution-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    const variantSprite = getVariantSprite(variant) || variantEntry.sprite || null;
    const toNode = createEvolutionMonNode({
      id: variantEntry.speciesId,
      name: variantEntry.name,
      sprite: variantSprite,
      isCurrent: Boolean(entry.form && entry.form === variantEntry.form),
    });
    path.append(fromNode, arrow, toNode);
    block.append(path);

    const meta = SPECIAL_FORM_METADATA[type] || SPECIAL_FORM_METADATA.special;
    const list = document.createElement("ul");
    list.className = "pokemon-details__evolution-methods";
    const item = document.createElement("li");
    item.textContent = meta.label;
    list.append(item);
    block.append(list);

    container.append(block);
  });
}

function getVariantsForEntry(entry, { includeMega = false, includeGmax = false } = {}) {
  if (!entry || !entry.speciesId) return [];
  const key = String(entry.speciesId);
  if (!key) return [];
  const variants = state.variantGroupsBySpecies.get(key) || [];
  return variants.filter((variant) => {
    if (!includeMega && variant?.category === "mega") return false;
    if (!includeGmax && variant?.category === "gmax") return false;
    return true;
  });
}

function buildGenderVariantEntries(entry, details) {
  if (!entry || !details?.sprites) return [];
  const femaleSprite = details.sprites.female || details.sprites.shinyFemale;
  if (!femaleSprite) return [];
  const maleSprite =
    details.sprites.default ||
    details.sprites.home ||
    entry.sprite ||
    getSpeciesSprite(entry.speciesId);
  const variants = [];
  if (maleSprite) {
    variants.push({
      key: `${entry.speciesId}:gender-male`,
      speciesId: entry.speciesId,
      form: entry.form || null,
      name: `${entry.name} (Male)`,
      sprite: maleSprite,
      category: "gender",
    });
  }
  variants.push({
    key: `${entry.speciesId}:gender-female`,
    speciesId: entry.speciesId,
    form: entry.form || null,
    name: `${entry.name} (Female)`,
    sprite: femaleSprite,
    category: "gender",
  });
  return variants;
}

function renderVariants(container, entry, details = null) {
  if (!container) return;
  container.innerHTML = "";
  if (!entry) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "No variants available.";
    container.append(empty);
    return;
  }
  const variants = getVariantsForEntry(entry, { includeMega: true, includeGmax: true });
  const genderVariants = buildGenderVariantEntries(entry, details);
  const combined = [...variants, ...genderVariants];
  if (!combined.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "No variants available.";
    container.append(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "pokemon-variants";
  combined.forEach((variant) => {
    const type = variant?.category || "regional";
    const variantEntry = buildVariantEntry(entry, variant, type);
    if (!variantEntry) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pokemon-variant";
    if (entry.form && variantEntry.form && entry.form === variantEntry.form) {
      button.classList.add("is-current");
    }
    button.title = `View details for ${variantEntry.name}`;
    button.addEventListener("click", () => {
      openPokemonDetails(variantEntry);
    });

    const spriteUrl = variantEntry.sprite || getVariantSprite(variant) || getSpeciesSprite(variantEntry.speciesId);
    if (spriteUrl) {
      const img = document.createElement("img");
      img.className = "pokemon-variant__sprite";
      img.src = spriteUrl;
      img.alt = `${variantEntry.name} sprite`;
      img.loading = "lazy";
      button.append(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "pokemon-variant__sprite pokemon-variant__sprite--placeholder";
      button.append(placeholder);
    }

    const label = document.createElement("span");
    label.className = "pokemon-variant__name";
    label.textContent = variantEntry.name;
    button.append(label);

    const meta = document.createElement("div");
    meta.className = "pokemon-variant__meta";
    if (variantEntry.displayDexNumber) {
      const number = document.createElement("span");
      number.textContent = variantEntry.displayDexNumber;
      meta.append(number);
    } else if (variantEntry.displayNumber) {
      const number = document.createElement("span");
      number.textContent = variantEntry.displayNumber;
      meta.append(number);
    }
    if (variantEntry.regionCode) {
      const badge = document.createElement("span");
      badge.className = "pokemon-variant__badge";
      badge.textContent = variantEntry.regionCode;
      meta.append(badge);
    }
    if (meta.children.length) {
      button.append(meta);
    }

    list.append(button);
  });

  container.append(list);
}

function showPokemonDetailsLoading(entry) {
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
  if (cached?.types?.length || entry.types?.length) {
    updateEntryTypes(entry, cached.types || entry.types || []);
  }

  if (dom.detailSprite) {
    const spriteUrl = resolveSprite(entry, cached, { preferHome: true });
    dom.detailSprite.src = spriteUrl || "";
    dom.detailSprite.alt = `${entry.name} sprite`;
  }

  if (dom.detailHeight) dom.detailHeight.textContent = "Loading…";
  if (dom.detailWeight) dom.detailWeight.textContent = "Loading…";

  if (dom.detailLinks) {
    dom.detailLinks.innerHTML = "";
    dom.detailLinks.hidden = true;
  }
  if (dom.detailVersions) {
    const badges = dom.detailVersions.querySelector("[data-version-badges]");
    if (badges) {
      badges.innerHTML = "";
    }
    dom.detailVersions.hidden = true;
  }
  if (dom.detailVersions) {
    const badges = dom.detailVersions.querySelector("[data-version-badges]");
    if (badges) {
      badges.innerHTML = "";
    }
    dom.detailVersions.hidden = true;
  }

  if (dom.detailEvolution) {
    dom.detailEvolution.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Loading data…";
    dom.detailEvolution.append(loading);
  }

  if (dom.detailVariants) {
    dom.detailVariants.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Loading data…";
    dom.detailVariants.append(loading);
  }
}

function applyPokemonDetails(entry, details) {
  if (!details) return;
  if (dom.detailName) dom.detailName.textContent = details.name || entry.name;
  if (dom.detailNumber) {
    dom.detailNumber.textContent =
      entry.displayNumber || entry.displayNationalNumber || entry.displayDexNumber || "";
  }
  if (dom.detailTypes) {
    renderTypeBadges(dom.detailTypes, details.types || entry.types || []);
  }
  updateEntryTypes(entry, details.types || entry.types || []);
  renderDetailVersionBadges(entry);
  if (dom.detailSprite) {
    const spriteUrl = resolveSprite(entry, details, { preferHome: true });
    if (spriteUrl) {
      dom.detailSprite.src = spriteUrl;
    }
  }
  if (dom.detailHeight) {
    dom.detailHeight.textContent = formatHeight(details.height);
  }
  if (dom.detailWeight) {
    dom.detailWeight.textContent = formatWeight(details.weight);
  }
  renderExternalLinks(dom.detailLinks, details, entry);
  renderEvolution(dom.detailEvolution, details.evolution || {}, entry);
  renderVariants(dom.detailVariants, entry, details);
}

function showPokemonDetailsError(message) {
  if (dom.detailLinks) {
    dom.detailLinks.innerHTML = "";
    dom.detailLinks.hidden = true;
  }
  if (dom.detailEvolution) {
    dom.detailEvolution.innerHTML = "";
    const error = document.createElement("p");
    error.className = "pokemon-details__empty";
    error.textContent = message;
    dom.detailEvolution.append(error);
  }
  if (dom.detailVariants) {
    dom.detailVariants.innerHTML = "";
    const error = document.createElement("p");
    error.className = "pokemon-details__empty";
    error.textContent = message;
    dom.detailVariants.append(error);
  }
}

async function openPokemonDetails(entry) {
  if (!entry || !dom.detailsDialog) return;
  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  showPokemonDetailsLoading(entry);
  if (!dom.detailsDialog.open) {
    dom.detailsDialog.showModal();
  }

  const cached = getCachedPokemonDetails(entry);
  if (cached) {
    applyPokemonDetails(entry, cached);
  }

  try {
    const details = await ensurePokemonDetails(entry);
    if (!details) {
      showPokemonDetailsError("Unable to load details.");
      return;
    }
    applyPokemonDetails(entry, details);
  } catch (error) {
    showPokemonDetailsError("Unable to load details.");
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
  return `${meters.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} m`;
}

function formatWeight(hectograms) {
  if (!Number.isFinite(hectograms)) return "-";
  const kilograms = hectograms / 10;
  return `${kilograms.toLocaleString("en-US", {
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

function getGameNotes(gameId = state.currentGameId) {
  if (!gameId) return "";
  const note = state.gameNotesByGame?.[gameId];
  return typeof note === "string" ? note : "";
}

function getSerializableGameNotes() {
  return Object.fromEntries(
    Object.entries(state.gameNotesByGame || {}).filter(
      ([, note]) => typeof note === "string" && note.length
    )
  );
}

function persistGameNotes() {
  try {
    const notes = getSerializableGameNotes();
    if (!Object.keys(notes).length) {
      localStorage.removeItem(GAME_NOTES_STORAGE_KEY);
      return;
    }
    localStorage.setItem(GAME_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn("Could not save game notes:", error);
  }
}

function serializeIdSet(idSet) {
  if (idSet && typeof idSet.values === "function") {
    return Array.from(idSet.values());
  }
  if (Array.isArray(idSet)) {
    return idSet.map((value) => String(value));
  }
  return [];
}

function serializeCaughtState() {
  return Object.fromEntries(
    Object.entries(state.caughtByGame || {}).map(([gameId, idSet]) => [
      gameId,
      serializeIdSet(idSet),
    ])
  );
}

function serializeFlagState() {
  return FLAG_KEYS.reduce((result, flag) => {
    const perGame = state.flagSets?.[flag] || {};
    result[flag] = Object.fromEntries(
      Object.entries(perGame).map(([gameId, idSet]) => [
        gameId,
        serializeIdSet(idSet),
      ])
    );
    return result;
  }, {});
}

function getSerializableDexSelection() {
  return Object.fromEntries(
    Object.entries(state.selectedDexByGame || {}).filter(
      ([, dexId]) => typeof dexId === "string" && dexId.length
    )
  );
}

function buildExportPayload() {
  return {
    version: DATA_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      caughtByGame: serializeCaughtState(),
      flagSets: serializeFlagState(),
      selectedDexByGame: getSerializableDexSelection(),
      gameNotesByGame: getSerializableGameNotes(),
      currentGameId: state.currentGameId,
      currentDexId: state.currentDexId,
      theme: state.theme,
      controlsCollapsed: state.controlsCollapsed,
    },
  };
}

function triggerDownload(filename, contents) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  const target = document.body || document.documentElement || document.createElement("div");
  target.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function exportTrackerData() {
  try {
    const payload = buildExportPayload();
    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    triggerDownload(`living-dex-export-${timestamp}.json`, JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error("Could not export data:", error);
    alert("Export failed. Please try again.");
  }
}

function applyImportedPayload(payload) {
  const data = payload?.data || payload?.storage || payload;
  if (!data || typeof data !== "object") {
    throw new Error("Ongeldig bestand");
  }

  const progressSource =
    data.caughtByGame || data.progress || data.pokemon || data.caught || {};
  state.caughtByGame = Object.fromEntries(
    Object.entries(progressSource).map(([gameId, ids]) => [
      gameId,
      normalizeStoredIds(ids),
    ])
  );

  const nextFlagSets = {};
  FLAG_KEYS.forEach((flag) => {
    const source = data.flagSets?.[flag] || data.flags?.[flag] || {};
    nextFlagSets[flag] = Object.fromEntries(
      Object.entries(source).map(([gameId, ids]) => [
        gameId,
        normalizeStoredIds(ids),
      ])
    );
  });
  state.flagSets = nextFlagSets;

  const dexSelectionSource = data.selectedDexByGame || data.dexSelection || {};
  state.selectedDexByGame = Object.fromEntries(
    Object.entries(dexSelectionSource).filter(
      ([, dexId]) => typeof dexId === "string" && dexId.length
    )
  );

  const notesSource = data.gameNotesByGame || data.notes || {};
  state.gameNotesByGame = Object.fromEntries(
    Object.entries(notesSource)
      .map(([gameId, note]) => [
        gameId,
        typeof note === "string" ? note.replace(/\r\n/g, "\n") : "",
      ])
      .filter(([, note]) => note.length)
  );

  const importedTheme = data.theme;
  if (importedTheme === THEMES.DARK || importedTheme === THEMES.LIGHT) {
    applyTheme(importedTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, importedTheme);
    } catch (error) {
      console.warn("Could not save theme:", error);
    }
  }

  if (typeof data.controlsCollapsed === "boolean") {
    applyControlsCollapsed(data.controlsCollapsed);
    try {
      localStorage.setItem(
        CONTROLS_COLLAPSE_STORAGE_KEY,
        data.controlsCollapsed ? "true" : "false"
      );
    } catch (error) {
      console.warn("Could not save filter preference:", error);
    }
  }

  persistState();
  persistDexSelection();
  persistGameNotes();

  const importedGameId = data.currentGameId;
  const importedDexId = data.currentDexId;

  if (typeof importedGameId === "string" && dom.gameSelect) {
    const games = getGames();
    if (games.some((game) => game.id === importedGameId)) {
      state.currentGameId = importedGameId;
      dom.gameSelect.value = importedGameId;
      try {
        localStorage.setItem(`${STORAGE_KEY}:current-game`, importedGameId);
      } catch (error) {
        console.warn("Could not save current game:", error);
      }
      populateDexSelect();
    }
  }

  if (typeof importedDexId === "string" && dom.dexSelect) {
    const currentGame = getCurrentGame();
    const dexes = getDexesForGame(currentGame);
    if (dexes.some((dex) => dex.id === importedDexId)) {
      dom.dexSelect.value = importedDexId;
      setCurrentDex(importedDexId);
    }
  }

  updateGameNotesInput();
  renderDex();
}

function handleImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("error", () => {
    console.error("Could not read file:", reader.error);
    alert("Import failed. Check the file and try again.");
  });
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(reader.result);
      applyImportedPayload(parsed);
      alert("Data imported successfully!");
    } catch (error) {
      console.error("Could not import data:", error);
      alert("Import failed. Check the file and try again.");
    }
  });
  reader.readAsText(file);
}

function onImportInputChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const [file] = input.files || [];
  if (file) {
    handleImportFile(file);
  }
  input.value = "";
}

function setGameNotes(value, gameId = state.currentGameId) {
  if (!gameId || typeof value !== "string") return;
  const normalized = value.replace(/\r\n/g, "\n");
  if (!normalized.trim()) {
    if (state.gameNotesByGame[gameId]) {
      delete state.gameNotesByGame[gameId];
      persistGameNotes();
    }
    return;
  }
  if (state.gameNotesByGame[gameId] === normalized) return;
  state.gameNotesByGame[gameId] = normalized;
  persistGameNotes();
}

function updateGameNotesInput() {
  if (!dom.gameNotes) return;
  const hasGame = Boolean(state.currentGameId);
  dom.gameNotes.disabled = !hasGame;
  if (!hasGame) {
    if (dom.gameNotes.value) {
      dom.gameNotes.value = "";
    }
    return;
  }
  const value = getGameNotes();
  if (dom.gameNotes.value !== value) {
    dom.gameNotes.value = value;
  }
}

function ensureFlagContainer(flag) {
  if (!state.flagSets[flag]) {
    state.flagSets[flag] = {};
  }
}

function getFlagSet(flag, gameId = state.currentGameId) {
  if (!FLAG_KEYS.includes(flag) || !gameId) {
    return new Set();
  }
  ensureFlagContainer(flag);
  if (!state.flagSets[flag][gameId]) {
    state.flagSets[flag][gameId] = new Set();
  }
  return state.flagSets[flag][gameId];
}

function isFlagEnabledForGame(flag, gameId = state.currentGameId) {
  if (!FLAG_KEYS.includes(flag) || !gameId) return false;
  if (flag === "shiny") return true;
  if (flag === "gmax") return GMAX_FLAG_GAMES.has(gameId);
  if (flag === "mega") return MEGA_FLAG_GAMES.has(gameId);
  if (flag === "alpha") return ALPHA_FLAG_GAMES.has(gameId);
  return false;
}

function supportsFlagForEntry(flag, entry) {
  if (!entry) return false;
  if (flag === "mega") {
    return getSpecialFormsForSpecies(entry.speciesId).some((form) => form.type === "mega");
  }
  if (flag === "gmax") {
    return getSpecialFormsForSpecies(entry.speciesId).some((form) => form.type === "gmax");
  }
  return true;
}

function isFlagActive(flag, catchKey, gameId = state.currentGameId) {
  if (!FLAG_KEYS.includes(flag) || !catchKey || !gameId) return false;
  const set = getFlagSet(flag, gameId);
  return set.has(String(catchKey));
}

function getActiveSpecialFlagType(catchKey, gameId = state.currentGameId) {
  if (!catchKey || !gameId) return null;
  if (isFlagActive("gmax", catchKey, gameId)) return "gmax";
  if (isFlagActive("mega", catchKey, gameId)) return "mega";
  return null;
}

function setFlagState(flag, catchKey, enabled, gameId = state.currentGameId) {
  if (!FLAG_KEYS.includes(flag) || !catchKey || !gameId) return;
  if (!isFlagEnabledForGame(flag, gameId)) return;
  const set = getFlagSet(flag, gameId);
  const key = String(catchKey);
  if (enabled) {
    set.add(key);
  } else {
    set.delete(key);
  }
  persistState();
  updateFlagIndicators(key, gameId);
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
      console.warn("Could not load legacy progress:", error);
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
        console.warn("Could not load dex selection:", error);
      }
    }

    const storedFlags = localStorage.getItem(FLAG_STORAGE_KEY);
    if (storedFlags) {
      try {
        const parsedFlags = JSON.parse(storedFlags);
        if (parsedFlags && typeof parsedFlags === "object") {
          FLAG_KEYS.forEach((flag) => {
            const perGame = parsedFlags[flag];
            if (perGame && typeof perGame === "object") {
              state.flagSets[flag] = Object.fromEntries(
                Object.entries(perGame).map(([gameId, ids]) => [
                  gameId,
                  normalizeStoredIds(ids),
                ])
              );
            }
          });
        }
      } catch (error) {
        console.warn("Could not load flag state:", error);
      }
    }

    const storedNotes = localStorage.getItem(GAME_NOTES_STORAGE_KEY);
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        if (parsedNotes && typeof parsedNotes === "object") {
          state.gameNotesByGame = Object.fromEntries(
            Object.entries(parsedNotes)
              .map(([gameId, note]) => [gameId, typeof note === "string" ? note : ""])
              .filter(([, note]) => note.length)
          );
        }
      } catch (error) {
        console.warn("Could not load game notes:", error);
      }
    }
  } catch (error) {
    console.warn("Could not load local data:", error);
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeCaughtState()));
    localStorage.setItem(FLAG_STORAGE_KEY, JSON.stringify(serializeFlagState()));
    LEGACY_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn("Could not clear legacy storage:", error);
      }
    });
  } catch (error) {
    console.warn("Could not save progress:", error);
  }
}

function persistDexSelection() {
  try {
    localStorage.setItem(
      DEX_SELECTION_STORAGE_KEY,
      JSON.stringify(getSerializableDexSelection())
    );
  } catch (error) {
    console.warn("Could not save dex selection:", error);
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
    updateGameNotesInput();
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
      dom.dexProgressBar.classList.remove("is-complete");
    }
    if (dom.dexProgressText) {
      dom.dexProgressText.textContent = "0 / 0 caught";
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
  const percentage = total ? Math.round((caught / total) * 100) : 0;
  if (dom.dexProgressText) {
    dom.dexProgressText.textContent = `${caught} / ${total} caught (${percentage}%)`;
  }
  if (dom.dexProgressBar) {
    dom.dexProgressBar.max = total;
    dom.dexProgressBar.value = caught;
    dom.dexProgressBar.textContent = `${percentage}%`;
    dom.dexProgressBar.classList.toggle("is-complete", percentage === 100);
  }
}

function renderDex() {
  const currentGame = getCurrentGame();
  if (!currentGame) {
    if (dom.dexGrid) dom.dexGrid.innerHTML = "<p>No game selected.</p>";
    if (dom.dexListBody) dom.dexListBody.innerHTML = "";
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    updateSpecialFilterControl({ mega: false, gmax: false });
    updateSpriteModeActions({ mega: false, gmax: false });
    updateGenderSpriteToggleVisibility(null);
    updateDexProgress([], new Set());
    updateViewToggleButtons();
    updateBoxControls();
    return;
  }

  const currentDex = getCurrentDex();
  if (!currentDex) {
    if (dom.dexGrid) dom.dexGrid.innerHTML = "<p>No Pokédex available.</p>";
    if (dom.dexListBody) dom.dexListBody.innerHTML = "";
    if (dom.emptyDialog?.open) dom.emptyDialog.close();
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    updateSpecialFilterControl({ mega: false, gmax: false });
    updateSpriteModeActions({ mega: false, gmax: false });
    updateGenderSpriteToggleVisibility(null);
    updateDexProgress([], new Set());
    updateViewToggleButtons();
    updateBoxControls();
    return;
  }

  updateGenderSpriteToggleVisibility(currentDex);

  if (currentDex.id === GENDER_DEX_ID) {
    const status = ensureGenderDexEntries(currentDex);
    if (status === "loading") {
      renderGenderDexLoading();
      return;
    }
    if (state.genderDex?.error) {
      renderGenderDexError();
      return;
    }
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
    if (state.entryCache) {
      state.entryCache.clear();
    }
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
  updateGameNotesInput();
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

function onGameNotesInput(event) {
  setGameNotes(event.target.value);
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
    dom.dexGrid.innerHTML = '<p class="loading-message">Loading Pokédex data…</p>';
  }

  let data;
  try {
    data = await ensurePokedexData();
    if (!data || !Array.isArray(data.games) || !data.games.length) {
      if (dom.dexGrid) {
        dom.dexGrid.innerHTML =
          "<p>No Pokédex data available. Check your internet connection.</p>";
      }
      return;
    }
  } catch (error) {
    console.error("Could not load Pokédex data:", error);
    if (dom.dexGrid) {
      dom.dexGrid.innerHTML =
        "<p>Could not load Pokédex data. Check your internet connection and try again.</p>";
    }
    return;
  }

  injectHomeGenderDex(data);
  state.pokedexData = data;

  state.variantsBySpecies = {
    mega: data?.variants?.mega || {},
    gmax: data?.variants?.gmax || {},
    special: data?.variants?.special || {},
  };
  state.variantDefinitionMap = buildVariantDefinitionMap(data?.variants?.all || []);
  state.variantGroupsBySpecies = groupVariantDefinitionsBySpecies(data?.variants?.all || []);

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
  dom.gameNotes?.addEventListener("input", onGameNotesInput);
  dom.sortSelect?.addEventListener("change", onSortChange);
  dom.caughtFilter?.addEventListener("change", onCaughtFilterChange);
  dom.specialFilter?.addEventListener("change", onSpecialFilterChange);
  dom.themeToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleTheme();
  });
  dom.controlsToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleControlsCollapsed();
  });
  dom.viewGridToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.GRID));
  dom.viewCompactToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.COMPACT));
  dom.viewListToggle?.addEventListener("click", () => setViewMode(VIEW_MODES.LIST));
  dom.selectAll?.addEventListener("click", selectAllVisible);
  dom.clearAll?.addEventListener("click", clearAllVisible);
  dom.exportData?.addEventListener("click", (event) => {
    event.preventDefault();
    exportTrackerData();
  });
  dom.importData?.addEventListener("click", (event) => {
    event.preventDefault();
    dom.importDataInput?.click();
  });
  dom.importDataInput?.addEventListener("change", onImportInputChange);
  dom.previousBox?.addEventListener("click", () => changeBox(-1));
  dom.nextBox?.addEventListener("click", () => changeBox(1));
  dom.boxInput?.addEventListener("change", onBoxInputChange);
  dom.boxInput?.addEventListener("keydown", onBoxInputKeyDown);
  dom.showDefaultSprites?.addEventListener("click", () => setSpriteMode("default"));
  dom.showShinySprites?.addEventListener("click", () => setSpriteMode("shiny"));
  dom.showMegaSprites?.addEventListener("click", () => setSpriteMode("mega"));
  dom.showGmaxSprites?.addEventListener("click", () => setSpriteMode("gmax"));
  dom.showNostalgiaSprites?.addEventListener("click", () => setSpriteMode("nostalgia"));
  dom.showGenderMale?.addEventListener("click", () => setGenderSpriteMode("male"));
  dom.showGenderFemale?.addEventListener("click", () => setGenderSpriteMode("female"));
  window.addEventListener("resize", onWindowResize);

  renderDex();
}

loadUiPreferences();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
