import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ar-motion.ts',
      formats: ['es'],
      fileName: () => 'ar-motion.js',
    },
    outDir: 'dist/ar/assets',
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
  },
})
