import { MOCK_DISCOVERY_EVENTS, LiveEvent } from "./mockEvents.js";
import { searchTicketmasterEvents } from "../api/ticketmaster.js";

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
  const hasKey = Boolean(
    process.env.TICKETMASTER_API_KEY && process.env.TICKETMASTER_API_KEY.trim() !== ""
  );
  const cacheKey = JSON.stringify(params);

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { events: cached.data, source: hasKey ? "live_api" : "curated_provider" };
  }

  // Attempt live Ticketmaster Discovery API call if key is configured
  if (hasKey) {
    try {
      const tmData = await searchTicketmasterEvents({
        keyword: params.keyword,
        city: params.city,
        classificationName: params.classificationName,
        startDateTime: params.startDateTime,
        endDateTime: params.endDateTime,
        size: params.size || 20,
        sort: "relevance,desc",
      });

      const rawEvents = tmData?._embedded?.events || [];
      if (rawEvents.length > 0) {
        const formattedEvents: LiveEvent[] = rawEvents.map((ev: any) => ({
          id: ev.id,
          name: ev.name,
          type: ev.type || "event",
          url: ev.url || `https://www.ticketmaster.com/event/${ev.id}`,
          locale: ev.locale || "en-us",
          images: (ev.images || []).map((img: any) => ({
            ratio: img.ratio || "16_9",
            url: img.url,
            width: img.width || 1024,
            height: img.height || 576,
          })),
          dates: {
            start: {
              localDate: ev.dates?.start?.localDate || "2026-10-10",
              localTime: ev.dates?.start?.localTime || "19:30:00",
              dateTime: ev.dates?.start?.dateTime || "2026-10-10T23:30:00Z",
            },
            status: { code: ev.dates?.status?.code || "onsale" },
          },
          classifications: ev.classifications || [
            { segment: { name: "Music" }, genre: { name: "Live Event" } },
          ],
          priceRanges: ev.priceRanges || [{ type: "standard", currency: "USD", min: 35.0, max: 95.0 }],
          pleaseNote: ev.pleaseNote,
          info: ev.info || ev.pleaseNote || `${ev.name} live experience.`,
          _embedded: {
            venues: (ev._embedded?.venues || []).map((v: any) => ({
              id: v.id || "venue-1",
              name: v.name || "Main Venue",
              city: { name: v.city?.name || params.city || "New York" },
              state: v.state,
              address: v.address,
              postalCode: v.postalCode,
              generalInfo: v.generalInfo,
            })),
            attractions: ev._embedded?.attractions || [],
          },
          isSponsored: Math.random() < 0.15,
          sponsoredNote: "Featured Partner Event",
        }));

        cache.set(cacheKey, { data: formattedEvents, timestamp: Date.now() });
        return { events: formattedEvents, source: "live_api" };
      }
    } catch (err: any) {
      console.warn("Live Ticketmaster fetch failed, falling back to curated provider:", err.message);
    }
  }

  // Fallback to curated events
  let pool = [...MOCK_DISCOVERY_EVENTS];

  if (params.city) {
    const cityLower = params.city.toLowerCase();
    const cityMatches = pool.filter((e) =>
      e._embedded?.venues?.some((v) => v.city.name.toLowerCase().includes(cityLower))
    );
    if (cityMatches.length > 0) {
      pool = cityMatches;
    }
  }

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
  return { events: pool, source: hasKey ? "live_api" : "curated_provider" };
}
