import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { base, deployment } from './src/settings'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
  build: {
    sourcemap: deployment == 'dev' ? 'inline' : false
  }
})
