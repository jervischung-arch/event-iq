import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import apiRouter from "./api/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// Global CORS & pre-flight handler
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (_req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Mount all /api routes from root /api router
app.use("/api", apiRouter);

const PORT = 3000;
const isProd = process.env.NODE_ENV === "production";

// Vite Middlewares in dev, static files in production
async function startServer() {
  if (isProd) {
    app.use(express.static("dist"));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EventIQ] Concierge Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start EventIQ server:", err);
  process.exit(1);
});
