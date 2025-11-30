import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  root: '.',
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        main: './index.html',
        reserve: './reserve.html'
      }
    }
  }
})
 