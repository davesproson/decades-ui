import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
// @ts-ignore
import { base, deployment } from './src/settings'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  base: base,
  build: {
    sourcemap: deployment == 'dev' ? 'inline' : false
  }
})
