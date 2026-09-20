import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function staticHtmlAliases(): Plugin {
  const rewrite = (url?: string) => {
    if (!url) return url
    return url.replace(/^\/rate-us(?=\?|$)/, '/rate-us.html')
      .replace(/^\/OCR-Demo(?=\?|$)/, '/OCR-Demo.html')
  }

  return {
    name: 'static-html-aliases',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        req.url = rewrite(req.url)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        req.url = rewrite(req.url)
        next()
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [staticHtmlAliases(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'react-vendor'
          if (id.includes('node_modules/react') && !id.includes('react-dom')) return 'react-vendor'
          if (id.includes('node_modules/firebase')) return 'firebase'
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
  },
})
