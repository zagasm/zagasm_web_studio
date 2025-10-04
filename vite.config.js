import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: '/', // Ensures assets are loaded from root in production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper asset handling
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // server: {
  //   hmr: {
  //     overlay: false,
  //   },
  // },
})

