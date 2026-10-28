export type Language = 'en' | 'es'

export type Translations = {
  // Header
  header: {
    home: string
    pokedex: string
    play: string
    menu: string
    close: string
    search: string
  }
  // Home page
  home: {
    title: string
    subtitle: string
    pokemonOfTheDay: string
    randomPokemon: string
    byTheNumbers: string
    totalPokemon: string
    speciesDiscovered: string
    types: string
    uniqueTypes: string
    generations: string
    pokemonGenerations: string
    didYouKnow: string
    browseByCategory: string
    byGeneration: string
    region: string
    generation: string
  }
  // Pokémon detail page
  pokemon: {
    type: string
    physicalStats: string
    height: string
    weight: string
    abilities: string
    hidden: string
    baseStats: string
    total: string
    description: string
    typeEffectiveness: string
    weakTo: string
    resistantTo: string
    immuneTo: string
    none: string
    evolutionChain: string
    forms: string
    // Phase 1 additions
    category: string
    cry: string
    playCry: string
    latestCry: string
    legacyCry: string
    breeding: string
    eggGroups: string
    genderRatio: string
    hatchSteps: string
    baseHappiness: string
    training: string
    captureRate: string
    baseExperience: string
    growthRate: string
    habitat: string
    shape: string
    generation: string
    baby: string
    legendary: string
    mythical: string
    // Evolution conditions
    evolveLevel: string
    evolveItem: string
    evolveTrade: string
    evolveHappiness: string
    evolveAffection: string
    evolveHeldItem: string
    evolveKnownMove: string
    evolveKnownMoveType: string
    evolveLocation: string
    evolveTimeOfDay: string
    evolveTradeWith: string
    evolveRain: string
    evolveUpsideDown: string
    evolvePartySpecies: string
    evolvePartyType: string
    evolveGenderMale: string
    evolveGenderFemale: string
    evolveBeauty: string
    evolvePhysicalStatsHigher: string
    evolvePhysicalStatsEqual: string
    evolvePhysicalStatsLower: string
    heldItems: string
    heldItemRarity: string
    genderless: string
    previousSprite: string
    nextSprite: string
    recent: string
    compare: string
  }
  // Pokémon species metadata lookups
  eggGroups: Record<string, string>
  habitats: Record<string, string>
  shapes: Record<string, string>
  growthRates: Record<string, string>
  timeOfDay: Record<string, string>
  evolutionItems: Record<string, string>
  spriteLabels: Record<string, string>
  // Modal
  modal: {
    close: string
    closeHint: string
  }
  // Infinite scroll
  scroll: {
    loadingMore: string
    caughtAll: string
    showingAll: string
  }
  // Type and Generation pages
  pages: {
    typeTitle: string
    speciesCount: string
    backToHome: string
    region: string
    back: string
    allGenerations: string
    allTypes: string
  }
  // Errors
  errors: {
    loadFailed: string
  }
  // Theme
  theme: {
    light: string
    dark: string
    auto: string
    label: string
  }
  // Search
  search: {
    placeholder: string
    loading: string
    noResults: string
  }
  // Stats (these will be fetched from API when possible)
  stats: {
    hp: string
    attack: string
    defense: string
    specialAttack: string
    specialDefense: string
    speed: string
  }
  // Pokémon types
  types: {
    normal: string
    fire: string
    water: string
    electric: string
    grass: string
    ice: string
    fighting: string
    poison: string
    ground: string
    flying: string
    psychic: string
    bug: string
    rock: string
    ghost: string
    dragon: string
    dark: string
    steel: string
    fairy: string
  }
  // Fun facts
  funFacts: string[]
  // Settings
  settings: {
    title: string
    theme: string
    language: string
    auto: string
    light: string
    dark: string
  }
  // Footer
  footer: {
    legal: string
    dataBy: string
    builtWith: string
  }
  play: {
    title: string
    compare: string
    team: string
    battle: string
    typeToSearch: string
  }
  quiz: {
    title: string
    subtitle: string
    question: string
    correct: string
    wrong: string
    score: string
    streak: string
    best: string
    next: string
    reveal: string
    gen: string
    allGens: string
  }
  compare: {
    title: string
    subtitle: string
    first: string
    second: string
    pick: string
    swap: string
    total: string
    matchup: string
    dealsTo: string
    neutral: string
    openDetail: string
  }
  battle: {
    title: string
    subtitle: string
    intro: string
    loading: string
    pick: string
    random: string
    target: string
    yours: string
    hint: string
    reroll: string
    reelGen: string
    redraw: string
    history: string
    onlyWins: string
    noWins: string
    clearHistory: string
    resultWin: string
    resultLose: string
    resultTie: string
    unlocked: string
    unlockedAll: string
    lockedHint: string
    stepPokemon: string
    fight: string
    summary: string
    backToSetup: string
    legendary: string
    legendaryHint: string
    legendaryDone: string
    mode: string
    classic: string
    survival: string
    survivalHint: string
    streak: string
    bestStreak: string
    nextOpponent: string
    newRun: string
    runOver: string
    redrawWin: string
    spinning: string
    finale: string
    win: string
    lose: string
    tie: string
    again: string
  }
  team: {
    title: string
    subtitle: string
    empty: string
    addMember: string
    remove: string
    clear: string
    full: string
    coverage: string
    coverageHint: string
    weak: string
    resist: string
    immune: string
    noWeakness: string
    uncovered: string
    add: string
    inTeam: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      home: 'Home',
      pokedex: 'Pokédex',
      play: 'Games',
      menu: 'Menu',
      close: 'Close',
      search: 'Search',
    },
    home: {
      title: "Gotta catch 'em all!",
      subtitle: '{count} Pokemon and counting.',
      pokemonOfTheDay: 'Pokémon of the day',
      randomPokemon: 'Surprise me',
      byTheNumbers: 'By the Numbers',
      totalPokemon: 'Total Pokémon',
      speciesDiscovered: 'Species discovered across all regions',
      types: 'Types',
      uniqueTypes: 'Unique type categories',
      generations: 'Generations',
      pokemonGenerations: 'Pokémon generations',
      didYouKnow: '💡 Did You Know?',
      browseByCategory: 'Browse by Category',
      byGeneration: 'By Generation',
      region: 'Region',
      generation: 'Generation',
    },
    pokemon: {
      type: 'Type',
      physicalStats: 'Physical Stats',
      height: 'Height',
      weight: 'Weight',
      abilities: 'Abilities',
      hidden: 'Hidden',
      baseStats: 'Base Stats',
      total: 'Total',
      description: 'Description',
      typeEffectiveness: 'Type Effectiveness',
      weakTo: 'Weak To',
      resistantTo: 'Resistant To',
      immuneTo: 'Immune To',
      none: 'None',
      evolutionChain: 'Evolution Chain',
      forms: 'Forms',
      category: 'Category',
      cry: 'Cry',
      playCry: 'Play Cry',
      latestCry: 'Latest',
      legacyCry: 'Classic',
      breeding: 'Breeding',
      eggGroups: 'Egg Groups',
      genderRatio: 'Gender Ratio',
      hatchSteps: 'Hatch Steps',
      baseHappiness: 'Base Happiness',
      training: 'Training',
      captureRate: 'Catch Rate',
      baseExperience: 'Base EXP',
      growthRate: 'Growth Rate',
      habitat: 'Habitat',
      shape: 'Shape',
      generation: 'Generation',
      baby: 'Baby',
      legendary: 'Legendary',
      mythical: 'Mythical',
      evolveLevel: 'Lv. {level}',
      evolveItem: '{item}',
      evolveTrade: 'Trade',
      evolveHappiness: 'Happiness ≥ {value}',
      evolveAffection: 'Affection ≥ {value}',
      evolveHeldItem: 'Hold {item}',
      evolveKnownMove: 'Know {move}',
      evolveKnownMoveType: 'Know {type}-type move',
      evolveLocation: 'At {location}',
      evolveTimeOfDay: '{time}',
      evolveTradeWith: 'Trade for {species}',
      evolveRain: 'During rain',
      evolveUpsideDown: 'Upside down',
      evolvePartySpecies: '{species} in party',
      evolvePartyType: '{type}-type in party',
      evolveGenderMale: '♂ Male only',
      evolveGenderFemale: '♀ Female only',
      evolveBeauty: 'Beauty ≥ {value}',
      evolvePhysicalStatsHigher: 'Atk > Def',
      evolvePhysicalStatsEqual: 'Atk = Def',
      evolvePhysicalStatsLower: 'Atk < Def',
      heldItems: 'Held Items',
      heldItemRarity: '{rarity}% chance',
      genderless: 'Genderless',
      previousSprite: 'Previous sprite',
      nextSprite: 'Next sprite',
      recent: 'Recent',
      compare: 'Compare',
    },
    eggGroups: {
      monster: 'Monster',
      water1: 'Water 1',
      water2: 'Water 2',
      water3: 'Water 3',
      bug: 'Bug',
      flying: 'Flying',
      ground: 'Field',
      fairy: 'Fairy',
      plant: 'Grass',
      humanshape: 'Human-Like',
      mineral: 'Mineral',
      amorphous: 'Amorphous',
      ditto: 'Ditto',
      dragon: 'Dragon',
      'no-eggs': 'No Eggs',
      undiscovered: 'Undiscovered',
      indeterminate: 'Amorphous',
    },
    habitats: {
      cave: 'Cave',
      forest: 'Forest',
      grassland: 'Grassland',
      mountain: 'Mountain',
      rare: 'Rare',
      'rough-terrain': 'Rough Terrain',
      sea: 'Sea',
      urban: 'Urban',
      'waters-edge': "Water's Edge",
    },
    shapes: {
      ball: 'Ball',
      squiggle: 'Squiggle',
      fish: 'Fish',
      arms: 'Arms',
      blob: 'Blob',
      upright: 'Upright',
      legs: 'Legs',
      quadruped: 'Quadruped',
      wings: 'Wings',
      tentacles: 'Tentacles',
      heads: 'Multiple Bodies',
      humanoid: 'Humanoid',
      'bug-wings': 'Bug Wings',
      armor: 'Armor',
    },
    growthRates: {
      slow: 'Slow',
      medium: 'Medium',
      fast: 'Fast',
      'medium-slow': 'Medium Slow',
      'slow-then-very-fast': 'Erratic',
      'fast-then-very-slow': 'Fluctuating',
    },
    timeOfDay: {
      day: 'Daytime',
      night: 'Nighttime',
      '': '',
    },
    evolutionItems: {
      'water-stone': 'Water Stone',
      'thunder-stone': 'Thunder Stone',
      'fire-stone': 'Fire Stone',
      'leaf-stone': 'Leaf Stone',
      'moon-stone': 'Moon Stone',
      'sun-stone': 'Sun Stone',
      'shiny-stone': 'Shiny Stone',
      'dusk-stone': 'Dusk Stone',
      'dawn-stone': 'Dawn Stone',
      'ice-stone': 'Ice Stone',
      'linking-cord': 'Linking Cord',
      'razor-claw': 'Razor Claw',
      'razor-fang': 'Razor Fang',
      electirizer: 'Electirizer',
      magmarizer: 'Magmarizer',
      protector: 'Protector',
      'reaper-cloth': 'Reaper Cloth',
      'dubious-disc': 'Dubious Disc',
      upgrade: 'Upgrade',
      'prism-scale': 'Prism Scale',
      'oval-stone': 'Oval Stone',
      'kings-rock': "King's Rock",
      'metal-coat': 'Metal Coat',
      'dragon-scale': 'Dragon Scale',
      'deep-sea-tooth': 'Deep Sea Tooth',
      'deep-sea-scale': 'Deep Sea Scale',
      sachet: 'Sachet',
      'whipped-dream': 'Whipped Dream',
      'black-augurite': 'Black Augurite',
      'peat-block': 'Peat Block',
      'auspicious-armor': 'Auspicious Armor',
      'malicious-armor': 'Malicious Armor',
      'chipped-pot': 'Chipped Pot',
      'cracked-pot': 'Cracked Pot',
      'galarica-cuff': 'Galarica Cuff',
      'galarica-wreath': 'Galarica Wreath',
      'sweet-apple': 'Sweet Apple',
      'tart-apple': 'Tart Apple',
      'scroll-of-darkness': 'Scroll of Darkness',
      'scroll-of-waters': 'Scroll of Waters',
      'syrupy-apple': 'Syrupy Apple',
      'unremarkable-teacup': 'Unremarkable Teacup',
      'masterpiece-teacup': 'Masterpiece Teacup',
      'metal-alloy': 'Metal Alloy',
    },
    spriteLabels: {
      officialArtwork: 'Official Artwork',
      officialShiny: 'Official Shiny',
      home: 'Pokémon HOME',
      homeShiny: 'HOME Shiny',
      dreamWorld: 'Dream World',
      showdown: 'Showdown',
      showdownShiny: 'Showdown Shiny',
      default: 'Default',
      defaultShiny: 'Shiny',
    },
    modal: {
      close: 'Close',
      closeHint: 'Click anywhere or press Escape to close',
    },
    scroll: {
      loadingMore: 'Loading more Pokémon...',
      caughtAll: "You've caught 'em all! 🎉",
      showingAll: 'Showing all {count} Pokémon',
    },
    pages: {
      typeTitle: 'Type',
      speciesCount: '{count} Pokémon species',
      backToHome: 'Back to Home',
      region: 'Region',
      back: 'Back',
      allGenerations: 'All generations',
      allTypes: 'All types',
    },
    errors: {
      loadFailed:
        'Failed to load additional Pokemon data. Please try again later.',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      label: 'Select theme',
    },
    search: {
      placeholder: 'Search Pokémon...',
      loading: 'Loading...',
      noResults: 'No Pokémon found',
    },
    stats: {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      specialAttack: 'Sp. Atk',
      specialDefense: 'Sp. Def',
      speed: 'Speed',
    },
    types: {
      normal: 'Normal',
      fire: 'Fire',
      water: 'Water',
      electric: 'Electric',
      grass: 'Grass',
      ice: 'Ice',
      fighting: 'Fighting',
      poison: 'Poison',
      ground: 'Ground',
      flying: 'Flying',
      psychic: 'Psychic',
      bug: 'Bug',
      rock: 'Rock',
      ghost: 'Ghost',
      dragon: 'Dragon',
      dark: 'Dark',
      steel: 'Steel',
      fairy: 'Fairy',
    },
    funFacts: [
      "Pikachu was originally going to be called 'Pikachuu' before it was shortened",
      'Rhydon was the first Pokémon ever created and designed',
      'Ditto and Mew share the same color palette and weight—a sign of their possible connection',
      'The Pokémon anime has been running for over 25 years with more than 1,000 episodes',
      'There are more Pokémon species than there are countries in the world',
      'Azurill is the only Pokémon that can change gender when it evolves',
      'Slowpoke tails are considered a delicacy in the Pokémon world',
      'Wobbuffet was originally designed as a punching bag—its body is actually a decoy',
      "Pikachu's name comes from 'pika' (sparkle) and 'chu' (squeak sound)",
      'Magikarp can jump over mountains, but only in the Pokédex entries',
      "Cubone wears its deceased mother's skull—nobody knows what it looks like underneath",
      'Yamask carries a mask that was once its human face from a past life',
      "Gengar is said to be Clefable's shadow—they have nearly identical silhouettes",
      'Spinda has over 4 billion possible spot patterns, making each one unique',
      'Arcanine was originally planned to be a legendary Pokémon',
      "Poliwag's swirl pattern is based on visible tadpole intestines",
      'Hitmonchan and Hitmonlee are named after Jackie Chan and Bruce Lee',
      "Vaporeon's cellular structure is similar to water, allowing it to melt into water",
      "The cry of Charizard in Generation I is the same as Rhyhorn's cry",
      'Psychic was the most overpowered type in Gen I with no real counters',
    ],
    settings: {
      title: 'Configure Pokédex',
      theme: 'Display Mode',
      language: 'Language',
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
    footer: {
      legal:
        'Fan-made project — not affiliated with Nintendo, Game Freak, or The Pokémon Company. All Pokémon trademarks belong to their respective owners.',
      dataBy: 'Data by',
      builtWith: 'Built with',
    },
    play: {
      title: 'Play',
      compare: 'Compare',
      team: 'Team builder',
      battle: 'Stats Battle',
      typeToSearch: 'Type to search...',
    },
    quiz: {
      title: "Who's that Pokémon?",
      subtitle: 'Guess the silhouette. Four options, one is right.',
      question: 'Who is it?',
      correct: "That's right!",
      wrong: 'Not quite. It was',
      score: 'Score',
      streak: 'Streak',
      best: 'Best streak',
      next: 'Next',
      reveal: 'Reveal',
      gen: 'Generation',
      allGens: 'All generations',
    },
    compare: {
      title: 'Compare',
      subtitle: 'Pick two Pokémon and put their base stats side by side.',
      first: 'First Pokémon',
      second: 'Second Pokémon',
      pick: 'Pick a Pokémon',
      swap: 'Swap',
      total: 'Total',
      matchup: 'Type matchup',
      dealsTo: 'deals {multiplier}× to',
      neutral: 'Neutral damage both ways',
      openDetail: 'Open details',
    },
    battle: {
      title: 'Stats Battle',
      subtitle:
        'Six cards, one per stat. Keep one at a time and beat the base stat total of your Pokémon.',
      intro: 'Choose a Pokémon or draw a random one to start.',
      loading: 'Loading the Pokédex…',
      pick: 'Choose a Pokémon',
      random: 'Random Pokémon',
      target: 'Target',
      yours: 'Your total',
      hint: 'Tap a card to keep it. The rest are drawn again.',
      reroll: 'Repeated Pokémon: tap to draw this card again',
      reelGen: 'Generation of the cards',
      redraw: 'Draw all again',
      history: 'Battle log',
      onlyWins: 'Only wins',
      noWins: 'No wins yet.',
      clearHistory: 'Clear',
      resultWin: 'Win',
      resultLose: 'Loss',
      resultTie: 'Tie',
      unlocked: 'Generation {gen} unlocked for this Pokémon!',
      unlockedAll: 'All generations unlocked for this Pokémon!',
      lockedHint:
        'Beat each generation with this Pokémon to unlock the next. All generations unlock once you have beaten every one.',
      stepPokemon: 'Your Pokémon',
      fight: 'Battle!',
      summary: 'Battle summary',
      backToSetup: 'Change Pokémon',
      legendary: 'Legendary challenge',
      legendaryHint:
        'Beat every legendary with the cards of its own generation. Clear all nine regions to unlock every generation for good.',
      legendaryDone: 'Complete!',
      mode: 'Mode',
      classic: 'Duel',
      survival: 'Survival',
      survivalHint:
        'Face random Pokémon one after another with the cards of the region you choose. One loss ends the run.',
      streak: 'Streak',
      bestStreak: 'Best streak',
      nextOpponent: 'Next opponent',
      newRun: 'New run',
      runOver: 'Run over',
      redrawWin: 'Won using the full redraw',
      spinning: 'Drawing…',
      finale: 'Your six are in! Adding it up…',
      win: 'You beat it!',
      lose: 'Not this time.',
      tie: 'Dead heat!',
      again: 'Play again',
    },
    team: {
      title: 'Team builder',
      subtitle:
        'Build a team of six and see which attacking types it struggles against.',
      empty: 'Empty slot',
      addMember: 'Add a Pokémon',
      remove: 'Remove',
      clear: 'Clear team',
      full: 'Your team is full',
      coverage: 'Defensive coverage',
      coverageHint:
        'For every attacking type: how many team members take super-effective, resisted or no damage.',
      weak: 'weak',
      resist: 'resist',
      immune: 'immune',
      noWeakness: 'Nothing on the team is weak to this type.',
      uncovered: 'No one on the team resists this type.',
      add: 'Add to team',
      inTeam: 'In your team',
    },
  },
  es: {
    header: {
      home: 'Inicio',
      pokedex: 'Pokédex',
      play: 'Juegos',
      menu: 'Menú',
      close: 'Cerrar',
      search: 'Buscar',
    },
    home: {
      title: '\u00a1Hazte con todos!',
      subtitle: '{count} Pokemon y sumando.',
      pokemonOfTheDay: 'Pokémon del día',
      randomPokemon: 'Sorpréndeme',
      byTheNumbers: 'En Números',
      totalPokemon: 'Total de Pokémon',
      speciesDiscovered: 'Especies descubiertas en todas las regiones',
      types: 'Tipos',
      uniqueTypes: 'Categorías únicas de tipos',
      generations: 'Generaciones',
      pokemonGenerations: 'Generaciones de Pokémon',
      didYouKnow: '💡 ¿Sabías Que?',
      browseByCategory: 'Explorar por Categoría',
      byGeneration: 'Por Generación',
      region: 'Región',
      generation: 'Generación',
    },
    pokemon: {
      type: 'Tipo',
      physicalStats: 'Estadísticas Físicas',
      height: 'Altura',
      weight: 'Peso',
      abilities: 'Habilidades',
      hidden: 'Oculta',
      baseStats: 'Estadísticas Base',
      total: 'Total',
      description: 'Descripción',
      typeEffectiveness: 'Efectividad de Tipo',
      weakTo: 'Débil Contra',
      resistantTo: 'Resistente A',
      immuneTo: 'Inmune A',
      none: 'Ninguno',
      evolutionChain: 'Evoluciones',
      forms: 'Formas',
      category: 'Categoría',
      cry: 'Grito',
      playCry: 'Reproducir Grito',
      latestCry: 'Actual',
      legacyCry: 'Clásico',
      breeding: 'Crianza',
      eggGroups: 'Grupo Huevo',
      genderRatio: 'Ratio de Género',
      hatchSteps: 'Pasos para Eclosión',
      baseHappiness: 'Felicidad Base',
      training: 'Entrenamiento',
      captureRate: 'Ratio de Captura',
      baseExperience: 'EXP Base',
      growthRate: 'Crecimiento',
      habitat: 'Hábitat',
      shape: 'Forma',
      generation: 'Generación',
      baby: 'Bebé',
      legendary: 'Legendario',
      mythical: 'Mítico',
      evolveLevel: 'Nv. {level}',
      evolveItem: '{item}',
      evolveTrade: 'Intercambio',
      evolveHappiness: 'Felicidad ≥ {value}',
      evolveAffection: 'Afecto ≥ {value}',
      evolveHeldItem: 'Equipar {item}',
      evolveKnownMove: 'Conocer {move}',
      evolveKnownMoveType: 'Conocer movimiento tipo {type}',
      evolveLocation: 'En {location}',
      evolveTimeOfDay: '{time}',
      evolveTradeWith: 'Intercambio por {species}',
      evolveRain: 'Bajo lluvia',
      evolveUpsideDown: 'Boca abajo',
      evolvePartySpecies: '{species} en equipo',
      evolvePartyType: 'Tipo {type} en equipo',
      evolveGenderMale: '♂ Solo macho',
      evolveGenderFemale: '♀ Solo hembra',
      evolveBeauty: 'Belleza ≥ {value}',
      evolvePhysicalStatsHigher: 'Ataque > Defensa',
      evolvePhysicalStatsEqual: 'Ataque = Defensa',
      evolvePhysicalStatsLower: 'Ataque < Defensa',
      heldItems: 'Objetos Equipados',
      heldItemRarity: '{rarity}% probabilidad',
      genderless: 'Sin género',
      previousSprite: 'Imagen anterior',
      nextSprite: 'Imagen siguiente',
      recent: 'Recientes',
      compare: 'Comparar',
    },
    eggGroups: {
      monster: 'Monstruo',
      water1: 'Agua 1',
      water2: 'Agua 2',
      water3: 'Agua 3',
      bug: 'Bicho',
      flying: 'Volador',
      ground: 'Campo',
      fairy: 'Hada',
      plant: 'Planta',
      humanshape: 'Humanoide',
      mineral: 'Mineral',
      amorphous: 'Amorfo',
      ditto: 'Ditto',
      dragon: 'Dragón',
      'no-eggs': 'Sin Huevos',
      undiscovered: 'Desconocido',
      indeterminate: 'Amorfo',
    },
    habitats: {
      cave: 'Cueva',
      forest: 'Bosque',
      grassland: 'Pradera',
      mountain: 'Montaña',
      rare: 'Raro',
      'rough-terrain': 'Terreno Agreste',
      sea: 'Mar',
      urban: 'Urbano',
      'waters-edge': 'Orilla del Agua',
    },
    shapes: {
      ball: 'Esfera',
      squiggle: 'Alargado',
      fish: 'Pez',
      arms: 'Brazos',
      blob: 'Masa',
      upright: 'Bípedo',
      legs: 'Cuadrúpedo',
      quadruped: 'Cuadrúpedo',
      wings: 'Alas',
      tentacles: 'Tentáculos',
      heads: 'Múltiples Cuerpos',
      humanoid: 'Humanoide',
      'bug-wings': 'Alas de Insecto',
      armor: 'Armadura',
    },
    growthRates: {
      slow: 'Lento',
      medium: 'Medio',
      fast: 'Rápido',
      'medium-slow': 'Medio Lento',
      'slow-then-very-fast': 'Errático',
      'fast-then-very-slow': 'Fluctuante',
    },
    timeOfDay: {
      day: 'De día',
      night: 'De noche',
      '': '',
    },
    evolutionItems: {
      'water-stone': 'Piedra Agua',
      'thunder-stone': 'Piedra Trueno',
      'fire-stone': 'Piedra Fuego',
      'leaf-stone': 'Piedra Hoja',
      'moon-stone': 'Piedra Lunar',
      'sun-stone': 'Piedra Solar',
      'shiny-stone': 'Piedra Día',
      'dusk-stone': 'Piedra Noche',
      'dawn-stone': 'Piedra Alba',
      'ice-stone': 'Piedra Hielo',
      'linking-cord': 'Cordón Unión',
      'razor-claw': 'Garra Afilada',
      'razor-fang': 'Colmillo Agudo',
      electirizer: 'Electrizador',
      magmarizer: 'Magmatizador',
      protector: 'Protector',
      'reaper-cloth': 'Tela Terrible',
      'dubious-disc': 'Disco Extraño',
      upgrade: 'Mejora',
      'prism-scale': 'Escama Bella',
      'oval-stone': 'Piedra Oval',
      'kings-rock': 'Roca del Rey',
      'metal-coat': 'Revestimiento Met.',
      'dragon-scale': 'Escama Dragón',
      'deep-sea-tooth': 'Diente Marino',
      'deep-sea-scale': 'Escama Marina',
      sachet: 'Saquito Fragante',
      'whipped-dream': 'Dulce de Nata',
      'black-augurite': 'Mineral Negro',
      'peat-block': 'Bloque de Turba',
      'auspicious-armor': 'Armadura Auspiciosa',
      'malicious-armor': 'Armadura Maligna',
      'chipped-pot': 'Tetera Agrietada',
      'cracked-pot': 'Tetera Rota',
      'galarica-cuff': 'Brazal Galanuez',
      'galarica-wreath': 'Corona Galanuez',
      'sweet-apple': 'Manzana Dulce',
      'tart-apple': 'Manzana Ácida',
      'scroll-of-darkness': 'Manuscrito Oscuro',
      'scroll-of-waters': 'Manuscrito Acuático',
      'syrupy-apple': 'Manzana Melosa',
      'unremarkable-teacup': 'Cuenco Mediocre',
      'masterpiece-teacup': 'Cuenco Exquisito',
      'metal-alloy': 'Aleación Metálica',
    },
    spriteLabels: {
      officialArtwork: 'Arte Oficial',
      officialShiny: 'Arte Oficial Shiny',
      home: 'Pokémon HOME',
      homeShiny: 'HOME Shiny',
      dreamWorld: 'Dream World',
      showdown: 'Showdown',
      showdownShiny: 'Showdown Shiny',
      default: 'Predeterminado',
      defaultShiny: 'Shiny',
    },
    modal: {
      close: 'Cerrar',
      closeHint: 'Haz clic en cualquier lugar o presiona Escape para cerrar',
    },
    scroll: {
      loadingMore: 'Cargando más Pokémon...',
      caughtAll: '¡Los has atrapado a todos! 🎉',
      showingAll: 'Mostrando todos los {count} Pokémon',
    },
    pages: {
      typeTitle: 'Tipo',
      speciesCount: '{count} especies de Pokémon',
      backToHome: 'Volver al Inicio',
      region: 'Región',
      back: 'Volver',
      allGenerations: 'Todas las generaciones',
      allTypes: 'Todos los tipos',
    },
    errors: {
      loadFailed:
        'No se pudieron cargar los datos adicionales del Pokémon. Por favor, inténtalo de nuevo más tarde.',
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Auto',
      label: 'Seleccionar tema',
    },
    search: {
      placeholder: 'Buscar Pokémon...',
      loading: 'Cargando...',
      noResults: 'No se encontró ningún Pokémon',
    },
    stats: {
      hp: 'PS',
      attack: 'Ataque',
      defense: 'Defensa',
      specialAttack: 'At. Esp.',
      specialDefense: 'Def. Esp.',
      speed: 'Velocidad',
    },
    types: {
      normal: 'Normal',
      fire: 'Fuego',
      water: 'Agua',
      electric: 'Eléctrico',
      grass: 'Planta',
      ice: 'Hielo',
      fighting: 'Lucha',
      poison: 'Veneno',
      ground: 'Tierra',
      flying: 'Volador',
      psychic: 'Psíquico',
      bug: 'Bicho',
      rock: 'Roca',
      ghost: 'Fantasma',
      dragon: 'Dragón',
      dark: 'Siniestro',
      steel: 'Acero',
      fairy: 'Hada',
    },
    funFacts: [
      "Pikachu originalmente se iba a llamar 'Pikachuu' antes de que se acortara",
      'Rhydon fue el primer Pokémon en ser creado y diseñado',
      'Ditto y Mew comparten la misma paleta de colores y peso—una señal de su posible conexión',
      'El anime de Pokémon ha estado en emisión por más de 25 años con más de 1,000 episodios',
      'Hay más especies de Pokémon que países en el mundo',
      'Azurill es el único Pokémon que puede cambiar de género cuando evoluciona',
      'Las colas de Slowpoke se consideran un manjar en el mundo Pokémon',
      'Wobbuffet fue diseñado originalmente como un saco de boxeo—su cuerpo es en realidad un señuelo',
      "El nombre de Pikachu viene de 'pika' (destello) y 'chu' (sonido de chillido)",
      'Magikarp puede saltar montañas, pero solo según las entradas de la Pokédex',
      'Cubone lleva el cráneo de su madre fallecida—nadie sabe cómo se ve debajo',
      'Yamask lleva una máscara que fue su rostro humano en una vida pasada',
      'Se dice que Gengar es la sombra de Clefable—tienen siluetas casi idénticas',
      'Spinda tiene más de 4 mil millones de patrones de manchas posibles, haciendo a cada uno único',
      'Arcanine fue planeado originalmente para ser un Pokémon legendario',
      'El patrón en espiral de Poliwag está basado en los intestinos visibles de los renacuajos',
      'Hitmonchan y Hitmonlee llevan nombres en honor a Jackie Chan y Bruce Lee',
      'La estructura celular de Vaporeon es similar al agua, permitiéndole fundirse con el agua',
      'El grito de Charizard en la primera generación es igual al de Rhyhorn',
      'Psíquico fue el tipo más dominante en Gen I sin verdaderos contadores',
    ],
    settings: {
      title: 'Configurar Pokédex',
      theme: 'Modo de Pantalla',
      language: 'Idioma',
      auto: 'Auto',
      light: 'Claro',
      dark: 'Oscuro',
    },
    footer: {
      legal:
        'Proyecto fan — sin afiliación con Nintendo, Game Freak ni The Pokémon Company. Todas las marcas de Pokémon pertenecen a sus respectivos dueños.',
      dataBy: 'Datos de',
      builtWith: 'Hecho con',
    },
    play: {
      title: 'Jugar',
      compare: 'Comparar',
      team: 'Equipo',
      battle: 'Stats Battle',
      typeToSearch: 'Escribe para buscar...',
    },
    quiz: {
      title: '¿Quién es ese Pokémon?',
      subtitle: 'Adivina la silueta. Cuatro opciones, una es correcta.',
      question: '¿Quién es?',
      correct: '¡Correcto!',
      wrong: 'Casi. Era',
      score: 'Puntos',
      streak: 'Racha',
      best: 'Mejor racha',
      next: 'Siguiente',
      reveal: 'Revelar',
      gen: 'Generación',
      allGens: 'Todas las generaciones',
    },
    compare: {
      title: 'Comparar',
      subtitle: 'Elige dos Pokémon y compara sus estadísticas base.',
      first: 'Primer Pokémon',
      second: 'Segundo Pokémon',
      pick: 'Elige un Pokémon',
      swap: 'Intercambiar',
      total: 'Total',
      matchup: 'Enfrentamiento de tipos',
      dealsTo: 'hace {multiplier}× a',
      neutral: 'Daño neutral en ambos sentidos',
      openDetail: 'Ver detalles',
    },
    battle: {
      title: 'Stats Battle',
      subtitle:
        'Seis cartas, una por estadística. Quédate una cada vez y supera el total de estadísticas base de tu Pokémon.',
      intro: 'Elige un Pokémon o saca uno al azar para empezar.',
      loading: 'Cargando la Pokédex…',
      pick: 'Elige un Pokémon',
      random: 'Pokémon al azar',
      target: 'Objetivo',
      yours: 'Tu total',
      hint: 'Toca una carta para quedártela. El resto se reparte de nuevo.',
      reroll: 'Pokémon repetido: toca para repartir esta carta de nuevo',
      reelGen: 'Generación de las cartas',
      redraw: 'Repartir todo de nuevo',
      history: 'Historial',
      onlyWins: 'Solo victorias',
      noWins: 'Aún no hay victorias.',
      clearHistory: 'Borrar',
      resultWin: 'Victoria',
      resultLose: 'Derrota',
      resultTie: 'Empate',
      unlocked: '¡Generación {gen} desbloqueada para este Pokémon!',
      unlockedAll: '¡Todas las generaciones desbloqueadas para este Pokémon!',
      lockedHint:
        'Supera cada generación con este Pokémon para desbloquear la siguiente. «Todas» se desbloquea al vencer en todas.',
      stepPokemon: 'Tu Pokémon',
      fight: '¡Al combate!',
      summary: 'Resumen del combate',
      backToSetup: 'Cambiar de Pokémon',
      legendary: 'Reto legendario',
      legendaryHint:
        'Vence a cada legendario con las cartas de su propia generación. Completa las nueve regiones para desbloquear todas las generaciones para siempre.',
      legendaryDone: '¡Completado!',
      mode: 'Modo',
      classic: 'Duelo',
      survival: 'Supervivencia',
      survivalHint:
        'Enfréntate a Pokémon al azar uno tras otro con las cartas de la región que elijas. Una derrota termina la racha.',
      streak: 'Racha',
      bestStreak: 'Mejor racha',
      nextOpponent: 'Siguiente rival',
      newRun: 'Nueva racha',
      runOver: 'Fin de la racha',
      redrawWin: 'Ganado usando el reparto extra',
      spinning: 'Repartiendo…',
      finale: '¡Ya tienes tus seis! Sumando…',
      win: '¡Lo has superado!',
      lose: 'Esta vez no.',
      tie: '¡Empate!',
      again: 'Jugar otra vez',
    },
    team: {
      title: 'Equipo',
      subtitle:
        'Monta un equipo de seis y descubre contra qué tipos de ataque sufre.',
      empty: 'Hueco libre',
      addMember: 'Añadir un Pokémon',
      remove: 'Quitar',
      clear: 'Vaciar equipo',
      full: 'Tu equipo está completo',
      coverage: 'Cobertura defensiva',
      coverageHint:
        'Para cada tipo de ataque: cuántos miembros reciben daño súper eficaz, reducido o nulo.',
      weak: 'débil',
      resist: 'resiste',
      immune: 'inmune',
      noWeakness: 'Nadie en el equipo es débil a este tipo.',
      uncovered: 'Nadie en el equipo resiste este tipo.',
      add: 'Añadir al equipo',
      inTeam: 'En tu equipo',
    },
  },
}

// Helper function to replace placeholders in translations
export function interpolate(
  text: string,
  values: Record<string, string | number>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key]?.toString() ?? `{${key}}`
  })
}
