import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Launchpad-V/' : '/',
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['react-icons/fi']
  }
})
