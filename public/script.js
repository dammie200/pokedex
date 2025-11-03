const BOX_SIZE = 30;
const STORAGE_KEY = "living-dex-state-v2";
const LEGACY_STORAGE_KEYS = ["living-dex-state-v1"];

const dom = {
  gameSelect: document.getElementById("game-select"),
  dexSelect: document.getElementById("dex-select"),
  searchInput: document.getElementById("search-input"),
  dexGrid: document.getElementById("dex-grid"),
  boxIndicator: document.getElementById("box-indicator"),
  boxInput: document.getElementById("box-input"),
  previousBox: document.getElementById("previous-box"),
  nextBox: document.getElementById("next-box"),
  emptyDialog: document.getElementById("empty-results"),
  closeEmptyResults: document.getElementById("close-empty-results"),
  cardTemplate: document.getElementById("pokemon-card-template"),
  detailsDialog: document.getElementById("pokemon-details"),
  closePokemonDetails: document.getElementById("close-pokemon-details"),
  detailName: document.getElementById("pokemon-detail-name"),
  detailNumber: document.getElementById("pokemon-detail-number"),
  detailTypes: document.getElementById("pokemon-detail-types"),
  detailSprite: document.getElementById("pokemon-detail-sprite"),
  detailHeight: document.getElementById("pokemon-detail-height"),
  detailWeight: document.getElementById("pokemon-detail-weight"),
  detailGames: document.getElementById("pokemon-detail-games"),
  detailEncounters: document.getElementById("pokemon-detail-encounters"),
  detailEvolution: document.getElementById("pokemon-detail-evolution"),
};

const state = {
  currentGameId: null,
  currentDexId: null,
  currentBox: 0,
  totalBoxes: 1,
  filters: {
    search: ""
  },
  caughtByGame: {},
  selectedDexByGame: {}
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

const VERSION_NAME_OVERRIDES = {
  'scarlet': 'Scarlet',
  'violet': 'Violet',
  'sword': 'Sword',
  'shield': 'Shield',
  'brilliant-diamond': 'Brilliant Diamond',
  'shining-pearl': 'Shining Pearl',
  'legends-arceus': 'Legends Arceus',
  'lets-go-pikachu': "Let's Go Pikachu",
  'lets-go-eevee': "Let's Go Eevee",
  'ultra-sun': 'Ultra Sun',
  'ultra-moon': 'Ultra Moon',
  'sun': 'Sun',
  'moon': 'Moon',
  'omega-ruby': 'Omega Ruby',
  'alpha-sapphire': 'Alpha Sapphire',
  'x': 'X',
  'y': 'Y',
  'black-2': 'Black 2',
  'white-2': 'White 2',
  'black': 'Black',
  'white': 'White',
  'heartgold': 'HeartGold',
  'soulsilver': 'SoulSilver',
  'platinum': 'Platinum',
  'emerald': 'Emerald',
  'ruby': 'Ruby',
  'sapphire': 'Sapphire',
  'diamond': 'Diamond',
  'pearl': 'Pearl',
  'gold': 'Gold',
  'silver': 'Silver',
  'crystal': 'Crystal',
  'red': 'Red',
  'blue': 'Blue',
  'yellow': 'Yellow',
};

const pokemonDetailsCache = new Map();
const pendingDetailRequests = new Map();
let lastFocusedElement = null;

const DEX_SELECTION_STORAGE_KEY = `${STORAGE_KEY}:dex-selection`;

async function ensurePokedexData() {
  if (window.POKEDEX_DATA && !window.POKEDEX_DATA.then) {
    return window.POKEDEX_DATA;
  }

  if (window.POKEDEX_DATA_PROMISE && typeof window.POKEDEX_DATA_PROMISE.then === "function") {
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

function titleCase(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(capitalizeWord)
    .join(" ");
}


function escapeSelector(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  let escaped = String(value);
  escaped = escaped.replace(/"/g, "\$&");
  escaped = escaped.replace(/\\/g, "\$&");
  return escaped;
}

function formatTypeName(typeSlug) {
  if (!typeSlug && typeSlug !== 0) return "";
  return titleCase(typeSlug);
}

function getTypeInfo(typeSlug) {
  if (!typeSlug && typeSlug !== 0) return null;
  const key = String(typeSlug).toLowerCase();
  return TYPE_COLORS[key] || null;
}

function renderTypeBadges(container, types = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(types) || !types.length) {
    return;
  }

  types.forEach((typeEntry) => {
    if (!typeEntry) return;
    const slug =
      typeof typeEntry === "string"
        ? typeEntry
        : typeEntry.slug || typeEntry.name || typeEntry.type?.name || "";
    const normalized = String(slug || "").toLowerCase();
    if (!normalized) return;
    const badge = document.createElement("span");
    badge.className = "pokemon-type-badge";
    const name =
      typeof typeEntry === "string"
        ? formatTypeName(typeEntry)
        : typeEntry.displayName || typeEntry.name || formatTypeName(normalized);
    badge.textContent = name;
    const info = getTypeInfo(normalized);
    if (info) {
      badge.style.backgroundColor = info.background;
      badge.style.borderColor = info.background;
      badge.style.color = info.color;
    }
    container.append(badge);
  });
}

function updateCardTypes(card, entry) {
  if (!card) return;
  const container = card.querySelector(".pokemon-types");
  if (!container) return;
  const cached = getCachedPokemonDetails(entry);
  if (cached?.types?.length) {
    renderTypeBadges(container, cached.types);
  } else if (Array.isArray(entry?.types) && entry.types.length) {
    renderTypeBadges(container, entry.types);
  } else {
    container.innerHTML = "";
  }

  ensurePokemonDetails(entry)
    .then((details) => {
      if (!details) return;
      const key = getEntryDetailKey(entry);
      if (!key) return;
      const selector = `.pokemon-card[data-entry-key="${escapeSelector(key)}"]`;
      const target = dom.dexGrid?.querySelector(selector);
      if (!target) return;
      const targetContainer = target.querySelector(".pokemon-types");
      renderTypeBadges(targetContainer, details.types || []);
    })
    .catch(() => {});
}

function getEntryDetailKey(entry) {
  if (!entry) return null;
  if (entry.key) return String(entry.key);
  const suffix = entry.form ? `:${entry.form}` : "";
  return `${entry.speciesId}${suffix}`;
}

function getCachedPokemonDetails(entry) {
  const key = getEntryDetailKey(entry);
  if (!key) return null;
  return pokemonDetailsCache.get(key) || null;
}

async function ensurePokemonDetails(entry) {
  const key = getEntryDetailKey(entry);
  if (!key) return null;
  if (pokemonDetailsCache.has(key)) {
    return pokemonDetailsCache.get(key);
  }
  if (pendingDetailRequests.has(key)) {
    return pendingDetailRequests.get(key);
  }
  if (typeof window.getPokemonDetails !== "function") {
    return null;
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
      throw error;
    });

  pendingDetailRequests.set(key, request);
  return request;
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

function formatVersionName(slug) {
  if (!slug && slug !== 0) return "";
  const normalized = String(slug).toLowerCase();
  return VERSION_NAME_OVERRIDES[normalized] || titleCase(normalized);
}

function formatLocationName(slug) {
  if (!slug && slug !== 0) return "";
  return titleCase(String(slug).replace(/_/g, " "));
}

function formatEncounterMethod(detail) {
  if (!detail) return "";
  const parts = [];
  const methodName = detail.method?.name;
  if (methodName) {
    parts.push(titleCase(methodName.replace(/_/g, " ")));
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
    const conditions = detail.condition_values
      .map((value) => titleCase(value.name.replace(/_/g, " ")))
      .join(", ");
    parts.push(conditions);
  }
  if (detail.time_of_day) {
    parts.push(titleCase(detail.time_of_day));
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
    parts.push(`Partijtype: ${titleCase(detail.party_type.name)}`);
  }
  if (detail.party_species) {
    parts.push(`Partij Pokémon: ${titleCase(detail.party_species.name)}`);
  }
  if (detail.held_item) {
    parts.push(`Houd ${titleCase(detail.held_item.name.replace(/_/g, " "))}`);
  }
  if (detail.item) {
    parts.push(`Gebruik ${titleCase(detail.item.name.replace(/_/g, " "))}`);
  }
  if (detail.known_move) {
    parts.push(`Kent ${titleCase(detail.known_move.name.replace(/_/g, " "))}`);
  }
  if (detail.known_move_type) {
    parts.push(`Met type ${titleCase(detail.known_move_type.name)}`);
  }
  if (detail.location) {
    parts.push(`Bij ${titleCase(detail.location.name.replace(/_/g, " "))}`);
  }
  if (detail.gender === 1) {
    parts.push("Vrouwelijk");
  } else if (detail.gender === 2) {
    parts.push("Mannelijk");
  }
  return parts.join(" • ") || "Standaard";
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

function renderAvailability(container, availability = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(availability) || !availability.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen koppelingen met geselecteerde games.";
    container.append(empty);
    return;
  }

  availability.forEach((entry) => {
    const wrapper = document.createElement("div");
    wrapper.className = "pokemon-details__game";
    const title = document.createElement("p");
    title.className = "pokemon-details__game-title";
    title.textContent = entry.gameName;
    wrapper.append(title);

    const list = document.createElement("ul");
    list.className = "pokemon-details__dexes";
    entry.dexes.forEach((dex) => {
      const item = document.createElement("li");
      item.textContent = dex.number ? `${dex.name} — ${dex.number}` : dex.name;
      list.append(item);
    });
    wrapper.append(list);
    container.append(wrapper);
  });
}

function renderEncounters(container, encounters = []) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(encounters) || !encounters.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-details__empty";
    empty.textContent = "Geen bekende vanglocaties.";
    container.append(empty);
    return;
  }

  encounters.forEach((entry) => {
    const block = document.createElement("div");
    block.className = "pokemon-details__encounter";
    const title = document.createElement("p");
    title.className = "pokemon-details__encounter-title";
    title.textContent = formatVersionName(entry.versionName || entry.version);
    block.append(title);

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
    block.append(list);
    container.append(block);
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
    const title = document.createElement("p");
    title.className = "pokemon-details__encounter-title";

    const fromNode = document.createElement(step.from?.isCurrent ? "strong" : "span");
    fromNode.textContent = step.from?.name || "Onbekend";
    const arrow = document.createTextNode(" → ");
    const toNode = document.createElement(step.to?.isCurrent ? "strong" : "span");
    toNode.textContent = step.to?.name || "Onbekend";

    title.append(fromNode, arrow, toNode);
    block.append(title);

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
}

function resolveSprite(entry, details) {
  if (details?.sprites) {
    if (details.sprites.home) return details.sprites.home;
    if (details.sprites.default) return details.sprites.default;
    if (details.sprites.artwork) return details.sprites.artwork;
  }
  if (entry?.sprite) return entry.sprite;
  if (typeof window.POKEDEX_DATA?.sprites?.default === "function") {
    const id = entry?.pokemonId || entry?.speciesId;
    return window.POKEDEX_DATA.sprites.default(id);
  }
  return "";
}

function showPokemonDetailsLoading(entry, availability) {
  if (!entry || !dom.detailsDialog) return;
  if (dom.detailName) dom.detailName.textContent = entry.name;
  if (dom.detailNumber)
    dom.detailNumber.textContent =
      entry.displayNumber || entry.displayNationalNumber || entry.displayDexNumber || "";

  const cached = getCachedPokemonDetails(entry);
  if (dom.detailTypes) {
    const types = cached?.types || entry.types || [];
    renderTypeBadges(dom.detailTypes, types);
  }
  if (dom.detailSprite) {
    const spriteUrl = resolveSprite(entry, cached || {});
    dom.detailSprite.src = spriteUrl || "";
    dom.detailSprite.alt = `${entry.name} sprite`;
  }
  if (dom.detailHeight) dom.detailHeight.textContent = "Laden…";
  if (dom.detailWeight) dom.detailWeight.textContent = "Laden…";
  renderAvailability(dom.detailGames, availability);
  if (dom.detailEncounters) {
    dom.detailEncounters.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailEncounters.append(loading);
  }
  if (dom.detailEvolution) {
    dom.detailEvolution.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "pokemon-details__empty";
    loading.textContent = "Gegevens worden geladen…";
    dom.detailEvolution.append(loading);
  }
}

function applyPokemonDetails(entry, details, availability) {
  if (dom.detailName) dom.detailName.textContent = details.name || entry.name;
  if (dom.detailNumber) {
    dom.detailNumber.textContent =
      entry.displayNumber || entry.displayNationalNumber || entry.displayDexNumber || details.number || "";
  }
  if (dom.detailTypes) {
    renderTypeBadges(dom.detailTypes, details.types || entry.types || []);
  }
  if (dom.detailSprite) {
    const spriteUrl = resolveSprite(entry, details);
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
  renderAvailability(dom.detailGames, availability);
  renderEncounters(dom.detailEncounters, details.encounters || []);
  renderEvolution(dom.detailEvolution, details.evolution || {}, entry);
}

function showPokemonDetailsError(message) {
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
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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

function normalizeStoredIds(ids) {
  if (!Array.isArray(ids)) return new Set();
  return new Set(
    ids
      .map((value) => {
        if (typeof value === "number") {
          return String(value);
        }
        if (typeof value === "string") {
          return value;
        }
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
          Array.isArray(ids)
            ? new Set(ids.map((value) => String(value)))
            : new Set()
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
            normalizeStoredIds(ids)
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

    const storedDexSelection = localStorage.getItem(
      DEX_SELECTION_STORAGE_KEY
    );
    if (storedDexSelection) {
      try {
        const dexSelection = JSON.parse(storedDexSelection);
        if (dexSelection && typeof dexSelection === "object") {
          state.selectedDexByGame = Object.fromEntries(
            Object.entries(dexSelection).map(([gameId, dexId]) => [
              gameId,
              String(dexId)
            ])
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
        Array.from(idSet.values())
      ])
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    LEGACY_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (cleanupError) {
        console.warn("Kon legacy opslag niet verwijderen:", cleanupError);
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

function setCurrentDex(dexId, shouldPersist = true) {
  state.currentDexId = dexId;
  if (state.currentGameId) {
    state.selectedDexByGame[state.currentGameId] = dexId;
    if (shouldPersist) {
      persistDexSelection();
    }
  }
}

function getDexesForGame(game) {
  if (!game) return [];
  return Array.isArray(game.dexes) ? game.dexes : [];
}

function getCurrentDex() {
  const game = getCurrentGame();
  const dexes = getDexesForGame(game);
  if (!dexes.length) return null;

  let currentDex = dexes.find((dex) => dex.id === state.currentDexId) || null;

  if (!currentDex) {
    currentDex = dexes[0];
    setCurrentDex(currentDex.id);
    if (dom.dexSelect) {
      dom.dexSelect.value = currentDex.id;
    }
  }

  return currentDex;
}

function populateGameSelect() {
  const games = getGames();
  dom.gameSelect.innerHTML = "";
  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.id;
    option.textContent = game.name;
    dom.gameSelect.append(option);
  });

  if (games.length) {
    const storedGame = localStorage.getItem(`${STORAGE_KEY}:current-game`);
    const defaultGameId = storedGame && games.some((g) => g.id === storedGame)
      ? storedGame
      : games[0].id;
    dom.gameSelect.value = defaultGameId;
    state.currentGameId = defaultGameId;
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
  const defaultDexId =
    storedDexId && dexes.some((dex) => dex.id === storedDexId)
      ? storedDexId
      : dexes[0].id;

  dom.dexSelect.value = defaultDexId;
  setCurrentDex(defaultDexId, false);
  persistDexSelection();
}

function onGameChange(event) {
  state.currentGameId = event.target.value;
  state.currentBox = 0;
  localStorage.setItem(`${STORAGE_KEY}:current-game`, state.currentGameId);
  populateDexSelect();
  renderDex();
}

function onSearchInput(event) {
  state.filters.search = event.target.value.toLowerCase();
  state.currentBox = 0;
  renderDex();
}

function onDexChange(event) {
  setCurrentDex(event.target.value);
  state.currentBox = 0;
  renderDex();
}

function changeBox(step) {
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

function updateBoxIndicator(current, total) {
  if (dom.boxIndicator) {
    dom.boxIndicator.textContent = `Box ${current + 1} / ${total}`;
  }
  if (dom.boxInput) {
    dom.boxInput.max = total;
    dom.boxInput.value = Math.min(total, Math.max(1, current + 1));
    dom.boxInput.disabled = total <= 1;
  }
}

function matchesSearch(entry, searchTerm) {
  if (!searchTerm) return true;
  const normalized = searchTerm.trim();
  if (!normalized) return true;
  const lower = normalized.toLowerCase();
  const name = entry.name.toLowerCase();
  if (name.includes(lower)) return true;

  const dexNumber = entry.displayDexNumber?.toLowerCase?.() ?? "";
  const nationalNumber = entry.displayNationalNumber?.toLowerCase?.() ?? "";
  const combinedNumber = entry.displayNumber?.toLowerCase?.() ?? "";
  return (
    dexNumber.includes(lower) ||
    nationalNumber.includes(lower) ||
    combinedNumber.includes(lower)
  );
}

function renderDex() {
  const currentGame = getCurrentGame();
  if (!currentGame) {
    dom.dexGrid.innerHTML = "<p>Geen spel geselecteerd.</p>";
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    return;
  }

  const searchTerm = state.filters.search;
  const currentDex = getCurrentDex();
  if (!currentDex) {
    dom.dexGrid.innerHTML = "<p>Geen Pokédex beschikbaar.</p>";
    if (dom.emptyDialog.open) {
      dom.emptyDialog.close();
    }
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    return;
  }

  const dexEntries = Array.isArray(currentDex?.entries)
    ? currentDex.entries
    : [];
  const filtered = dexEntries.filter((entry) => matchesSearch(entry, searchTerm));

  if (!filtered.length) {
    dom.dexGrid.innerHTML = "";
    if (!dom.emptyDialog.open) {
      dom.emptyDialog.showModal();
    }
    state.totalBoxes = 1;
    updateBoxIndicator(0, 1);
    return;
  }

  if (dom.emptyDialog.open) {
    dom.emptyDialog.close();
  }

  const totalBoxes = Math.max(1, Math.ceil(filtered.length / BOX_SIZE));
  if (state.currentBox >= totalBoxes) {
    state.currentBox = totalBoxes - 1;
  }
  state.totalBoxes = totalBoxes;

  const startIndex = state.currentBox * BOX_SIZE;
  const endIndex = startIndex + BOX_SIZE;
  const entriesToRender = filtered.slice(startIndex, endIndex);

  dom.dexGrid.replaceChildren();
  const fragment = document.createDocumentFragment();
  const caughtSet = getCaughtSet(state.currentGameId);

  entriesToRender.forEach((entry) => {
    const card = dom.cardTemplate.content.firstElementChild.cloneNode(true);
    const sprite = card.querySelector(".pokemon-sprite");
    const number = card.querySelector(".pokemon-number");
    const name = card.querySelector(".pokemon-name");

    number.textContent = entry.displayNumber || "";
    name.textContent = entry.name;
    name.setAttribute("aria-label", `Toon details voor ${entry.name}`);

    const cachedDetails = getCachedPokemonDetails(entry) || {};
    const spriteUrl = resolveSprite(entry, cachedDetails);
    sprite.src = spriteUrl || "";
    sprite.alt = `${entry.name} sprite`;

    const catchKey = entry.key;
    const isCaught = catchKey ? caughtSet.has(catchKey) : false;
    card.dataset.id = catchKey;
    card.dataset.caught = String(isCaught);
    const detailKey = getEntryDetailKey(entry);
    if (detailKey) {
      card.dataset.entryKey = detailKey;
    }

    card.addEventListener("click", () => toggleCaught(catchKey));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCaught(catchKey);
      }
    });

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

    updateCardTypes(card, entry);
    fragment.append(card);
  });

  dom.dexGrid.append(fragment);
  updateBoxIndicator(state.currentBox, totalBoxes);
}


function toggleCaught(catchKey) {
  if (!catchKey) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  if (caughtSet.has(catchKey)) {
    caughtSet.delete(catchKey);
  } else {
    caughtSet.add(catchKey);
  }

  persistState();
  updateCard(catchKey);
}

function updateCard(catchKey) {
  const selector = `.pokemon-card[data-id="${catchKey}"]`;
  const card = dom.dexGrid.querySelector(selector);
  if (!card) return;
  const caughtSet = getCaughtSet(state.currentGameId);
  card.dataset.caught = String(caughtSet.has(String(catchKey)));
}

function setupDialog() {
  dom.closeEmptyResults.addEventListener("click", () => {
    dom.emptyDialog.close();
    dom.searchInput.focus();
  });

  dom.emptyDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dom.emptyDialog.close();
  });
}

async function init() {
  dom.dexGrid.innerHTML = "<p class=\"loading-message\">Pokédexgegevens laden…</p>";

  try {
    const data = await ensurePokedexData();
    if (!data || !Array.isArray(data.games) || !data.games.length) {
      dom.dexGrid.innerHTML =
        "<p>Geen Pokédex data beschikbaar. Controleer je internetverbinding.</p>";
      return;
    }
  } catch (error) {
    console.error("Kon Pokédex data niet laden:", error);
    dom.dexGrid.innerHTML =
      "<p>Kon Pokédex data niet laden. Controleer je internetverbinding en probeer opnieuw.</p>";
    return;
  }

  loadState();
  populateGameSelect();
  populateDexSelect();
  setupDialog();
  setupDetailsDialog();

  dom.gameSelect.addEventListener("change", onGameChange);
  if (dom.dexSelect) {
    dom.dexSelect.addEventListener("change", onDexChange);
  }
  dom.searchInput.addEventListener("input", onSearchInput);
  dom.previousBox.addEventListener("click", () => changeBox(-1));
  dom.nextBox.addEventListener("click", () => changeBox(1));
  if (dom.boxInput) {
    dom.boxInput.addEventListener("change", onBoxInputChange);
    dom.boxInput.addEventListener("keydown", onBoxInputKeyDown);
  }

  renderDex();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
