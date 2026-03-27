import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: ['node_modules', '.claude/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**', 'src/hooks/**', 'src/context/**', 'src/pages/**'],
    },
    server: {
      deps: {
        inline: ['@exodus/bytes'],
      },
    },
  },
})
