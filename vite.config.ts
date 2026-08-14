import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { openSkyDevProxy } from './server/openskyDevProxy.ts'
import { geminiDevProxy } from './server/geminiDevProxy.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars to client code via import.meta.env.
  // Our dev-only proxies run as plain Node middleware and read process.env
  // directly, so server-only secrets (no VITE_ prefix) need loading by hand.
  const env = loadEnv(mode, process.cwd(), '')
  process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [react(), tailwindcss(), openSkyDevProxy(), geminiDevProxy()],
    optimizeDeps: {
      exclude: ['maplibre-gl'],
    },
  }
})
