import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load environment variables from the appropriate file
  const envDir = path.resolve(__dirname, 'src/config');
  const envFile = path.join(envDir, `.env.${mode}`);
  dotenv.config({ path: envFile });

  return {
    plugins: [react()],
    define: {
      'process.env': process.env,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
