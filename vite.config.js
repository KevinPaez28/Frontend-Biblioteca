import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          const { name } = assetInfo
          if (name && name.startsWith('views/')) {
            return name
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
