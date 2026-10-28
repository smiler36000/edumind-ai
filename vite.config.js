import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` must match the GitHub Pages project path:
// https://smiler36000.github.io/edumind-ai/
// Without it, bundled assets would 404 on Pages.
export default defineConfig({
  base: '/edumind-ai/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
