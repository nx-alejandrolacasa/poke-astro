export type Language = 'en' | 'es'

export type Translations = {
  // Header
  header: {
    pokedex: string
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
  // Stats (these will be fetched from API when possible)
  stats: {
    hp: string
    attack: string
    defense: string
    specialAttack: string
    specialDefense: string
    speed: string
  }
  // Fun facts
  funFacts: string[]
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      pokedex: 'Pokédex',
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
      loadFailed: 'Failed to load additional Pokemon data. Please try again later.',
    },
    stats: {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      specialAttack: 'Sp. Atk',
      specialDefense: 'Sp. Def',
      speed: 'Speed',
    },
    funFacts: [
      "Pikachu was originally going to be called 'Pikachuu' before it was shortened",
      'Rhydon was the first Pokémon ever created and designed',
      'Ditto and Mew share the same color palette and weight—a sign of their possible connection',
      'The Pokémon anime has been running for over 25 years with more than 1,000 episodes',
      'There are more Pokémon species than there are countries in the world',
    ],
  },
  es: {
    header: {
      pokedex: 'Pokédex',
    },
    home: {
      title: 'Explora el Mundo de Pokémon',
      subtitle:
        'Descubre información detallada sobre todas las {count} especies de Pokémon, sus estadísticas, tipos, habilidades y evoluciones.',
      viewPokedex: 'Ver Pokédex Completa →',
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
      evolutionChain: 'Cadena Evolutiva',
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
    stats: {
      hp: 'PS',
      attack: 'Ataque',
      defense: 'Defensa',
      specialAttack: 'At. Esp.',
      specialDefense: 'Def. Esp.',
      speed: 'Velocidad',
    },
    funFacts: [
      "Pikachu originalmente se iba a llamar 'Pikachuu' antes de que se acortara",
      'Rhydon fue el primer Pokémon en ser creado y diseñado',
      'Ditto y Mew comparten la misma paleta de colores y peso—una señal de su posible conexión',
      'El anime de Pokémon ha estado en emisión por más de 25 años con más de 1,000 episodios',
      'Hay más especies de Pokémon que países en el mundo',
    ],
  },
}

// Helper function to replace placeholders in translations
export function interpolate(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key]?.toString() ?? `{${key}}`
  })
}
