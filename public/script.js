const BOX_SIZE = 30;
const STORAGE_KEY = "living-dex-state-v2";
const LEGACY_STORAGE_KEYS = ["living-dex-state-v1"];

const dom = {
  gameSelect: document.getElementById("game-select"),
  dexSelect: document.getElementById("dex-select"),
  searchInput: document.getElementById("search-input"),
  dexGrid: document.getElementById("dex-grid"),
  boxIndicator: document.getElementById("box-indicator"),
  previousBox: document.getElementById("previous-box"),
  nextBox: document.getElementById("next-box"),
  emptyDialog: document.getElementById("empty-results"),
  closeEmptyResults: document.getElementById("close-empty-results"),
  cardTemplate: document.getElementById("pokemon-card-template")
};

const state = {
  currentGameId: null,
  currentDexId: null,
  currentBox: 0,
  filters: {
    search: ""
  },
  caughtByGame: {},
  selectedDexByGame: {}
};

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
  state.currentBox = Math.max(0, state.currentBox + step);
  renderDex();
}

function updateBoxIndicator(current, total) {
  dom.boxIndicator.textContent = `Box ${current + 1} / ${total}`;
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
    return;
  }

  const searchTerm = state.filters.search;
  const currentDex = getCurrentDex();
  if (!currentDex) {
    dom.dexGrid.innerHTML = "<p>Geen Pokédex beschikbaar.</p>";
    if (dom.emptyDialog.open) {
      dom.emptyDialog.close();
    }
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

  const start = state.currentBox * BOX_SIZE;
  const end = start + BOX_SIZE;
  const entriesToRender = filtered.slice(start, end);

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

    const spriteUrl = entry.sprite ||
      window.POKEDEX_DATA?.sprites?.default?.(entry.speciesId);
    sprite.src = spriteUrl || "";
    sprite.alt = `${entry.name} sprite`;

    const catchKey = entry.key;
    const isCaught = catchKey ? caughtSet.has(catchKey) : false;
    card.dataset.id = catchKey;
    card.dataset.caught = String(isCaught);

    card.addEventListener("click", () => toggleCaught(catchKey));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCaught(catchKey);
      }
    });

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

  dom.gameSelect.addEventListener("change", onGameChange);
  if (dom.dexSelect) {
    dom.dexSelect.addEventListener("change", onDexChange);
  }
  dom.searchInput.addEventListener("input", onSearchInput);
  dom.previousBox.addEventListener("click", () => changeBox(-1));
  dom.nextBox.addEventListener("click", () => changeBox(1));

  renderDex();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
