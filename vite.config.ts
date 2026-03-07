// Dependencies: defineConfig, plugin-react, server.proxy — see DEPENDENCY_GUIDE.md
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy: forwards /api/* requests to the backend during development so the browser
    // sees all requests going to the same origin (5173), avoiding CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
