
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    // This allows process.env.API_KEY to work in the browser
    EnvironmentPlugin(['API_KEY'])
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
