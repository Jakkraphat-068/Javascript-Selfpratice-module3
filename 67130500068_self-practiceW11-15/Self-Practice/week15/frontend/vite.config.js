import { defineConfig } from 'vite'

export default defineConfig({
  base: '/intproj25/sy3/itb-ecors/',
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
