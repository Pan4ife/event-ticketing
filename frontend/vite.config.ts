import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev mode only: the page calls /actuator/... and Vite forwards it to the backend.
    // https://vite.dev/config/server-options#server-proxy
    proxy: {
      '/actuator': 'http://localhost:8080',
    },
  },
})
