import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
import { getAliases } from 'vite-aliases';

const aliases = getAliases();

export default defineConfig({
  root: path.resolve(__dirname, '../'),
  publicDir: path.resolve(__dirname, '../public'),
  plugins: [reactRefresh()],
  resolve: {
    alias: aliases,
  },
  server: { port: 8080 },
});
