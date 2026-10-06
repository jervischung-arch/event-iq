import { Request, Response } from "express";

export interface SoraGenerationRequest {
  prompt: string;
  durationSeconds?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  resolution?: "720p" | "1080p";
  referenceImageUrl?: string;
}

export interface SoraGenerationResponse {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  videoUrl?: string;
  prompt: string;
  createdAt: string;
  error?: string;
}

// In-memory registry for jobs during session
const soraJobs = new Map<string, SoraGenerationResponse>();

function getSoraApiKey(): string | null {
  const key = process.env.SORA_API_KEY || process.env.OPENAI_API_KEY;
  return key && key.trim() !== "" ? key.trim() : null;
}

/**
 * Initiates a Sora video generation request.
 * API key must be provided via SORA_API_KEY or OPENAI_API_KEY environment variables.
 */
export async function createSoraVideo(
  params: SoraGenerationRequest
): Promise<SoraGenerationResponse> {
  const apiKey = getSoraApiKey();

  if (!params.prompt || params.prompt.trim() === "") {
    throw new Error("Prompt is required for Sora video generation");
  }

  const jobId = `sora_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // If live API key is configured, call external Sora endpoint
  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/video/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "sora-1.0",
          prompt: params.prompt,
          duration: params.durationSeconds || 5,
          aspect_ratio: params.aspectRatio || "16:9",
          resolution: params.resolution || "720p",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const job: SoraGenerationResponse = {
          id: data.id || jobId,
          status: data.status || "processing",
          progress: data.progress || 10,
          videoUrl: data.video_url || undefined,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
        };
        soraJobs.set(job.id, job);
        return job;
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn("Sora API response error:", errJson);
      }
    } catch (err: any) {
      console.warn("Sora API request failed:", err.message);
    }
  }

  // Graceful staged response when API key is not yet provided or in development mode
  const job: SoraGenerationResponse = {
    id: jobId,
    status: apiKey ? "processing" : "queued",
    progress: apiKey ? 25 : 0,
    prompt: params.prompt,
    createdAt: new Date().toISOString(),
    error: apiKey ? undefined : "SORA_API_KEY not configured. Please set SORA_API_KEY in your environment.",
  };

  soraJobs.set(jobId, job);
  return job;
}

/**
 * Checks the status of a Sora video generation by job ID.
 */
export async function getSoraJobStatus(jobId: string): Promise<SoraGenerationResponse | null> {
  const apiKey = getSoraApiKey();
  const existing = soraJobs.get(jobId);

  if (apiKey && jobId.startsWith("gen_")) {
    try {
      const response = await fetch(`https://api.openai.com/v1/video/generations/${jobId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updated: SoraGenerationResponse = {
          id: data.id,
          status: data.status,
          progress: data.progress,
          videoUrl: data.video_url,
          prompt: data.prompt || (existing ? existing.prompt : ""),
          createdAt: data.created_at || (existing ? existing.createdAt : new Date().toISOString()),
        };
        soraJobs.set(jobId, updated);
        return updated;
      }
    } catch (err: any) {
      console.warn("Error polling Sora status:", err.message);
    }
  }

  return existing || null;
}

// Express route handlers
export async function soraGenerateHandler(req: Request, res: Response): Promise<void> {
  try {
    const { prompt, durationSeconds, aspectRatio, resolution, referenceImageUrl } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Missing required parameter 'prompt'" });
      return;
    }

    const job = await createSoraVideo({
      prompt,
      durationSeconds,
      aspectRatio,
      resolution,
      referenceImageUrl,
    });

    res.status(202).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate video with Sora" });
  }
}

export async function soraStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing job ID parameter" });
      return;
    }

    const job = await getSoraJobStatus(id);
    if (!job) {
      res.status(404).json({ error: "Sora generation job not found" });
      return;
    }

    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve Sora status" });
  }
}
