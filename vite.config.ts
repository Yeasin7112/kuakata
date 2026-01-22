
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    EnvironmentPlugin(['API_KEY'])
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
