import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  try {
    const app = await createApp();
    const PORT = 3000;

    // Start listening immediately so the platform can reach the app
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Brivo server listening on port ${PORT}`);
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Starting Vite in middleware mode...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware integrated.');
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } catch (err) {
    console.error('FAILED TO START SERVER:', err);
    process.exit(1);
  }
}

start();
