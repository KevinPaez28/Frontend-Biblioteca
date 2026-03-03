import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'  // Nueva línea
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    viteStaticCopy({
      targets: [{
        src: 'src/views/**',     // Copia TODO src/views/ (HTML + estructura)
        dest: 'views'            // → dist/views/home/index.html
      }]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@views': path.resolve(__dirname, './src/views'),
      '@components': path.resolve(__dirname, './src/components'),
      '@helpers': path.resolve(__dirname, './src/helpers')
    }
  }
})
