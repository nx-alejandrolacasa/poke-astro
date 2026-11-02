import { readFileSync, writeFileSync } from 'node:fs'

const [iconsDir, outFile] = process.argv.slice(2)
const types = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

const round = (d) =>
  d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))

let out =
  '// Sword/Shield type symbols from duiker101/pokemon-type-svg-icons (MIT), 512×512.\n' +
  'export const typeGlyphs: Record<string, string> = {\n'
for (const type of types) {
  const svg = readFileSync(`${iconsDir}/${type}.svg`, 'utf8')
  const paths = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) =>
    round(m[1]).trim()
  )
  out += `  ${type}:\n    '${paths.join(' ')}',\n`
}
out += '}\n'
writeFileSync(outFile, out)
console.log(`${out.length} bytes`)
