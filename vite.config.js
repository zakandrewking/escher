import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json'

// __dirname is not available in ESM; derive it from import.meta.url
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  define: {
    // Replicates webpack.common.js DefinePlugin
    ESCHER_VERSION: JSON.stringify(pkg.version)
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'escher',
      formats: ['umd'],
      fileName: () => 'escher.js'
    },
    rollupOptions: {
      // Replicates webpack.prod.js externals
      external: ['@jupyter-widgets/base'],
      output: {
        exports: 'named'
      }
    },
    // Six src files use module.exports (CJS): CobraModel, completely, DataMenu,
    // Draw, PlacedDiv, utils. Extend commonjs plugin to cover project source files.
    commonjsOptions: {
      include: [/node_modules/, /src\//],
      // Six src files mix ESM imports with module.exports (Webpack/Babel hid this).
      // Rollup needs this flag to handle the mixed syntax.
      transformMixedEsModules: true
    },
    sourcemap: true
  },
  test: {
    include: ['src/tests/test_*.js'],
    // d3Body.js manually constructs jsdom and sets global.document/window,
    // so use 'node' environment rather than Vitest's built-in jsdom.
    environment: 'node',
    globals: true,  // needed for CJS test files that proxy globalThis.describe via mocha shim
    css: false,     // suppresses CSS processing (replaces webpack.test.js null-loader)
    // Run d3Body before each test file so global.window/document are defined before
    // any test module (including mousetrap) is loaded. Mousetrap's IIFE does
    // `window.Mousetrap = Mousetrap` which crashes in Node without a window.
    setupFiles: ['./src/tests/helpers/d3Body.js'],
    alias: {
      // Redirect mocha imports to Vitest shim — scoped to tests only, not the production build
      mocha: resolve(__dirname, 'src/tests/__mocks__/mocha.js')
    }
  }
})
