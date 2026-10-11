import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // The project lives on a Windows drive under WSL, where file-change events do not reach
  // Linux. Polling keeps hot reload working there.
  server: { watch: { usePolling: Boolean(process.env.WSL_DISTRO_NAME), interval: 300 } },
})
