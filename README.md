# Living Dex Tracker

Een eenvoudige webapplicatie om een Living Dex bij te houden voor meerdere Pokémon-spellen.

## Functies

- Kies het spel waarvoor je de voortgang wilt zien.
- Wissel tussen de nationale Pokédex en de regionale varianten per spel.
- Bekijk een raster in de stijl van een Pokémon box met sprites en namen.
- Markeer welke Pokémon je hebt gevangen. De voortgang wordt lokaal opgeslagen in de browser.
- Zoek binnen de geselecteerde Living Dex.

## Projectstructuur

```
public/
├── data/
│   └── pokemon-data.js   # Lijst met beschikbare spellen en hun Pokédex-varianten
├── index.html            # Hoofdpagina van de applicatie
├── script.js             # Logica voor het bijhouden van de Living Dex
└── styles.css            # Styling voor de webapplicatie
```

## Zelf uitbreiden

Wil je extra spellen of Pokémon toevoegen? Pas dan `public/data/pokemon-data.js` aan. Voeg
bijvoorbeeld nieuwe entries toe aan de `SPECIES`-lijst en stel per spel één of meer
Pokédex-varianten samen via de `createDex`-helper.

## Lokaal bekijken

Gebruik een eenvoudige HTTP-server (zoals de ingebouwde server van VS Code of `python -m http.server`).
Navigeer vervolgens in je browser naar `http://localhost:8000/public/` en open `index.html`.
