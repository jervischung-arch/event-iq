import { Request, Response } from "express";

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "down";
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  integrations: {
    ticketmaster: {
      configured: boolean;
      status: "ready" | "missing_api_key";
    };
    sora: {
      configured: boolean;
      status: "ready" | "missing_api_key";
    };
    gemini: {
      configured: boolean;
      status: "ready" | "missing_api_key";
    };
  };
  system: {
    nodeVersion: string;
    memoryUsageMB: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
  };
}

export function getHealthStatus(): HealthCheckResponse {
  const hasTicketmasterKey = Boolean(
    process.env.TICKETMASTER_API_KEY && process.env.TICKETMASTER_API_KEY.trim() !== ""
  );
  const hasSoraKey = Boolean(
    (process.env.SORA_API_KEY && process.env.SORA_API_KEY.trim() !== "") ||
    (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "")
  );
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ""
  );

  const mem = process.memoryUsage();

  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    integrations: {
      ticketmaster: {
        configured: hasTicketmasterKey,
        status: hasTicketmasterKey ? "ready" : "missing_api_key",
      },
      sora: {
        configured: hasSoraKey,
        status: hasSoraKey ? "ready" : "missing_api_key",
      },
      gemini: {
        configured: hasGeminiKey,
        status: hasGeminiKey ? "ready" : "missing_api_key",
      },
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: {
        rss: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        heapTotal: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsed: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      },
    },
  };
}

export async function healthHandler(req: Request, res: Response): Promise<void> {
  try {
    const health = getHealthStatus();
    res.status(200).json(health);
  } catch (error: any) {
    res.status(500).json({
      status: "down",
      timestamp: new Date().toISOString(),
      error: error.message || "Health check failed",
    });
  }
}
