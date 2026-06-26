import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5678,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_HOST || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
