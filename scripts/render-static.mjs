import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [entry, path, outFile] = process.argv.slice(2)
const staticDir = resolve('.vercel/output/static')

const source = entry.endsWith('.html')
  ? { status: 200, text: async () => readFileSync(entry, 'utf8') }
  : await (await import(resolve(entry))).default.fetch(
      new Request(`http://localhost${path}`, {
        headers: { accept: 'text/html' },
      })
    )
const css = readdirSync(`${staticDir}/_astro`)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(`${staticDir}/_astro/${f}`, 'utf8'))
  .join('\n')
const html = (await source.text())
  .replace(/<script\b[\s\S]*?<\/script>/g, '')
  .replace(/<template\b[\s\S]*?<\/template>/g, '')
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, '')
  .replace(/\/_vercel\/image\?url=([^&"]+)[^"]*/g, (_, url) =>
    decodeURIComponent(url)
  )
  .replace('</head>', `<style>${css}</style></head>`)
writeFileSync(outFile, html)
console.log(source.status, html.length, outFile)
process.exit(0)
