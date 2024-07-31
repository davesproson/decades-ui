/// <reference types="vitest" />
import path from "path"
import react from "@vitejs/plugin-react"
import checker from 'vite-plugin-checker'
import { defineConfig, loadEnv } from "vite"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default ({ mode }) => {
  const env = loadEnv(mode, '.');

  return defineConfig({

    plugins: [
      react(),
      checker({
        typescript: true
      }),
      TanStackRouterVite()
    ],
    test: {
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'html'],
        exclude: [
          'node_modules/',
          '.src/tests/setup.ts',
        ],
      },
      setupFiles: ['./src/tests/setup.ts'],
      globals: true,
    },
    base: env.VITE_VISTA_BASE_URL,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@store": path.resolve(__dirname, "./src/redux/store.ts"),
      },
    },
  })
}
