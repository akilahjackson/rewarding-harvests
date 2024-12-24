import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Provide fallback values for environment variables
    'import.meta.env.VITE_GAMESHIFT_API_KEY': JSON.stringify(process.env.VITE_GAMESHIFT_API_KEY || 'development_key'),
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL || 'http://localhost:3000'),
  }
});