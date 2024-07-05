import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    middlewareMode: true,
    port: 5713,
    setup: ({ app }) => {
      app.use((req, res, next) => {
        if (req.url === '/dashboard') {
          res.sendFile(resolve(__dirname, 'src/pages/dashboard.html'));
        } else {
          next();
        }
      });
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
      },
    },
  },
});
