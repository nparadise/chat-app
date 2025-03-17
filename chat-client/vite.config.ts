import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "../key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../cert.pem")),
    },
    host: "localhost",
    port: 3000,
  },
});
