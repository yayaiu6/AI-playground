import { readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { pathToFileURL, fileURLToPath } from 'node:url'

const htmlPath = new URL('../dist/index.html', import.meta.url)
const html = await readFile(htmlPath, 'utf8')
let serverEntryPath = fileURLToPath(new URL('../dist-ssr/entry-server.js', import.meta.url))
try {
  await readFile(serverEntryPath)
} catch {
  const serverFiles = await readdir(new URL('../dist-ssr/assets/', import.meta.url))
  const serverBundle = serverFiles.find((file) => file.startsWith('entry-server-') && file.endsWith('.js'))
  if (!serverBundle) throw new Error('Could not find the built server-render entry')
  serverEntryPath = fileURLToPath(new URL(`../dist-ssr/assets/${serverBundle}`, import.meta.url))
}
const serverEntry = await import(pathToFileURL(serverEntryPath).href)
const markup = await serverEntry.render()
const renderedHtml = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${markup}</div>`)

if (renderedHtml === html) throw new Error('Could not find the application root in dist/index.html')
await writeFile(htmlPath, renderedHtml)
await rm(new URL('../dist-ssr/', import.meta.url), { recursive: true, force: true })
