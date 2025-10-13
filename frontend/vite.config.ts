import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 10000, // Puerto por defecto de Render
    allowedHosts: [
      'ohsansi-registro-de-evaluaciones-de-2cyx.onrender.com',
      'localhost',
      '.onrender.com' // Permite cualquier subdominio de onrender.com
    ],
    strictPort: false
  }
})
