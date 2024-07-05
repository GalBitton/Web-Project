import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
      },
    },
  },
  server: {
    port: 5713,
    open: true,
    fs: {
      allow: ['.'],
    },
    middlewareMode: false,
    proxy: {
      '/dashboard': {
        target: 'http://localhost:5713/src/pages/dashboard.html',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dashboard$/, '')
      },
    },
  },
  // Configure Vite to rewrite URLs for the production build
  configureServer: ({ app }) => {
    app.use((req, res, next) => {
      if (req.originalUrl === '/dashboard') {
        req.url = '/src/pages/dashboard.html';
      }
      next();
    });
  }
});
