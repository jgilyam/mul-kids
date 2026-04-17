import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
  })],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  define: {
    'React': 'globalThis.React',
  },
})
