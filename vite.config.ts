
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    // This allows environment variables to work in the browser
    EnvironmentPlugin(['API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'])
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
