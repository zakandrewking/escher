import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: resolve(__dirname, 'dev-server'),
  define: {
    ESCHER_VERSION: JSON.stringify(pkg.version)
  },
  server: {
    fs: {
      allow: [__dirname]
    }
  },
  optimizeDeps: {
    entries: [resolve(__dirname, 'dev-server/index.html')]
  }
})
