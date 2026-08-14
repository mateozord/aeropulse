import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { openSkyDevProxy } from './server/openskyDevProxy.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), openSkyDevProxy()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})
