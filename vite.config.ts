import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all IPv6 addresses
    port: 8080, // Development server port
  },
  plugins: [
    react(), // React SWC plugin
    tsconfigPaths(), // Support for TS path aliases
    componentTagger(), // Tagging plugin
  ],
  build: {
    outDir: 'dist', // Output directory for the build
    sourcemap: mode === 'development', // Generate source maps in development mode
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for your source directory
    },
  },
}));