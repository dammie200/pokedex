# Living Dex Tracker

Een eenvoudige webapplicatie om een Living Dex bij te houden voor meerdere Pokémon-spellen.

## Functies

- Kies het spel waarvoor je de voortgang wilt zien.
- Wissel tussen regionale Pokédexen, Nationale lijsten, "Other Available Pokémon"-lijsten en nieuwe categorieën zoals "Alternate Forms" en "All Pokémon" per spel (bijv. Paldea, Kitakami, Blueberry, Galar, Isle of Armor, Crown Tundra of de Kanto-varianten van Let's Go). Ook de klassieke releases van Sun/Moon tot en met Gold/Silver/Crystal beschikken nu over hun National Pokédex.
- Wissel tussen een raster in de stijl van een Pokémon-box, een compacte sprite-boxweergave en een lijstweergave met sorteer- en statusfilters.
- Bekijk per kaart of lijstregel de typen van de Pokémon dankzij compacte typebadges.
- Klik op de naam van een Pokémon voor een gedetailleerd overzicht met types, 3D-sprite, vanglocaties (inclusief fallback-locaties voor nieuwere spellen), evoluties en in welke spellen de soort beschikbaar is.
- Volg je voortgang per Pokédex met een live voortgangsbalk en markeer Pokémon afzonderlijk of in bulk via de “Alles selecteren/Alles wissen”-acties. De voortgang wordt lokaal opgeslagen in de browser.
- Herken Mega-evoluties en Gigantamax-vormen via speciale iconen en open hun detailkaarten rechtstreeks vanuit de basisvorm.
- Toon naar wens Shiny-, Mega-, Gigantamax- of nostalgische sprites in de boxweergave en filter in de Pokémon HOME Pokédex op soorten met een Mega- of G-Max-variant.
- Navigeer sneller tussen boxen of typ direct het gewenste boxnummer in het nieuwe boxveld.
- Markeer welke Pokémon je hebt gevangen. De voortgang wordt lokaal opgeslagen in de browser.
- Zoek binnen de geselecteerde Living Dex.
- Houd ook de complete Pokémon HOME Pokédex bij en kies daarnaast voor de nieuwe Legends ZA Pokédex.
- Ondersteuning uitgebreid met klassieke spellen van Red/Blue tot en met Ultra Sun & Ultra Moon (inclusief Mega-overzichtsdexen waar relevant).
- Nummering toont nu het regionale dexnummer gevolgd door het nationale nummer (bijv. `#031 (#079*G)` voor Galarian Slowpoke). Een `*` met regioletter onderscheidt regionale vormen.
- Regionale vormen gebruiken nu automatisch de bijbehorende PokéAPI `pokemon-form` sprites, zodat Alolan, Galarian, Hisuian en Paldean varianten correct worden weergegeven.

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

### Handige velden in `GAME_CONFIG`

- `speciesOverrides` (per Pokédex): hiermee kun je basissoorten vervangen door een regionale variant (bijv. Galarian Meowth). Gebruik de `form`-sleutel met een bekende vormcode (zoals `galar`, `hisui`, `paldea-combat`) of zet `variantRegionCode` op `A`, `G`, `H`, `P`, … om automatisch de juiste vorm, sprite en vangstsleutel te kiezen.
- `entryOverrides`: overschrijft individuele dex-entry's (nummer, naam of sprite) op basis van het Pokédex-volgnummer.
- `manualEntries`: voeg extra entries toe aan een regionale dex met een eigen volgnummer en eventuele vorm. Gebruik optioneel `referenceDexNumber` om de soort van een bestaande Pokédex-entry te hergebruiken of `variantRegionCode` voor automatische variant-keuze.
- `type: "aggregate"` combineert meerdere eerder gedefinieerde dexen in één lijst (zoals "All Pokémon"). Dubbele soorten worden automatisch gefilterd op basis van hun vangstsleutel.
- `type: "regional-variants"` genereert automatisch een lijst met alle bekende regionale vormen (handig voor Pokémon HOME).
- `type: "other-available"`-dexen stellen automatisch een lijst samen op basis van PokéAPI `version-group` data en sluiten eerder gedefinieerde dexen uit. Gebruik `versionGroups` om de relevante versies te benoemen, `excludeDexIds` om overlappende dexen weg te filteren, en `ensureSpecies`, `speciesOverrides` of `manualEntries` voor eventuele event- of vormspecifieke aanvullingen.
- `type: "manual"` blijft beschikbaar voor volledig handmatige lijsten (bijv. wanneer er geen betrouwbare bron bestaat).

Bij het tonen van een Pokémon wordt automatisch het regionale nummer gecombineerd met het nationale nummer, inclusief regioletter voor varianten. Daardoor zie je in één oogopslag welke vorm het betreft en hoe deze in de nationale Pokédex valt.

> ⚠️  Lokale voortgang uit oudere versies (`living-dex-state-v1`) wordt automatisch gemigreerd naar het nieuwe opslagformaat (`living-dex-state-v2`).

## Lokaal bekijken

Gebruik een eenvoudige HTTP-server (zoals de ingebouwde server van VS Code of `python -m http.server`).
Navigeer vervolgens in je browser naar `http://localhost:8000/public/` en open `index.html`.

> ℹ️  De app haalt de volledige lijst van 1.025 Pokémon en alle regionale Pokédexen live op
> via de PokéAPI. Zorg dus voor een actieve internetverbinding bij het laden van de pagina.
