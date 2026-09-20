import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
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
