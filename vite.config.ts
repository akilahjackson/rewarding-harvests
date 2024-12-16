import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Development Server Settings
  server: {
    host: true,       // Accessible via LAN
    port: 8080,       // Custom port
  },

  // Vite Plugins
  plugins: [
    react(),          // React plugin
    tsconfigPaths(),  // Resolves TypeScript paths from tsconfig.json
  ],

  // Module Resolution
  resolve: {
    alias: {
      "@": "/src",    // Shortcut for the `src` folder
    },
  },

  // Global Definitions
  define: {
    'process.env': process.env,  // Fixes environment variables
  },

  // Build Settings (Optional Customization)
  build: {
    outDir: "dist",           // Output directory for production build
    sourcemap: true,          // Generates source maps for easier debugging
    rollupOptions: {
      input: "index.html",    // Main HTML entry
    },
  },
});
