import { Router, Request, Response } from "express";
import { healthHandler } from "./health.js";
import { searchEventsHandler, getEventDetailsHandler } from "./ticketmaster.js";
import { extractIntent, refineIntent, rankAndExplainEvents, UserIntent } from "../server/ragEngine.js";

const apiRouter = Router();

// CORS & Preflight handling
apiRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// 1. Health check & Status endpoints
apiRouter.get("/health", healthHandler);

apiRouter.get("/status", (_req: Request, res: Response) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  const hasTicketmaster = Boolean(process.env.TICKETMASTER_API_KEY && process.env.TICKETMASTER_API_KEY.trim() !== "");

  res.json({
    status: "ok",
    app: "EventIQ",
    version: "2.4.0",
    geminiConfigured: hasGemini,
    providerMode: hasTicketmaster ? "live_api" : "curated_provider",
    tagline: "Search tells you what is happening. EventIQ tells you what you should do.",
  });
});

// 2. Complete Concierge Pipeline endpoint (POST + GET fallback)
apiRouter.post("/experience/pipeline", async (req: Request, res: Response) => {
  try {
    const { prompt, location } = req.body || {};
    const searchPrompt = prompt && typeof prompt === "string" ? prompt : "Great weekend experience";
    const searchLocation = location && typeof location === "string" ? location : "New York";

    const intent = await extractIntent(searchPrompt, searchLocation);
    const { recommendations, retrievalSource } = await rankAndExplainEvents(intent);

    res.json({
      intent,
      recommendations,
      retrievalSource,
    });
  } catch (err: any) {
    console.error("Error in /api/experience/pipeline:", err);
    res.status(500).json({ error: err.message || "Failed concierge pipeline" });
  }
});

// GET fallback on pipeline so it never 404s if accessed directly in a browser
apiRouter.get("/experience/pipeline", async (req: Request, res: Response) => {
  try {
    const prompt = (req.query.prompt as string) || "Weekend events";
    const location = (req.query.location as string) || "New York";

    const intent = await extractIntent(prompt, location);
    const { recommendations, retrievalSource } = await rankAndExplainEvents(intent);

    res.json({
      intent,
      recommendations,
      retrievalSource,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Pipeline error" });
  }
});

// 3. Extract Intent endpoint
apiRouter.post("/intent/extract", async (req: Request, res: Response) => {
  try {
    const { prompt, location } = req.body || {};
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

// 4. Search & Rank Events endpoint
apiRouter.post("/events/search", async (req: Request, res: Response) => {
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

// 5. Conversational Refinement endpoint
apiRouter.post("/events/refine", async (req: Request, res: Response) => {
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

// 6. Enterprise / B2B Inquiry endpoint
apiRouter.post("/b2b/inquire", (req: Request, res: Response) => {
  const { companyName, industry, email, volume } = req.body || {};
  res.json({
    success: true,
    message: "Thank you for inquiring about EventIQ Enterprise API & White-Label Concierge.",
    lead: { companyName, industry, email, volume, tier: "Enterprise Custom" },
    sampleApiKey: `eiq_live_${Math.random().toString(36).substring(2, 12)}`,
    sandboxEndpoint: "https://api.eventiq.ai/v2/concierge/recommend",
  });
});

// 7. Ticketmaster Discovery API endpoints
apiRouter.get("/ticketmaster/events", searchEventsHandler);
apiRouter.get("/ticketmaster/events/:id", getEventDetailsHandler);

export default apiRouter;
export { healthHandler } from "./health.js";
export * from "./ticketmaster.js";
