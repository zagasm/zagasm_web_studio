import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  base: "/", // Ensures assets are loaded from root in production
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure proper asset handling
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://api.studios.zagasm.com",
        changeOrigin: true,
        secure: true,
        // Optional: if the upstream checks Origin, pretend to be the allowed site
        headers: { Origin: "https://zagasm.com" },
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/media": {
        target: "https://api.studio.zagasm.com",
        changeOrigin: true,
        secure: true,
        // rewrite your local path to the real one
        // e.g. /media/storage/audio/...  ->  /storage/audio/...
        rewrite: (path) => path.replace(/^\/media/, ""),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            // Force open CORS for dev
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-credentials"] = "true";
            proxyRes.headers["access-control-allow-headers"] =
              "Origin, X-Requested-With, Content-Type, Accept, Range";
          });
        },
      },
    },
  },
});
