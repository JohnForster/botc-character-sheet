import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CharacterSheet',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['preact', 'preact/hooks'],
      output: {
        // Provide global variables for externalized deps (not needed for ES modules but good practice)
        globals: {
          preact: 'preact',
          'preact/hooks': 'preactHooks'
        }
      }
    },
    // Ensure CSS is extracted to a separate file
    cssCodeSplit: false
  }
})
