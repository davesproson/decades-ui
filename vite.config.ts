import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { base } from './src/settings'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base
})
