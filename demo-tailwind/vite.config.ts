import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'use-command-palette': resolve(__dirname, '../src/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
