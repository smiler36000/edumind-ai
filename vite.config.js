import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//
// `base` is RELATIVE so the same build works on any host and any sub-path:
//   - Vercel        -> https://edumind-ai.vercel.app/
//   - GitHub Pages  -> https://smiler36000.github.io/edumind-ai/
// A relative base would break a router that uses real URL paths, but this app
// uses hash routing (see src/App.jsx), so the document path never changes and
// relative asset URLs always resolve correctly.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
