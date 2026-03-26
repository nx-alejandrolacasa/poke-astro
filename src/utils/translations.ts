export type Language = 'en' | 'es'

export type Translations = {
  // Header
  header: {
    pokedex: string
    typeChart: string
    menu: string
    close: string
    search: string
  }
  // Home page
  home: {
    title: string
    subtitle: string
    viewPokedex: string
    byTheNumbers: string
    totalPokemon: string
    speciesDiscovered: string
    types: string
    uniqueTypes: string
    generations: string
    pokemonGenerations: string
    didYouKnow: string
    browseByCategory: string
    pokemonTypes: string
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
  }
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
    disclaimer: string
    trademarks: string
    fairUse: string
    dataBy: string
    builtWith: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      pokedex: 'Pokédex',
      typeChart: 'Type Chart',
      menu: 'Menu',
      close: 'Close',
      search: 'Search',
    },
    home: {
      title: 'Explore the World of Pokémon',
      subtitle:
        'Discover detailed information about all {count} Pokémon species, their stats, types, abilities, and evolutions.',
      viewPokedex: 'View Full Pokédex →',
      byTheNumbers: 'By the Numbers',
      totalPokemon: 'Total Pokémon',
      speciesDiscovered: 'Species discovered across all regions',
      types: 'Types',
      uniqueTypes: 'Unique type categories',
      generations: 'Generations',
      pokemonGenerations: 'Pokémon generations',
      didYouKnow: '💡 Did You Know?',
      browseByCategory: 'Browse by Category',
      pokemonTypes: 'Pokémon Types',
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
      disclaimer:
        'This website is fan-made with no affiliation, sponsorship, or official relationship with Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.',
      trademarks:
        'All names, images, and trademarks related to Pokémon are the property of their respective owners.',
      fairUse:
        'This site uses such elements under fair use principles for educational and informational purposes.',
      dataBy: 'Data provided by',
      builtWith: 'Built with',
    },
  },
  es: {
    header: {
      pokedex: 'Pokédex',
      typeChart: 'Tabla de Tipos',
      menu: 'Menú',
      close: 'Cerrar',
      search: 'Buscar',
    },
    home: {
      title: 'Explora el Mundo de Pokémon',
      subtitle:
        'Descubre información detallada sobre todas las {count} especies de Pokémon, sus estadísticas, tipos, habilidades y evoluciones.',
      viewPokedex: 'Ver Pokédex →',
      byTheNumbers: 'En Números',
      totalPokemon: 'Total de Pokémon',
      speciesDiscovered: 'Especies descubiertas en todas las regiones',
      types: 'Tipos',
      uniqueTypes: 'Categorías únicas de tipos',
      generations: 'Generaciones',
      pokemonGenerations: 'Generaciones de Pokémon',
      didYouKnow: '💡 ¿Sabías Que?',
      browseByCategory: 'Explorar por Categoría',
      pokemonTypes: 'Tipos de Pokémon',
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
      disclaimer:
        'Este sitio web está creado por fans, sin ningún tipo de afiliación, patrocinio ni relación oficial con Nintendo, Game Freak, Creatures Inc. o The Pokémon Company.',
      trademarks:
        'Todos los nombres, imágenes y marcas relacionadas con Pokémon son propiedad de sus respectivos dueños.',
      fairUse:
        'Este sitio hace uso de dichos elementos bajo los principios de fair use (uso legítimo), con fines educativos e informativos.',
      dataBy: 'Datos proporcionados por',
      builtWith: 'Construido con',
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
