
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Remove the componentTagger import as it may be causing issues
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["b0a9f463-f385-4c3b-8bb1-3e566f030887.lovableproject.com"],
  },
  plugins: [
    react(),
    // Commenting out the componentTagger which might not be compatible with Vite 6
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  },
}));
