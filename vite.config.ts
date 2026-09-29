import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function staticHtmlAliases(): Plugin {
  const staticRoutes: Record<string, string> = {
    '/ar/': '/ar/index.html',
    '/projects/ai-ats-system/': '/projects/ai-ats-system/index.html',
    '/projects/ai-english-tutor/': '/projects/ai-english-tutor/index.html',
    '/projects/handwriting-ocr/': '/projects/handwriting-ocr/index.html',
    '/projects/lahzi/': '/projects/lahzi/index.html',
    '/projects/quran-recitation-ai/': '/projects/quran-recitation-ai/index.html',
    '/ar/projects/ai-ats-system/': '/ar/projects/ai-ats-system/index.html',
    '/ar/projects/ai-english-tutor/': '/ar/projects/ai-english-tutor/index.html',
    '/ar/projects/handwriting-ocr/': '/ar/projects/handwriting-ocr/index.html',
    '/ar/projects/lahzi/': '/ar/projects/lahzi/index.html',
    '/ar/projects/quran-recitation-ai/': '/ar/projects/quran-recitation-ai/index.html',
  }

  const rewrite = (url?: string) => {
    if (!url) return url
    const parsed = new URL(url, 'http://localhost')
    const withTrailingSlash = parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`
    const mapped = staticRoutes[withTrailingSlash]
      ?? ({ '/rate-us': '/rate-us.html', '/OCR-Demo': '/OCR-Demo.html' } as Record<string, string>)[parsed.pathname]

    return mapped ? `${mapped}${parsed.search}` : url
  }

  return {
    name: 'static-html-aliases',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/ar/assets/ar-motion.js') {
          req.url = '/src/ar-motion.ts'
        }
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
