import { useEffect, useState } from 'react'
import { Carousel } from '@/components/Carousel'
import { PokemonEnrichedData } from '@/components/PokemonEnrichedData'
import { TypeBadge } from '@/components/TypeBadge'
import type { Locale } from '@/utils/i18n'
import type { Pokemon } from '@/utils/pokemon'
import { getPokemonImage, getPokemonName, getTypeColor } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

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
      translatedName: t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
      baseStat: base_stat,
    }))
  )
  const [descriptions, setDescriptions] = useState<FlavorTextEntry[]>([])
  const [descriptionLoading, setDescriptionLoading] = useState(true)

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
            translatedName:
              t.stats[stat.name as keyof typeof t.stats] ??
              translation?.name ??
              stat.name,
            baseStat: base_stat,
          }
        })

        const speciesPromise = fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
        )
          .then((res) => res.json())
          .then((data) => {
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

        const [
          translatedTypes,
          translatedAbilities,
          translatedStats,
          flavorTexts,
        ] = await Promise.all([
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

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-ink-muted text-sm transition-colors hover:bg-surface-sunken hover:text-ink dark:text-dark-ink-muted dark:hover:bg-dark-raised dark:hover:text-dark-ink"
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
          className="bento-cell flex flex-col items-center justify-center rounded-2xl bg-white p-6 md:col-span-2 md:row-span-2 dark:bg-dark-surface"
        >
          <img
            className="aspect-square w-full max-w-[260px] drop-shadow-lg"
            src={getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>

        {/* ── Name + Number + Types ── */}
        <div className="bento-cell flex flex-col justify-center rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <span className="font-black font-mono text-ink-muted text-lg dark:text-dark-ink-muted">
            #{pokemon.order.toString().padStart(3, '0')}
          </span>
          <h1 className="font-black text-3xl text-ink tracking-tight md:text-4xl dark:text-dark-ink">
            {getPokemonName(pokemonName)}
          </h1>
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
            <p className="mb-1 font-semibold text-xs text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
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
            <p className="mb-1 font-semibold text-xs text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
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
              />
            )}
          </div>
        )}

        {/* ── Abilities ── */}
        <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <p className="mb-2 font-semibold text-xs text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
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
    </div>
  )
}
