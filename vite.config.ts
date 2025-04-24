import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync('certs/privkey.pem'),
      cert: fs.readFileSync('certs/fullchain.pem'),
    },
    allowedHosts: ['emes.bj'],
    cors: true,
    host: "0.0.0.0",
    port: 10004,
  }
});
