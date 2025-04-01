import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuration Vite pour le build client uniquement (Netlify)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Utilisons des chemins relatifs pour éviter les problèmes d'alias @/
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
    sourcemap: true,
  },
});