import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Production hardening
  build: {
    sourcemap: false, // don't publish source maps publicly
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [], // strip console/debugger in prod
  },
}));
