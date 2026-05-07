import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  define: {
    ESCHER_VERSION: JSON.stringify(pkg.version)
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/escher-widget.js'),
      formats: ['es'],
      fileName: () => 'escher-widget.js'
    },
    // No externals — anywidget loads this bundle as a standalone URL; it must
    // be self-contained. Builder injects its own CSS internally via ?raw, so
    // no separate CSS file is produced and _css is not needed.
    outDir: 'dist',
    emptyOutDir: false,   // preserve dist/escher.js from the main build
    commonjsOptions: {
      include: [/node_modules/, /src\//],
      transformMixedEsModules: true
    },
    sourcemap: true
  }
})
