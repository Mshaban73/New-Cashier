// vite.config.ts
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  plugins: [ VitePWA({ registerType: 'autoUpdate' /* ... باقي إعدادات PWA ... */ }) ]
});