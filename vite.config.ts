import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    port: 8000,
    host: true,
    allowedHosts: ["zaimo.duckdns.org"]
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/@react-three')) return 'r3f';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
})
