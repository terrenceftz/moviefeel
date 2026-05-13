import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", nodeVersion: process.version });
  });

  // Douban Proxy API
  app.get("/api/douban-proxy", async (req, res) => {
    const { url } = req.query;
    console.log(`Proxy request for URL: ${url}`);
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://movie.douban.com/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        },
        timeout: 10000,
        validateStatus: () => true // Allow all statuses so we can forward them
      });

      console.log(`Douban response status: ${response.status}`);
      
      res.status(response.status);
      const contentType = response.headers["content-type"];
      res.header("Content-Type", typeof contentType === 'string' ? contentType : "text/html");
      res.send(response.data);
    } catch (error: any) {
      console.error("Proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch from Douban", message: error.message });
    }
  });

  // Emby Proxy API
  app.get("/api/emby-proxy", async (req, res) => {
    const { url } = req.query;
    console.log(`Emby proxy request: ${url}`);

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        timeout: 15000,
      });

      res.status(response.status);
      res.header("Content-Type", "application/json");
      res.send(response.data);
    } catch (error: any) {
      console.error("Emby proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch from Emby", message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
