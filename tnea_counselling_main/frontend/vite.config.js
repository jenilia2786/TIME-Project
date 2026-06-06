import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ─── Dev Server Proxy ───────────────────────────────────────────────────
  server: {
    proxy: {
      '/recommend':         { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/chat':              { target: 'http://127.0.0.1:8000', changeOrigin: true },
      // Use regex to strictly match /college and /college/* to avoid hijacking /colleges React route
      '^/college(/.*)?$':   { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/directory':         { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/metadata':          { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/tfc':               { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/choice':            { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/calculate-cutoff':  { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/health':            { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/rag_records':       { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/auth':              { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/profile':           { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/profiles':          { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/chat-history':      { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/saved-colleges':    { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },

  // ─── Production Build ───────────────────────────────────────────────────
  build: {
    emptyOutDir: true,
  },
})
