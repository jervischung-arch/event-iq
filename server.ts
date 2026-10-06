import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { extractIntent, refineIntent, rankAndExplainEvents, UserIntent } from "./server/ragEngine.js";
import apiRouter from "./api/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// Mount root /api routes (Ticketmaster, Sora, Health)
app.use("/api", apiRouter);

const PORT = 3000;
const isProd = process.env.NODE_ENV === "production";

// 1. Health & Configuration Status
app.get("/api/status", (_req: Request, res: Response) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  const hasDiscoveryApi = Boolean(process.env.EVENT_API_KEY && process.env.EVENT_API_KEY.trim() !== "");

  res.json({
    status: "ok",
    app: "EventIQ",
    version: "2.4.0",
    geminiConfigured: hasGemini,
    providerMode: hasDiscoveryApi ? "live_api" : "curated_provider",
    tagline: "Search tells you what is happening. EventIQ tells you what you should do.",
  });
});

// 2. Extract Intent from Natural Language Prompt
app.post("/api/intent/extract", async (req: Request, res: Response) => {
  try {
    const { prompt, location } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing prompt string" });
      return;
    }

    const intent = await extractIntent(prompt, location);
    res.json({ intent });
  } catch (err: any) {
    console.error("Error in /api/intent/extract:", err);
    res.status(500).json({ error: err.message || "Failed to extract intent" });
  }
});

// 3. Search and Rank Events using extracted intent
app.post("/api/events/search", async (req: Request, res: Response) => {
  try {
    const { intent } = req.body as { intent: UserIntent };
    if (!intent) {
      res.status(400).json({ error: "Missing intent object" });
      return;
    }

    const { recommendations, retrievalSource } = await rankAndExplainEvents(intent);
    res.json({
      intent,
      recommendations,
      retrievalSource,
      totalCount: recommendations.length,
    });
  } catch (err: any) {
    console.error("Error in /api/events/search:", err);
    res.status(500).json({ error: err.message || "Failed to search events" });
  }
});

// 4. Conversational Refinement
app.post("/api/events/refine", async (req: Request, res: Response) => {
  try {
    const { previousIntent, refinementPrompt } = req.body as {
      previousIntent: UserIntent;
      refinementPrompt: string;
    };

    if (!previousIntent || !refinementPrompt) {
      res.status(400).json({ error: "Missing previousIntent or refinementPrompt" });
      return;
    }

    const updatedIntent = await refineIntent(previousIntent, refinementPrompt);
    const { recommendations, retrievalSource } = await rankAndExplainEvents(updatedIntent);

    res.json({
      intent: updatedIntent,
      recommendations,
      retrievalSource,
      appliedRefinement: refinementPrompt,
    });
  } catch (err: any) {
    console.error("Error in /api/events/refine:", err);
    res.status(500).json({ error: err.message || "Failed to refine events" });
  }
});

// 5. Complete Single-Trip Pipeline (Prompt -> Intent -> TM API -> RAG Ranking)
app.post("/api/experience/pipeline", async (req: Request, res: Response) => {
  try {
    const { prompt, location } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing prompt string" });
      return;
    }

    const intent = await extractIntent(prompt, location);
    const { recommendations, retrievalSource } = await rankAndExplainEvents(intent);

    res.json({
      intent,
      recommendations,
      retrievalSource,
    });
  } catch (err: any) {
    console.error("Error in /api/experience/pipeline:", err);
    res.status(500).json({ error: err.message || "Failed experience pipeline" });
  }
});

// 6. Enterprise / B2B Lead capture & API simulator
app.post("/api/b2b/inquire", (req: Request, res: Response) => {
  const { companyName, industry, email, volume } = req.body;
  res.json({
    success: true,
    message: "Thank you for inquiring about EventIQ Enterprise API & White-Label Concierge.",
    lead: { companyName, industry, email, volume, tier: "Enterprise Custom" },
    sampleApiKey: `eiq_live_${Math.random().toString(36).substring(2, 12)}`,
    sandboxEndpoint: "https://api.eventiq.ai/v2/concierge/recommend",
  });
});

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
