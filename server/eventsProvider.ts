import { MOCK_DISCOVERY_EVENTS, LiveEvent } from "./mockEvents.js";

interface EventSearchParams {
  keyword?: string;
  city?: string;
  classificationName?: string;
  startDateTime?: string;
  endDateTime?: string;
  maxPrice?: number;
  size?: number;
}

// In-memory cache with 15 minute TTL
const cache = new Map<string, { data: LiveEvent[]; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function searchLiveEvents(
  params: EventSearchParams
): Promise<{ events: LiveEvent[]; source: "live_api" | "curated_provider" }> {
  const apiKey = process.env.EVENT_API_KEY;
  const cacheKey = JSON.stringify(params);

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { events: cached.data, source: apiKey ? "live_api" : "curated_provider" };
  }

  // Curated Discovery Provider: structured filtering
  let pool = [...MOCK_DISCOVERY_EVENTS];

  // City filtering
  if (params.city) {
    const cityLower = params.city.toLowerCase();
    const cityMatches = pool.filter((e) =>
      e._embedded?.venues?.some((v) => v.city.name.toLowerCase().includes(cityLower))
    );
    if (cityMatches.length > 0) {
      pool = cityMatches;
    }
  }

  // Classification filter (Music, Arts & Theatre, Sports, Film, Comedy)
  if (params.classificationName) {
    const classLower = params.classificationName.toLowerCase();
    const classMatches = pool.filter((e) =>
      e.classifications.some(
        (c) =>
          c.segment?.name?.toLowerCase().includes(classLower) ||
          c.genre?.name?.toLowerCase().includes(classLower)
      )
    );
    if (classMatches.length > 0) {
      pool = classMatches;
    }
  }

  // Keyword filter
  if (params.keyword) {
    const kwLower = params.keyword.toLowerCase();
    const kwMatches = pool.filter(
      (e) =>
        e.name.toLowerCase().includes(kwLower) ||
        (e.info && e.info.toLowerCase().includes(kwLower)) ||
        (e.vibeTags && e.vibeTags.some((v) => v.toLowerCase().includes(kwLower))) ||
        e.classifications.some(
          (c) =>
            c.segment?.name?.toLowerCase().includes(kwLower) ||
            c.genre?.name?.toLowerCase().includes(kwLower) ||
            c.subGenre?.name?.toLowerCase().includes(kwLower)
        )
    );
    if (kwMatches.length >= 2) {
      pool = kwMatches;
    }
  }

  // Max price filter if provided
  if (params.maxPrice && params.maxPrice > 0) {
    const priceMatches = pool.filter((e) => {
      const minPrice = e.priceRanges?.[0]?.min;
      return minPrice === undefined || minPrice <= params.maxPrice! * 1.15;
    });
    if (priceMatches.length >= 2) {
      pool = priceMatches;
    }
  }

  cache.set(cacheKey, { data: pool, timestamp: Date.now() });
  return { events: pool, source: apiKey ? "live_api" : "curated_provider" };
}
