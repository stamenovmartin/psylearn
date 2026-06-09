import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the PsyLearn Profiler frontend.
// The dev server runs on port 5173 (the default the backend CORS example allows).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
  },
})
