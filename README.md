# Living Dex Tracker

Een eenvoudige webapplicatie om een Living Dex bij te houden voor meerdere Pokémon-spellen.

## Functies

- Kies het spel waarvoor je de voortgang wilt zien.
- Wissel tussen de nationale Pokédex en de regionale varianten per spel (zoals Paldea, Kitakami, Blueberry, Galar, Isle of Armor en Crown Tundra).
- Bekijk een raster in de stijl van een Pokémon box met sprites en namen.
- Markeer welke Pokémon je hebt gevangen. De voortgang wordt lokaal opgeslagen in de browser.
- Zoek binnen de geselecteerde Living Dex.
- Houd ook de complete Pokémon HOME Pokédex bij.

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

Wil je extra spellen of Pokédexen toevoegen? Pas dan `public/data/pokemon-data.js` aan.
De data wordt dynamisch opgehaald bij de [PokéAPI](https://pokeapi.co/). In het bestand
vind je een `GAME_CONFIG`-array. Voeg daar je spel aan toe en geef per Pokédex aan welke
PokéAPI `pokedex`-slug gebruikt moet worden. Als een dex meerdere mogelijke slugs heeft,
kun je een lijst opgeven; de loader probeert ze op volgorde totdat er een geldige reactie
komt.

## Lokaal bekijken

Gebruik een eenvoudige HTTP-server (zoals de ingebouwde server van VS Code of `python -m http.server`).
Navigeer vervolgens in je browser naar `http://localhost:8000/public/` en open `index.html`.

> ℹ️  De app haalt de volledige lijst van 1.025 Pokémon en alle regionale Pokédexen live op
> via de PokéAPI. Zorg dus voor een actieve internetverbinding bij het laden van de pagina.
