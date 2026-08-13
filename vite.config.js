import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset URLs relative so the build works from any path,
// including a GitHub Pages project subdirectory.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 8743 },
  preview: { port: 8743 },
  build: {
    rollupOptions: {
      output: {
        // Keep the idea data in its own chunk so editing app code does not
        // invalidate it in the browser cache, and vice versa.
        manualChunks(id) {
          if (id.includes('data/ideas.json')) return 'ideas';
          if (id.includes('node_modules')) return 'vendor';
          return null;
        },
      },
    },
  },
});
