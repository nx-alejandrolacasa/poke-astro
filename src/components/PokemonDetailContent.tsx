import { useEffect, useRef, useState } from 'react'
import { Carousel } from '@/components/Carousel'
import { PokemonEnrichedData } from '@/components/PokemonEnrichedData'
import { TypeBadge } from '@/components/TypeBadge'
import type { Locale } from '@/utils/i18n'
import type { Pokemon } from '@/utils/pokemon'
import {
  getPokemonImage,
  getPokemonName,
  getTypeColor,
} from '@/utils/pokemon'
import type { Translations } from '@/utils/translations'
import { interpolate, translations } from '@/utils/translations'

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

type PokeApiNameEntry = {
  language: { name: string }
  name: string
}

type PokeApiFlavorTextEntry = {
  flavor_text: string
  language: { name: string }
  version?: { name: string }
}

type SpeciesInfo = {
  baseHappiness: number | null
  captureRate: number
  color: string | null
  eggGroups: string[]
  genderRate: number
  genera: { genus: string; language: { name: string } }[]
  generation: string | null
  growthRate: string | null
  habitat: string | null
  hatchCounter: number | null
  isBaby: boolean
  isLegendary: boolean
  isMythical: boolean
  shape: string | null
  varieties: string[]
}

// PokéAPI returns stat names in kebab-case (e.g. `special-attack`), but our
// translation keys are camelCase (`specialAttack`). Map between them so the
// shortened labels (e.g. "Sp. Atk") actually render.
const STAT_KEY_MAP: Record<string, keyof Translations['stats']> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed',
}

function getStatLabel(
  apiName: string,
  t: Translations,
  fallback?: string
): string {
  const key = STAT_KEY_MAP[apiName]
  if (key) return t.stats[key]
  return fallback ?? apiName
}

export function PokemonDetailContent({
  pokemon,
  pokemonName,
  locale,
}: PokemonDetailContentProps) {
  const t = translations[locale]
  const typeColor = getTypeColor(pokemon)
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
      translatedName: getStatLabel(stat.name, t),
      baseStat: base_stat,
    }))
  )
  const [descriptions, setDescriptions] = useState<FlavorTextEntry[]>([])
  const [descriptionLoading, setDescriptionLoading] = useState(true)
  const [speciesInfo, setSpeciesInfo] = useState<SpeciesInfo | null>(null)
  const [genus, setGenus] = useState<string | null>(null)
  const [playingCry, setPlayingCry] = useState<'latest' | 'legacy' | null>(null)
  const latestCryRef = useRef<HTMLAudioElement | null>(null)
  const legacyCryRef = useRef<HTMLAudioElement | null>(null)
  const [showShiny, setShowShiny] = useState(false)
  const shinyUrl = pokemon.sprites?.other?.['official-artwork']?.front_shiny
  const defaultUrl = getPokemonImage(pokemon)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      setDescriptionLoading(true)
      try {
        const typesPromises = pokemon.types.map(async ({ type }) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/type/${type.name}`
          )
          const data = await response.json()
          const translation = data.names.find(
            (n: PokeApiNameEntry) => n.language.name === locale
          )
          return {
            name: type.name,
            translatedName: translation?.name ?? type.name,
          }
        })

        const abilitiesPromises = pokemon.abilities.map(
          async ({ ability, is_hidden }) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/ability/${ability.name}`
            )
            const data = await response.json()
            const translation = data.names.find(
              (n: PokeApiNameEntry) => n.language.name === locale
            )
            return {
              name: ability.name,
              translatedName:
                translation?.name ?? ability.name.replaceAll('-', ' '),
              isHidden: is_hidden,
            }
          }
        )

        const statsPromises = pokemon.stats.map(async ({ stat, base_stat }) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/stat/${stat.name}`
          )
          const data = await response.json()
          const translation = data.names.find(
            (n: PokeApiNameEntry) => n.language.name === locale
          )
          return {
            name: stat.name,
            translatedName: getStatLabel(stat.name, t, translation?.name),
            baseStat: base_stat,
          }
        })

        const speciesPromise = fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
        )
          .then((res) => res.json())
          .then((data) => {
            // Extract genus in the user's locale
            const genusEntry = data.genera?.find(
              (g: { genus: string; language: { name: string } }) =>
                g.language.name === locale
            ) ?? data.genera?.find(
              (g: { genus: string; language: { name: string } }) =>
                g.language.name === 'en'
            )
            if (genusEntry) setGenus(genusEntry.genus)

            const entries =
              data.flavor_text_entries?.filter(
                (entry: PokeApiFlavorTextEntry) =>
                  entry.language.name === locale
              ) ||
              data.flavor_text_entries?.filter(
                (entry: PokeApiFlavorTextEntry) => entry.language.name === 'en'
              ) ||
              []
            const seen = new Set<string>()
            const uniqueEntries: FlavorTextEntry[] = []
            for (const entry of entries) {
              const cleanText = entry.flavor_text
                ?.replace(/\f/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
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

        // Fetch species info from enriched endpoint
        const enrichedSpeciesPromise = fetch(
          `/api/pokemon/${pokemonName}/enriched?lang=${locale}`
        )
          .then((res) => res.json())
          .then((data) => data.speciesInfo as SpeciesInfo | null)
          .catch(() => null)

        const [
          translatedTypes,
          translatedAbilities,
          translatedStats,
          flavorTexts,
          enrichedSpecies,
        ] = await Promise.all([
          Promise.all(typesPromises),
          Promise.all(abilitiesPromises),
          Promise.all(statsPromises),
          speciesPromise,
          enrichedSpeciesPromise,
        ])

        setTypes(translatedTypes)
        setAbilities(translatedAbilities)
        setStats(translatedStats)
        setDescriptions(flavorTexts)
        setSpeciesInfo(enrichedSpecies)
      } catch (error) {
        console.error('Failed to fetch enriched data:', error)
        setDescriptions([])
      } finally {
        setDescriptionLoading(false)
      }
    }

    fetchEnrichedData()
  }, [pokemon, pokemonName, locale, t.stats])

  const handlePlayCry = (variant: 'latest' | 'legacy') => {
    const ref = variant === 'latest' ? latestCryRef : legacyCryRef
    const otherRef = variant === 'latest' ? legacyCryRef : latestCryRef

    // Stop the other one if playing
    if (otherRef.current) {
      otherRef.current.pause()
      otherRef.current.currentTime = 0
    }

    if (ref.current) {
      if (playingCry === variant) {
        ref.current.pause()
        ref.current.currentTime = 0
        setPlayingCry(null)
      } else {
        ref.current.currentTime = 0
        ref.current.play()
        setPlayingCry(variant)
      }
    }
  }

  const genderBar = speciesInfo && speciesInfo.genderRate >= 0 ? (() => {
    const femalePercent = (speciesInfo.genderRate / 8) * 100
    const malePercent = 100 - femalePercent
    return { malePercent, femalePercent }
  })() : null

  return (
    <div className="space-y-4">
      {/* Hidden audio elements for cries */}
      {pokemon.cries?.latest && (
        <audio
          ref={latestCryRef}
          src={pokemon.cries.latest}
          preload="none"
          onEnded={() => setPlayingCry(null)}
        />
      )}
      {pokemon.cries?.legacy && (
        <audio
          ref={legacyCryRef}
          src={pokemon.cries.legacy}
          preload="none"
          onEnded={() => setPlayingCry(null)}
        />
      )}

      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-ink-muted text-sm transition-colors hover:bg-surface-sunken hover:text-ink dark:text-dark-ink-muted dark:hover:bg-dark-raised dark:hover:text-dark-ink"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {locale === 'es' ? 'Volver' : 'Back'}
      </button>

      {/* ── BENTO GRID ── */}
      {/* Mobile: single column stack. Desktop: 4-col grid with spanning cells. */}
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4"
        style={{ '--type-color': typeColor } as React.CSSProperties}
      >

        {/* ── Sprite card — tall, spans 2 rows on desktop ── */}
        <div
          className="bento-cell relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 md:col-span-2 md:row-span-2 dark:bg-dark-surface"
        >
          {/* Shiny toggle — top-right corner */}
          {shinyUrl && (
            <button
              type="button"
              onClick={() => setShowShiny((s) => !s)}
              className={`absolute top-3 right-3 z-10 rounded-full p-2 transition-all ${showShiny ? 'shadow-lg shadow-amber-300/40 dark:shadow-amber-500/30' : 'bg-surface-sunken opacity-60 hover:opacity-100 dark:bg-dark-raised'}`}
              aria-label="Shiny"
              title="Shiny"
            >
              <svg className="h-6 w-6" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <defs>
                  <radialGradient id="shiny-grad" cx="0.35" cy="0.35" r="0.75">
                    <stop offset="0%" stopColor="#ff4444" />
                    <stop offset="30%" stopColor="#ffaa00" />
                    <stop offset="55%" stopColor="#44cc44" />
                    <stop offset="75%" stopColor="#2288ff" />
                    <stop offset="100%" stopColor="#44aaff" />
                  </radialGradient>
                  <radialGradient id="shiny-grad-off" cx="0.35" cy="0.35" r="0.75">
                    <stop offset="0%" stopColor="#aaa" />
                    <stop offset="100%" stopColor="#ccc" />
                  </radialGradient>
                </defs>
                <path
                  d="M50 0 C53 38, 62 47, 100 50 C62 53, 53 62, 50 100 C47 62, 38 53, 0 50 C38 47, 47 38, 50 0Z"
                  fill={showShiny ? 'url(#shiny-grad)' : 'url(#shiny-grad-off)'}
                />
              </svg>
            </button>
          )}

          {/* Sprite image with crossfade */}
          <div className="relative aspect-square w-full max-w-[260px]">
            <img
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${showShiny ? 'opacity-0' : 'opacity-100'}`}
              src={defaultUrl}
              alt={`${pokemon.name} official artwork`}
            />
            {shinyUrl && (
              <img
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${showShiny ? 'opacity-100' : 'opacity-0'}`}
                src={shinyUrl}
                alt={`${pokemon.name} shiny artwork`}
                loading="lazy"
              />
            )}
          </div>

          {/* Cry buttons */}
          {(pokemon.cries?.latest || pokemon.cries?.legacy) && (
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
                {t.pokemon.cry}
              </span>
              {pokemon.cries?.latest && (
                <button
                  type="button"
                  onClick={() => handlePlayCry('latest')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-all ${playingCry === 'latest' ? 'bg-primary text-white dark:bg-dark-primary' : 'bg-surface-sunken text-ink hover:bg-primary/10 dark:bg-dark-raised dark:text-dark-ink dark:hover:bg-dark-primary/10'}`}
                  title={t.pokemon.playCry}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    {playingCry === 'latest' ? (
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm7 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    ) : (
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    )}
                  </svg>
                  {t.pokemon.latestCry}
                </button>
              )}
              {pokemon.cries?.legacy && (
                <button
                  type="button"
                  onClick={() => handlePlayCry('legacy')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-all ${playingCry === 'legacy' ? 'bg-primary text-white dark:bg-dark-primary' : 'bg-surface-sunken text-ink hover:bg-primary/10 dark:bg-dark-raised dark:text-dark-ink dark:hover:bg-dark-primary/10'}`}
                  title={t.pokemon.playCry}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    {playingCry === 'legacy' ? (
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm7 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    ) : (
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    )}
                  </svg>
                  {t.pokemon.legacyCry}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Name + Number + Types + Badges ── */}
        <div className="bento-cell flex flex-col justify-center rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <div className="flex items-center gap-2">
            <span className="font-black font-mono text-ink-muted text-lg dark:text-dark-ink-muted">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
            {speciesInfo?.isBaby && (
              <span className="rounded-full bg-pink-100 px-2 py-0.5 font-semibold text-pink-700 text-xs dark:bg-pink-500/10 dark:text-pink-400">
                {t.pokemon.baby}
              </span>
            )}
            {speciesInfo?.isLegendary && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 text-xs dark:bg-amber-500/10 dark:text-amber-400">
                {t.pokemon.legendary}
              </span>
            )}
            {speciesInfo?.isMythical && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-700 text-xs dark:bg-violet-500/10 dark:text-violet-400">
                {t.pokemon.mythical}
              </span>
            )}
          </div>
          <h1 className="font-black text-3xl text-ink tracking-tight md:text-4xl dark:text-dark-ink">
            {getPokemonName(pokemonName)}
          </h1>
          {genus && (
            <p className="mt-0.5 text-ink-muted text-sm italic dark:text-dark-ink-muted">
              {genus}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map(({ name, translatedName }) => (
              <TypeBadge
                key={name}
                type={name}
                label={translatedName}
                size="md"
                href={`/${locale}/type/${name}`}
              />
            ))}
          </div>
        </div>

        {/* ── Height + Weight ── */}
        <div className="grid grid-cols-2 gap-3 md:col-span-2 md:gap-4">
          <div className="bento-cell rounded-2xl bg-white p-4 dark:bg-dark-surface">
            <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
              {t.pokemon.height}
            </p>
            <p className="font-mono font-bold text-ink text-2xl dark:text-dark-ink">
              {(pokemon.height / 10).toLocaleString(locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              <span className="text-base text-ink-muted dark:text-dark-ink-muted">m</span>
            </p>
          </div>
          <div className="bento-cell rounded-2xl bg-white p-4 dark:bg-dark-surface">
            <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
              {t.pokemon.weight}
            </p>
            <p className="font-mono font-bold text-ink text-2xl dark:text-dark-ink">
              {(pokemon.weight / 10).toLocaleString(locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              <span className="text-base text-ink-muted dark:text-dark-ink-muted">kg</span>
            </p>
          </div>
        </div>

        {/* ── Descriptions carousel ── */}
        {(descriptionLoading || descriptions.length > 0) && (
          <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
            {descriptionLoading ? (
              <div className="h-16 animate-pulse rounded-lg bg-surface-sunken dark:bg-dark-raised" />
            ) : (
              <Carousel
                items={descriptions.map((d) => d.text)}
                label={t.pokemon.description}
                autoPlayMs={8000}
                textClassName="text-ink text-sm leading-relaxed dark:text-dark-ink"
              />
            )}
          </div>
        )}

        {/* ── Abilities ── */}
        <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
            {t.pokemon.abilities}
          </p>
          <div className="flex flex-wrap gap-2">
            {abilities.map(({ name, translatedName, isHidden }) => (
              <span
                key={name}
                className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${isHidden ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-surface-sunken text-ink dark:bg-dark-raised dark:text-dark-ink'}`}
                title={isHidden ? t.pokemon.hidden : undefined}
              >
                {translatedName}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ── Enriched data (type effectiveness + evolution chain) ── */}
      <PokemonEnrichedData
        pokemonName={pokemonName}
        locale={locale}
        typeColor={typeColor}
        stats={stats}
      />

      {/* ── Breeding, Training & Held Items ── */}
      {speciesInfo && (
        <div
          className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
          style={{ '--type-color': typeColor } as React.CSSProperties}
        >
          {/* ── Breeding Info ── */}
          <div className="bento-cell rounded-2xl bg-white p-4 dark:bg-dark-surface">
            <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
              {t.pokemon.breeding}
            </p>
            <div className="space-y-3">
              {/* Egg Groups */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                  {t.pokemon.eggGroups}
                </span>
                <div className="flex flex-wrap justify-end gap-1">
                  {speciesInfo.eggGroups.map((group) => (
                    <span
                      key={group}
                      className="rounded-full bg-surface-sunken px-2 py-0.5 text-ink text-xs dark:bg-dark-raised dark:text-dark-ink"
                    >
                      {t.eggGroups[group] ?? getPokemonName(group)}
                    </span>
                  ))}
                </div>
              </div>
              {/* Gender Ratio */}
              <div className="flex flex-col gap-1.5">
                <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                  {t.pokemon.genderRatio}
                </span>
                {genderBar ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-500 text-xs">♂ {genderBar.malePercent.toFixed(1)}%</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full bg-blue-400"
                        style={{ width: `${genderBar.malePercent}%` }}
                      />
                      <div
                        className="absolute top-0 right-0 h-full rounded-full bg-pink-400"
                        style={{ width: `${genderBar.femalePercent}%` }}
                      />
                    </div>
                    <span className="font-medium text-pink-500 text-xs">♀ {genderBar.femalePercent.toFixed(1)}%</span>
                  </div>
                ) : (
                  <span className="text-ink-faint text-xs italic dark:text-dark-ink-faint">
                    {t.pokemon.genderless}
                  </span>
                )}
              </div>
              {/* Hatch Steps */}
              {speciesInfo.hatchCounter !== null && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.hatchSteps}
                  </span>
                  <span className="font-mono text-ink text-xs dark:text-dark-ink">
                    {(speciesInfo.hatchCounter * 256).toLocaleString(locale)}
                  </span>
                </div>
              )}
              {/* Base Happiness */}
              {speciesInfo.baseHappiness !== null && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.baseHappiness}
                  </span>
                  <span className="font-mono text-ink text-xs dark:text-dark-ink">
                    {speciesInfo.baseHappiness}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Training Info ── */}
          <div className="bento-cell rounded-2xl bg-white p-4 dark:bg-dark-surface">
            <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
              {t.pokemon.training}
            </p>
            <div className="space-y-3">
              {/* Capture Rate */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                  {t.pokemon.captureRate}
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative h-2 w-20 overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${speciesInfo.captureRate > 150 ? 'bg-success' : speciesInfo.captureRate > 60 ? 'bg-warning' : 'bg-danger'}`}
                      style={{ width: `${Math.min(100, (speciesInfo.captureRate / 255) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-ink text-xs dark:text-dark-ink">
                    {speciesInfo.captureRate}
                  </span>
                </div>
              </div>
              {/* Base Experience */}
              {pokemon.base_experience !== null && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.baseExperience}
                  </span>
                  <span className="font-mono text-ink text-xs dark:text-dark-ink">
                    {pokemon.base_experience}
                  </span>
                </div>
              )}
              {/* Growth Rate */}
              {speciesInfo.growthRate && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.growthRate}
                  </span>
                  <span className="text-ink text-xs dark:text-dark-ink">
                    {t.growthRates[speciesInfo.growthRate] ?? getPokemonName(speciesInfo.growthRate)}
                  </span>
                </div>
              )}
              {/* Habitat */}
              {speciesInfo.habitat && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.habitat}
                  </span>
                  <span className="text-ink text-xs dark:text-dark-ink">
                    {t.habitats[speciesInfo.habitat] ?? getPokemonName(speciesInfo.habitat)}
                  </span>
                </div>
              )}
              {/* Shape */}
              {speciesInfo.shape && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                    {t.pokemon.shape}
                  </span>
                  <span className="text-ink text-xs dark:text-dark-ink">
                    {t.shapes[speciesInfo.shape] ?? getPokemonName(speciesInfo.shape)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Held Items ── */}
          {pokemon.held_items && pokemon.held_items.length > 0 && (
            <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
              <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
                {t.pokemon.heldItems}
              </p>
              <div className="space-y-2">
                {pokemon.held_items.map(({ item, version_details }) => {
                  const latestVersion = version_details[version_details.length - 1]
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <span className="text-ink text-xs capitalize dark:text-dark-ink">
                        {getPokemonName(item.name)}
                      </span>
                      {latestVersion && (
                        <span className="text-ink-muted text-xs dark:text-dark-ink-muted">
                          {interpolate(t.pokemon.heldItemRarity, { rarity: latestVersion.rarity })}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
