import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const OUT = new URL('../src/data/accentColors.json', import.meta.url)
const SAMPLE = 48
const CONCURRENCY = 12

const existing = (() => {
  try {
    return JSON.parse(readFileSync(OUT, 'utf8'))
  } catch {
    return {}
  }
})()

async function fetchIds() {
  const res = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: '{ pokemon_v2_pokemon(order_by: {id: asc}) { id } }',
    }),
  })
  const { data } = await res.json()
  return data.pokemon_v2_pokemon.map((p) => p.id)
}

function toHex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max === 0 ? 0 : (max - min) / max
}

// Quantise opaque pixels to 4 bits per channel and pick the bucket with the
// highest count × saturation, so flat backgrounds and grey outlines lose to
// the creature's actual body colour.
async function accentFor(id) {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  const res = await fetch(url)
  if (!res.ok) return null
  const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(SAMPLE, SAMPLE, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const buckets = new Map()
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
    if (a < 200) continue
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 }
    bucket.r += r
    bucket.g += g
    bucket.b += b
    bucket.n += 1
    buckets.set(key, bucket)
  }
  let best = null
  let bestScore = -1
  for (const bucket of buckets.values()) {
    const r = bucket.r / bucket.n
    const g = bucket.g / bucket.n
    const b = bucket.b / bucket.n
    const light = (r + g + b) / 765
    if (light > 0.92 || light < 0.08) continue
    const score = bucket.n * (0.15 + saturation(r, g, b))
    if (score > bestScore) {
      bestScore = score
      best = toHex(Math.round(r), Math.round(g), Math.round(b))
    }
  }
  return best
}

const ids = await fetchIds()
const todo = ids.filter((id) => !existing[id])
console.log(`${ids.length} Pokémon, ${todo.length} to extract`)
const result = { ...existing }
let done = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (todo.length) {
      const id = todo.shift()
      try {
        const hex = await accentFor(id)
        if (hex) result[id] = hex
      } catch (error) {
        console.warn(`#${id}: ${error.message}`)
      }
      done += 1
      if (done % 100 === 0) console.log(`${done} done`)
    }
  })
)
const sorted = Object.fromEntries(
  Object.entries(result).sort(([a], [b]) => Number(a) - Number(b))
)
writeFileSync(OUT, `${JSON.stringify(sorted)}\n`)
console.log(`wrote ${Object.keys(sorted).length} colours`)
