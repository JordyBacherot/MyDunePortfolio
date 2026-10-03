/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://portfolio.jordy-bacherot.fr',
      generateRobotsTxt: false
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Tests du site uniquement (motion/ et les skills de .claude/ ont leurs propres fichiers)
  test: {
    include: ["src/**/*.test.ts"],
  },
})
