import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    sitemap({
      hostname: 'https://iti.faku.pro',
      dynamicRoutes: ['/', '/politicas', '/contacto'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
})
