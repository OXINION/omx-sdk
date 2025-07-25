import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'demo.html',
    },
  },
  server: {
    port: 3000,
  },
});
