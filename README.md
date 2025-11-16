# Living Dex Tracker

A modern web app for tracking every Pokémon you have caught across the main-series games, Pokémon HOME, and the new Legends ZA entries.

## Features

- Pick any supported game and switch between its regional Pokédexes, specialty lists (such as "Alternate Forms", "Special Forms", or "All Pokémon"), and DLC dexes like Kitakami or Blueberry.
- Toggle between a full box-style grid, a compact box grid (6×5 to fit on a single screen), or a sortable list view with caught filters.
- View per-card Pokémon types, version-exclusive badges, Mega/G-Max/alpha/shiny toggles, and highlight Pokémon already caught in other games when browsing the HOME dex.
- Open a Pokémon's details to see its sprite, types, version exclusives, evolution line (with Mega/G-Max steps), gender differences, special forms, Serebii/Bulbapedia links, and fallback encounter hints.
- Track caught status, shiny/mega/G-Max/alpha flags, preferred dex per game, and personal notes. Everything is stored locally and survives refreshes.
- Export or import your full progress (including notes and UI preferences) as JSON for backups or device sync.
- Theme controls for light/dark mode plus sprite mode toggles (default, shiny, Mega, G-Max, nostalgia) and gender sprite buttons in the HOME gender dex.
- Netlify-ready static build with `netlify.toml`, so you can deploy the contents of `public/` without a build step.

## Project structure

```
public/
├── data/
│   └── pokemon-data.js   # Game + Pokédex definitions and data loaders
├── index.html            # Main application shell
├── script.js             # UI logic/state management
└── styles.css            # Styling/theme definitions
```

## Extending the dex data

The data loader relies on [PokéAPI](https://pokeapi.co/) and is configured through the `GAME_CONFIG` array in `public/data/pokemon-data.js`.

Useful knobs per Pokédex:

- `speciesOverrides`: swap base species for a specific form (e.g., Galarian Meowth) via the `form` key or by setting `variantRegionCode` to `A`, `G`, `H`, `P`, etc.
- `entryOverrides`: override dex numbers, names, or sprites per regional entry number.
- `manualEntries`: append additional entries with explicit numbering or references to existing dex numbers (handy for event-only Pokémon or alternate forms).
- `type: "aggregate"`: merge several earlier dexes into one list (duplicates filtered by catch key).
- `type: "regional-variants"`, `"mega-forms"`, `"gmax-forms"`, or `"special-forms"`: auto-build variant dexes per category.
- `type: "manual"`: build a Pokédex entirely from explicit `entries`.

Every game automatically receives a "Special Forms" dex that lists any non-regional, non-Mega/G-Max form differences relevant to that game.

## Running locally

Serve the `public/` directory with any static server (for example, `python -m http.server`). Then open `http://localhost:8000/public/` in your browser. The app fetches Pokédex data directly from PokéAPI, so keep an internet connection active during the initial load.

## Export & import

Use the **Export data** and **Import data** buttons in the control ribbon to back up or restore your progress. The exported JSON includes:

- Caught Pokémon per game
- Shiny/Mega/G-Max/alpha flags per Pokémon per game
- Preferred Pokédex per game
- Notes per game
- Theme and collapsed-filter preferences

Importing a file immediately applies the data and persists it to `localStorage`.

## Deploying on Netlify

This repository already contains a `netlify.toml` that points Netlify at the `public` directory and redirects all routes to `index.html`.

1. Create a new Netlify site from Git and select this repository.
2. Leave the build command empty and set the publish directory to `public`.
3. Deploy—the tracker will be available at your Netlify URL as soon as the upload finishes.

You can also upload the `public/` folder manually via the Netlify UI if you prefer drag-and-drop deployments.
