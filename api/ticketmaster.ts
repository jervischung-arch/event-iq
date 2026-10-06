import { Request, Response } from "express";

export interface TicketmasterSearchParams {
  keyword?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  postalCode?: string;
  latlong?: string;
  radius?: number;
  unit?: "miles" | "km";
  classificationName?: string;
  classificationId?: string;
  startDateTime?: string;
  endDateTime?: string;
  size?: number;
  page?: number;
  sort?: string;
}

export interface TicketmasterApiResponse<T = any> {
  _embedded?: T;
  _links?: Record<string, any>;
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

const TM_DISCOVERY_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

/**
 * Retrieves the Ticketmaster API key from environment variables.
 * Never hardcode API keys in source files.
 */
export function getTicketmasterApiKey(): string | null {
  const key = process.env.TICKETMASTER_API_KEY;
  return key && key.trim() !== "" ? key.trim() : null;
}

/**
 * Searches events using the Ticketmaster Discovery API v2.
 * Endpoint: /discovery/v2/events.json
 */
export async function searchTicketmasterEvents(
  params: TicketmasterSearchParams
): Promise<TicketmasterApiResponse> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    throw new Error(
      "TICKETMASTER_API_KEY is not configured. Please provide it in your environment variables."
    );
  }

  const url = new URL(`${TM_DISCOVERY_BASE_URL}/events.json`);
  url.searchParams.set("apikey", apiKey);

  if (params.keyword) url.searchParams.set("keyword", params.keyword);
  if (params.city) url.searchParams.set("city", params.city);
  if (params.stateCode) url.searchParams.set("stateCode", params.stateCode);
  if (params.countryCode) url.searchParams.set("countryCode", params.countryCode);
  if (params.postalCode) url.searchParams.set("postalCode", params.postalCode);
  if (params.latlong) url.searchParams.set("latlong", params.latlong);
  if (params.radius) url.searchParams.set("radius", String(params.radius));
  if (params.unit) url.searchParams.set("unit", params.unit);
  if (params.classificationName) url.searchParams.set("classificationName", params.classificationName);
  if (params.classificationId) url.searchParams.set("classificationId", params.classificationId);
  if (params.startDateTime) url.searchParams.set("startDateTime", params.startDateTime);
  if (params.endDateTime) url.searchParams.set("endDateTime", params.endDateTime);
  if (params.size) url.searchParams.set("size", String(params.size));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.sort) url.searchParams.set("sort", params.sort);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "EventIQ-Discovery-Client/2.0",
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Ticketmaster API request failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Retrieves details for a specific event by ID.
 * Endpoint: /discovery/v2/events/{id}.json
 */
export async function getTicketmasterEventById(eventId: string): Promise<any> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    throw new Error("TICKETMASTER_API_KEY is not configured.");
  }

  const url = new URL(`${TM_DISCOVERY_BASE_URL}/events/${encodeURIComponent(eventId)}.json`);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event ${eventId} (${response.status})`);
  }

  return response.json();
}

/**
 * Retrieves venue details by ID.
 * Endpoint: /discovery/v2/venues/{id}.json
 */
export async function getTicketmasterVenueById(venueId: string): Promise<any> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    throw new Error("TICKETMASTER_API_KEY is not configured.");
  }

  const url = new URL(`${TM_DISCOVERY_BASE_URL}/venues/${encodeURIComponent(venueId)}.json`);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch venue ${venueId} (${response.status})`);
  }

  return response.json();
}

/**
 * Retrieves attraction/artist details by ID.
 * Endpoint: /discovery/v2/attractions/{id}.json
 */
export async function getTicketmasterAttractionById(attractionId: string): Promise<any> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    throw new Error("TICKETMASTER_API_KEY is not configured.");
  }

  const url = new URL(`${TM_DISCOVERY_BASE_URL}/attractions/${encodeURIComponent(attractionId)}.json`);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch attraction ${attractionId} (${response.status})`);
  }

  return response.json();
}

// Express Route Handlers
export async function searchEventsHandler(req: Request, res: Response): Promise<void> {
  try {
    const params: TicketmasterSearchParams = {
      keyword: req.query.keyword as string | undefined,
      city: req.query.city as string | undefined,
      stateCode: req.query.stateCode as string | undefined,
      countryCode: req.query.countryCode as string | undefined,
      postalCode: req.query.postalCode as string | undefined,
      classificationName: req.query.classificationName as string | undefined,
      startDateTime: req.query.startDateTime as string | undefined,
      endDateTime: req.query.endDateTime as string | undefined,
      size: req.query.size ? parseInt(req.query.size as string, 10) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      sort: req.query.sort as string | undefined,
    };

    const results = await searchTicketmasterEvents(params);
    res.status(200).json(results);
  } catch (error: any) {
    const status = error.message.includes("not configured") ? 503 : 500;
    res.status(status).json({
      error: error.message || "Failed to search Ticketmaster events",
      hint: "Set TICKETMASTER_API_KEY in your environment to enable live Discovery API calls.",
    });
  }
}

export async function getEventDetailsHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await getTicketmasterEventById(id);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve event" });
  }
}
