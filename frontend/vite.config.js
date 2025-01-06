import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode === "production" ? "/" : "/"; // Servir desde la raíz

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: "build", // Carpeta donde se generará el build
      minify: true, // Minimiza los archivos para producción
    },
  };
});