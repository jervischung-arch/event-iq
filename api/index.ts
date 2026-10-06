import { Router } from "express";
import { healthHandler } from "./health.js";
import { soraGenerateHandler, soraStatusHandler } from "./sora.js";
import { searchEventsHandler, getEventDetailsHandler } from "./ticketmaster.js";

const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", healthHandler);

// Sora video generation endpoints
apiRouter.post("/sora/generate", soraGenerateHandler);
apiRouter.get("/sora/status/:id", soraStatusHandler);

// Ticketmaster Discovery API endpoints
apiRouter.get("/ticketmaster/events", searchEventsHandler);
apiRouter.get("/ticketmaster/events/:id", getEventDetailsHandler);

export default apiRouter;
export { healthHandler } from "./health.js";
export * from "./sora.js";
export * from "./ticketmaster.js";
