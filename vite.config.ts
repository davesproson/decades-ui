import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default ({ mode }) => {
  const env = loadEnv(mode, '.');

  return defineConfig({
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    base: env.VITE_VISTA_BASE_URL,
    build: {
      sourcemap: env.VITE_VISTA_DEPLOYMENT_MODE === 'dev' ? 'inline' : false
    }
  })
}
