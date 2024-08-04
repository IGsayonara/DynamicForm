import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    setupFiles: './vitest.setup.mts',
  },
})
