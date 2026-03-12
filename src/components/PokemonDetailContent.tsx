import { useEffect, useState } from 'react'
import type { Pokemon } from '@/utils/pokemon'
import { getPokemonImage, getPokemonName } from '@/utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import { PokemonEnrichedData } from '@/components/PokemonEnrichedData'
import { ImageZoomModal } from '@/components/ImageZoomModal'
import { RotatingText } from '@/components/RotatingText'
import { getTypeColor } from '@/utils/typeColors'

type PokemonDetailContentProps = {
  pokemon: Pokemon
  pokemonName: string
  locale: Locale
}

type TranslatedAbility = {
  name: string
  translatedName: string
  isHidden: boolean
}

type TranslatedType = {
  name: string
  translatedName: string
}

type TranslatedStat = {
  name: string
  translatedName: string
  baseStat: number
}

type FlavorTextEntry = {
  text: string
  version: string
}

export function PokemonDetailContent({ pokemon, pokemonName, locale }: PokemonDetailContentProps) {
  const t = translations[locale]
  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const typeColor = getTypeColor(primaryType)

  const [abilities, setAbilities] = useState<TranslatedAbility[]>(() =>
    pokemon.abilities.map(({ ability, is_hidden }) => ({
      name: ability.name,
      translatedName: ability.name.replaceAll('-', ' '),
      isHidden: is_hidden,
    }))
  )
  const [types, setTypes] = useState<TranslatedType[]>(() =>
    pokemon.types.map(({ type }) => ({
      name: type.name,
      translatedName: type.name,
    }))
  )
  const [stats, setStats] = useState<TranslatedStat[]>(() =>
    pokemon.stats.map(({ stat, base_stat }) => ({
      name: stat.name,
      translatedName: t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
      baseStat: base_stat,
    }))
  )
  const [descriptions, setDescriptions] = useState<FlavorTextEntry[]>([])
  const [descriptionLoading, setDescriptionLoading] = useState(true)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      setDescriptionLoading(true)
      try {
        const typesPromises = pokemon.types.map(async ({ type }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/type/${type.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: type.name,
            translatedName: translation?.name ?? type.name,
          }
        })

        const abilitiesPromises = pokemon.abilities.map(async ({ ability, is_hidden }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: ability.name,
            translatedName: translation?.name ?? ability.name.replaceAll('-', ' '),
            isHidden: is_hidden,
          }
        })

        const statsPromises = pokemon.stats.map(async ({ stat, base_stat }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/stat/${stat.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: stat.name,
            translatedName: translation?.name ?? t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
            baseStat: base_stat,
          }
        })

        const speciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
          .then(res => res.json())
          .then(data => {
            const entries = data.flavor_text_entries?.filter(
              (entry: any) => entry.language.name === locale
            ) || data.flavor_text_entries?.filter(
              (entry: any) => entry.language.name === 'en'
            ) || []

            const seen = new Set<string>()
            const uniqueEntries: FlavorTextEntry[] = []
            for (const entry of entries) {
              const cleanText = entry.flavor_text?.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
              if (cleanText && !seen.has(cleanText)) {
                seen.add(cleanText)
                uniqueEntries.push({
                  text: cleanText,
                  version: entry.version?.name || 'unknown',
                })
              }
            }
            return uniqueEntries
          })
          .catch(() => [] as FlavorTextEntry[])

        const [translatedTypes, translatedAbilities, translatedStats, flavorTexts] = await Promise.all([
          Promise.all(typesPromises),
          Promise.all(abilitiesPromises),
          Promise.all(statsPromises),
          speciesPromise,
        ])

        setTypes(translatedTypes)
        setAbilities(translatedAbilities)
        setStats(translatedStats)
        setDescriptions(flavorTexts)
      } catch (error) {
        console.error('Failed to fetch enriched data:', error)
        setDescriptions([])
      } finally {
        setDescriptionLoading(false)
      }
    }

    fetchEnrichedData()
  }, [pokemon, pokemonName, locale, t.stats])

  const totalStats = stats.reduce((sum, stat) => sum + stat.baseStat, 0)
  const maxStat = 255

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Hero Section with type-colored gradient */}
      <div
        className="relative overflow-hidden rounded-4xl p-5 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${typeColor.light} 0%, white 50%, ${pokemon.types[1] ? getTypeColor(pokemon.types[1].type.name).light : typeColor.light} 100%)`,
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[260px_1fr]">
          {/* Image */}
          <div className="flex flex-col items-center justify-start">
            <button
              type="button"
              onClick={() => setIsImageZoomed(true)}
              className="relative w-full max-w-[200px] cursor-zoom-in transition-transform duration-300 hover:scale-105 md:max-w-full"
              aria-label={`Enlarge ${pokemon.name} image`}
            >
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                style={{ backgroundColor: typeColor.accent }}
              />
              <img
                className="relative aspect-square w-full drop-shadow-2xl"
                src={getPokemonImage(pokemon)}
                alt={`${pokemon.name} official artwork`}
              />
              <span
                className="absolute top-1 right-1 rounded-full px-2.5 py-1 font-heading text-xs font-bold md:text-sm"
                style={{ backgroundColor: typeColor.light, color: typeColor.dark }}
              >
                #{pokemon.order.toString().padStart(3, '0')}
              </span>
              <span
                className="absolute bottom-1 left-1 rounded-full p-1.5 text-white"
                style={{ backgroundColor: `${typeColor.accent}90` }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </span>
            </button>
            {/* Name on mobile */}
            <h1
              className="mt-3 text-center font-heading text-2xl font-bold capitalize tracking-tight md:hidden"
              style={{ color: typeColor.dark }}
            >
              {getPokemonName(pokemonName)}
            </h1>
          </div>

          {/* Info Column */}
          <div className="space-y-3">
            {/* Name (desktop) */}
            <h1
              className="hidden font-heading text-3xl font-bold capitalize tracking-tight md:block lg:text-4xl"
              style={{ color: typeColor.dark }}
            >
              {getPokemonName(pokemonName)}
            </h1>

            {/* Description */}
            {(descriptionLoading || descriptions.length > 0) && (
              <div
                className="rounded-2xl p-3 md:p-4"
                style={{ backgroundColor: `${typeColor.light}80`, border: `1px solid ${typeColor.medium}30` }}
              >
                {descriptionLoading ? (
                  <div className="h-12 animate-pulse rounded-xl" style={{ backgroundColor: `${typeColor.medium}20` }} />
                ) : (
                  <RotatingText
                    items={descriptions.map((d) => d.text)}
                    intervalMs={5000}
                    className="text-sm leading-relaxed md:text-base"
                  />
                )}
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              {/* Types */}
              <div className="glass-card rounded-2xl p-3">
                <h2 className="mb-1.5 font-heading text-sm font-bold md:text-base">
                  {t.pokemon.type}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {types.map(({ name, translatedName }) => {
                    const tc = getTypeColor(name)
                    return (
                      <span
                        key={name}
                        className="rounded-full px-2.5 py-0.5 text-sm font-semibold capitalize"
                        style={{ backgroundColor: tc.light, color: tc.dark, border: `1px solid ${tc.medium}40` }}
                      >
                        {translatedName}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Height */}
              <div className="glass-card rounded-2xl p-3">
                <h2 className="mb-1.5 font-heading text-sm font-bold md:text-base">
                  {t.pokemon.height}
                </h2>
                <p className="font-heading text-lg font-bold md:text-xl" style={{ color: typeColor.accent }}>
                  {(pokemon.height / 10).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m
                </p>
              </div>

              {/* Weight */}
              <div className="glass-card rounded-2xl p-3">
                <h2 className="mb-1.5 font-heading text-sm font-bold md:text-base">
                  {t.pokemon.weight}
                </h2>
                <p className="font-heading text-lg font-bold md:text-xl" style={{ color: typeColor.accent }}>
                  {(pokemon.weight / 10).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
                </p>
              </div>

              {/* Abilities */}
              <div className="glass-card rounded-2xl p-3">
                <h2 className="mb-1.5 font-heading text-sm font-bold md:text-base">
                  {t.pokemon.abilities}
                </h2>
                <div className="flex flex-wrap gap-1">
                  {abilities.map(({ name, translatedName, isHidden }) => (
                    <span
                      key={name}
                      className={`rounded-full px-2 py-0.5 text-sm ${
                        isHidden
                          ? 'font-medium italic'
                          : 'font-semibold'
                      }`}
                      style={isHidden
                        ? { backgroundColor: `${typeColor.light}`, color: typeColor.dark, border: `1px dashed ${typeColor.medium}60` }
                        : { backgroundColor: `${typeColor.light}`, color: typeColor.dark, border: `1px solid ${typeColor.medium}40` }
                      }
                      title={isHidden ? t.pokemon.hidden : undefined}
                    >
                      {translatedName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Enriched Data */}
      <PokemonEnrichedData
        pokemonName={pokemonName}
        locale={locale}
        typeColor={typeColor}
        statsSection={
          <div className="glass-card rounded-3xl p-4 shadow-soft md:p-5">
            <h2 className="mb-3 font-heading text-lg font-bold md:text-xl">
              {t.pokemon.baseStats}
            </h2>
            <div className="space-y-2">
              {stats.map(({ name, translatedName, baseStat }) => {
                const percentage = (baseStat / maxStat) * 100
                const statColor = baseStat >= 100
                  ? getTypeColor('grass').accent
                  : baseStat >= 60
                    ? getTypeColor('electric').accent
                    : getTypeColor('fire').accent
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[90px_40px_1fr] items-center gap-2"
                  >
                    <div className="truncate text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {translatedName}
                    </div>
                    <div className="text-right font-heading text-sm font-bold">{baseStat}</div>
                    <div className="flex items-center">
                      <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--border-soft)' }}>
                        <div
                          className="absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%`, backgroundColor: statColor }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="mt-2 grid grid-cols-[90px_40px_1fr] gap-2 border-t pt-2" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="text-right font-heading text-sm font-bold">{t.pokemon.total}</div>
                <div className="text-right font-heading text-sm font-bold">{totalStats}</div>
                <div />
              </div>
            </div>
          </div>
        }
      />

      {/* Image zoom modal */}
      <ImageZoomModal
        src={getPokemonImage(pokemon)}
        alt={`${pokemon.name} official artwork`}
        isOpen={isImageZoomed}
        onClose={() => setIsImageZoomed(false)}
      />
    </div>
  )
}
