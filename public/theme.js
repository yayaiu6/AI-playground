/* Shared palette system. Add a palette here; components only consume semantic tokens. */
(() => {
  const palettes = [
    { primary: '#2f8cff', primaryHover: '#62b0ff', accent: '#36d6d0', bg: '#0b0e13', surface: '#131a22', raised: '#0f151c', border: '#263642', borderStrong: '#38505f', text: '#f2f7fb', muted: '#b4c2cc', subtle: '#8294a1' },
    { primary: '#ff7a59', primaryHover: '#ff9b7b', accent: '#ffd166', bg: '#120d0d', surface: '#1d1515', raised: '#171010', border: '#493333', borderStrong: '#644747', text: '#fff5ef', muted: '#d5bbb0', subtle: '#aa8f87' },
    { primary: '#5b8def', primaryHover: '#8bb1ff', accent: '#f59e8b', bg: '#0b101a', surface: '#141c2b', raised: '#101725', border: '#2b405d', borderStrong: '#42618a', text: '#f2f6ff', muted: '#b9c7dc', subtle: '#8496b2' },
    { primary: '#36c5f0', primaryHover: '#78d8f4', accent: '#a3e635', bg: '#091114', surface: '#101d21', raised: '#0d181b', border: '#24434b', borderStrong: '#37636d', text: '#effcff', muted: '#b5d0d6', subtle: '#7fa3ab' },
    { primary: '#f4b942', primaryHover: '#ffd477', accent: '#ff6b8a', bg: '#11100b', surface: '#1d1a11', raised: '#17150d', border: '#4b4025', borderStrong: '#66572f', text: '#fff9e8', muted: '#d3c6a4', subtle: '#a09370' },
    { primary: '#4ade80', primaryHover: '#86efac', accent: '#60a5fa', bg: '#09110e', surface: '#111d18', raised: '#0d1813', border: '#294539', borderStrong: '#3c6650', text: '#effff4', muted: '#b8d3c2', subtle: '#83a58f' },
  ]
  const palette = palettes[Math.floor(Math.random() * palettes.length)]
  const root = document.documentElement
  const rgba = (hex, alpha) => {
    const value = hex.slice(1)
    const n = Number.parseInt(value, 16)
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha}`
  }
  root.style.setProperty('--color-primary', palette.primary)
  root.style.setProperty('--color-primary-hover', palette.primaryHover)
  root.style.setProperty('--color-primary-dark', palette.primaryHover)
  root.style.setProperty('--color-primary-soft', `rgba(${rgba(palette.primary, .12)})`)
  root.style.setProperty('--color-accent', palette.accent)
  root.style.setProperty('--color-accent-soft', `rgba(${rgba(palette.accent, .12)})`)
  root.style.setProperty('--color-bg', palette.bg)
  root.style.setProperty('--color-surface', palette.surface)
  root.style.setProperty('--color-surface-raised', palette.raised)
  root.style.setProperty('--color-border', palette.border)
  root.style.setProperty('--color-border-strong', palette.borderStrong)
  root.style.setProperty('--color-focus', palette.primaryHover)
  root.style.setProperty('--bg', palette.bg)
  root.style.setProperty('--bg-alt', palette.raised)
  root.style.setProperty('--alt', palette.raised)
  root.style.setProperty('--bg-card', palette.surface)
  root.style.setProperty('--card', palette.surface)
  root.style.setProperty('--border', palette.border)
  root.style.setProperty('--line', palette.border)
  root.style.setProperty('--border-light', palette.borderStrong)
  root.style.setProperty('--line-light', palette.borderStrong)
  root.style.setProperty('--text', palette.text)
  root.style.setProperty('--text-muted', palette.muted)
  root.style.setProperty('--muted', palette.muted)
  root.style.setProperty('--text-subtle', palette.subtle)
  root.style.setProperty('--subtle', palette.subtle)
})()
