import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
        terms: resolve(__dirname, 'src/pages/terms.html'),
        privacy: resolve(__dirname, 'src/pages/privacy.html'),
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
      '/terms-of-service': {
        target: 'http://localhost:5713/src/pages/terms.html',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/terms-of-service$/, '')
      },
      '/privacy-policy': {
        target: 'http://localhost:5713/src/pages/privacy.html',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/privacy-policy$/, '')
      },
    },
  },
  // Configure Vite to rewrite URLs for the production build
  configureServer: ({ app }) => {
    app.use((req, res, next) => {
      if (req.originalUrl === '/dashboard') {
        req.url = '/src/pages/dashboard.html';
      } else if (req.originalUrl === '/terms-of-service') {
        req.url = '/src/pages/terms.html'
      } else if (req.originalUrl === '/privacy-policy') {
        req.url = '/src/pages/privacy.html'
      }
      next();
    });
  }
});
