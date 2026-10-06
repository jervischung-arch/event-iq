import { ai, GEMINI_MODEL } from "./gemini.js";
import { searchLiveEvents } from "./eventsProvider.js";
import { LiveEvent } from "./mockEvents.js";
import { Type } from "@google/genai";

export interface UserIntent {
  occasion: string;
  vibes: string[];
  maxBudgetPerPerson: number | null;
  timeframe: string;
  targetDate?: string;
  location: string;
  categoryPreference: string[];
  keywords: string[];
  summary: string;
  userPrompt: string;
}

export interface RankedEventRecommendation {
  event: LiveEvent;
  matchScore: number;
  rank: number;
  whyWeRecommendIt: string;
  experienceHighlights: string[];
  recommendedArrival?: string;
  atmospherePros: string[];
  idealCompanion: string;
}

export interface RefinementHistoryItem {
  role: "user" | "concierge";
  content: string;
}

// 1. Extract intent from natural language prompt
export async function extractIntent(prompt: string, currentLocation?: string): Promise<UserIntent> {
  const fallbackLocation = currentLocation || "New York";

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `You are the intent parsing engine for EventIQ, an elite AI event concierge using real-time event discovery.
The user described their desired experience: "${prompt}".
Analyze the prompt and extract the structured intent into JSON.
Default location to "${fallbackLocation}" if no city is explicitly mentioned or implied.
Current year is 2026. If they say "this Saturday", calculate roughly for the upcoming weekend.
Return valid JSON adhering to the specified schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            occasion: {
              type: Type.STRING,
              description: "E.g. Date night, Family outing, Friends night out, Solo exploration, Celebration, Casual",
            },
            vibes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Vibe adjectives, e.g. Romantic, Adventurous, Relaxed, Lively, Intimate, Memorable, Sophisticated",
            },
            maxBudgetPerPerson: {
              type: Type.NUMBER,
              description: "Maximum budget per ticket/person in USD. If unstated, use 120 as reasonable default.",
            },
            timeframe: {
              type: Type.STRING,
              description: "E.g. This Saturday Evening, Weekend Matinee, Tonight, Next Friday",
            },
            location: {
              type: Type.STRING,
              description: "City name, e.g. New York, Los Angeles, Chicago, Austin, San Francisco",
            },
            categoryPreference: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Event classification segments, e.g. Music, Arts & Theatre, Comedy, Sports, Film",
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key search concepts like jazz, comedy, dinner, rooftop, acoustic",
            },
            summary: {
              type: Type.STRING,
              description: "A 1-sentence poetic summary of what the user is looking for.",
            },
          },
          required: ["occasion", "vibes", "timeframe", "location", "categoryPreference", "keywords", "summary"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      occasion: parsed.occasion || "Event Experience",
      vibes: parsed.vibes && parsed.vibes.length > 0 ? parsed.vibes : ["Fun", "Memorable"],
      maxBudgetPerPerson: parsed.maxBudgetPerPerson || null,
      timeframe: parsed.timeframe || "This Weekend",
      targetDate: parsed.targetDate,
      location: parsed.location || fallbackLocation,
      categoryPreference: parsed.categoryPreference || ["Music", "Arts & Theatre"],
      keywords: parsed.keywords || ["live event"],
      summary: parsed.summary || `Looking for an unforgettable experience in ${parsed.location || fallbackLocation}.`,
      userPrompt: prompt,
    };
  } catch (err) {
    console.error("Gemini intent extraction fallback:", err);
    // Intelligent heuristic fallback
    const lower = prompt.toLowerCase();
    let occasion = "Casual Outing";
    if (lower.includes("date") || lower.includes("romantic") || lower.includes("partner") || lower.includes("girlfriend") || lower.includes("boyfriend")) {
      occasion = "Date Night";
    } else if (lower.includes("family") || lower.includes("kids") || lower.includes("children")) {
      occasion = "Family Outing";
    } else if (lower.includes("friends") || lower.includes("group") || lower.includes("crew")) {
      occasion = "Friends Night Out";
    }

    const budgetMatch = prompt.match(/\$?(\d+)/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : 100;

    return {
      occasion,
      vibes: ["Fun", "Engaging", "Memorable"],
      maxBudgetPerPerson: maxBudget,
      timeframe: "This Saturday Evening",
      location: fallbackLocation,
      categoryPreference: ["Music", "Arts & Theatre", "Comedy"],
      keywords: ["entertainment"],
      summary: `A tailored ${occasion.toLowerCase()} experience in ${fallbackLocation} under $${maxBudget}.`,
      userPrompt: prompt,
    };
  }
}

// 2. Refine existing intent with conversational follow-up
export async function refineIntent(
  previousIntent: UserIntent,
  refinementPrompt: string
): Promise<UserIntent> {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `You are the conversational refinement agent for EventIQ.
Previous user intent was:
${JSON.stringify(previousIntent, null, 2)}

User just submitted this refinement follow-up:
"${refinementPrompt}"

Rules:
1. Preserve all previous preferences EXCEPT the specific dimension(s) modified by the user's prompt.
2. For example, if they say "something cheaper", lower the maxBudgetPerPerson (e.g. reduce by 30-40% or cap below $50) while keeping location, occasion, and timeframe identical.
3. If they say "more adventurous", inject adventurous/unique vibes and categories (e.g. immersive art, outdoor rooftop, mystery magic).
4. If they say "closer to Brooklyn", update location.
5. If they say "make it a comedy show instead", update categoryPreference and keywords.
6. Provide an updated summary reflecting the refined request.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            occasion: { type: Type.STRING },
            vibes: { type: Type.ARRAY, items: { type: Type.STRING } },
            maxBudgetPerPerson: { type: Type.NUMBER },
            timeframe: { type: Type.STRING },
            location: { type: Type.STRING },
            categoryPreference: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ["occasion", "vibes", "timeframe", "location", "categoryPreference", "keywords", "summary"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      occasion: parsed.occasion || previousIntent.occasion,
      vibes: parsed.vibes || previousIntent.vibes,
      maxBudgetPerPerson: parsed.maxBudgetPerPerson ?? previousIntent.maxBudgetPerPerson,
      timeframe: parsed.timeframe || previousIntent.timeframe,
      targetDate: parsed.targetDate || previousIntent.targetDate,
      location: parsed.location || previousIntent.location,
      categoryPreference: parsed.categoryPreference || previousIntent.categoryPreference,
      keywords: parsed.keywords || previousIntent.keywords,
      summary: parsed.summary || previousIntent.summary,
      userPrompt: `${previousIntent.userPrompt} → ${refinementPrompt}`,
    };
  } catch (err) {
    console.error("Refine intent error:", err);
    return {
      ...previousIntent,
      userPrompt: `${previousIntent.userPrompt} (${refinementPrompt})`,
    };
  }
}

// 3. RAG hybrid retrieval and Gemini ranking + grounded explanation
export async function rankAndExplainEvents(
  intent: UserIntent
): Promise<{
  recommendations: RankedEventRecommendation[];
  retrievalSource: "live_api" | "curated_provider";
}> {
  // Step A: Structured Discovery retrieval
  const primaryCategory = intent.categoryPreference?.[0] || undefined;
  const primaryKeyword = intent.keywords?.[0] || undefined;

  const { events: candidateEvents, source } = await searchLiveEvents({
    city: intent.location,
    classificationName: primaryCategory,
    keyword: primaryKeyword,
    maxPrice: intent.maxBudgetPerPerson || undefined,
    size: 15,
  });

  if (!candidateEvents || candidateEvents.length === 0) {
    return { recommendations: [], retrievalSource: source };
  }

  // Step B: RAG context preparation
  const candidatesSummary = candidateEvents.slice(0, 10).map((ev, index) => {
    const venue = ev._embedded?.venues?.[0];
    const minP = ev.priceRanges?.[0]?.min;
    const maxP = ev.priceRanges?.[0]?.max;
    const priceStr = minP ? `$${minP} - $${maxP || minP}` : "Price upon request";
    return {
      candidateIndex: index,
      id: ev.id,
      name: ev.name,
      classification: ev.classifications?.map((c) => `${c.segment?.name || ""}: ${c.genre?.name || ""}`).join(", "),
      date: ev.dates.start.localDate,
      time: ev.dates.start.localTime || "Evening",
      venueName: venue?.name || "Premier Venue",
      city: venue?.city?.name || intent.location,
      priceRange: priceStr,
      info: ev.info || ev.pleaseNote || "Live event",
      vibeTags: ev.vibeTags || [],
      isSponsored: !!ev.isSponsored,
      sponsoredNote: ev.sponsoredNote || null,
    };
  });

  // Step C: Gemini RAG Ranking & Grounded Explanation
  try {
    const prompt = `You are EventIQ, the intelligent AI event concierge.
Core mission: "Traditional search tells you what is happening. EventIQ tells you what you should do."

User's Experience Intent:
- Occasion: ${intent.occasion}
- Desired Vibes: ${intent.vibes.join(", ")}
- Budget limit: ${intent.maxBudgetPerPerson ? `$${intent.maxBudgetPerPerson}` : "Flexible"}
- Timeframe: ${intent.timeframe}
- Location: ${intent.location}
- User's Original Words: "${intent.userPrompt}"

Retrieved Live Event Candidates (FACTUAL GROUND TRUTH - DO NOT INVENT DATES, VENUES, OR PRICES):
${JSON.stringify(candidatesSummary, null, 2)}

Instructions:
1. Select the 3 to 5 best events that best fulfill the user's desired experience, atmosphere, and budget.
2. Calculate an EventIQ Match Score (between 82 and 98%) reflecting true relevance.
3. For "whyWeRecommendIt", provide an evocative, personalized 2-3 sentence explanation connecting the event's real attributes (atmosphere, seating, acoustics, lighting, timing, budget) directly to the user's requested vibe. Explain WHY they should choose this experience.
4. If an event is marked isSponsored=true, rank it ONLY if genuinely relevant to the user's intent. Never artificially rank an irrelevant sponsored event high.
5. Provide 3 sharp experienceHighlights tags (e.g. "✨ Candlelight table seating", "🍷 Craft cocktail service", "💰 Within $100 budget target").
6. Provide recommended arrival timing and ideal companionship fit.

Output strictly valid JSON.`;

    const rankingResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankedList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  candidateIndex: { type: Type.INTEGER },
                  matchScore: { type: Type.INTEGER },
                  whyWeRecommendIt: { type: Type.STRING },
                  experienceHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recommendedArrival: { type: Type.STRING },
                  atmospherePros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  idealCompanion: { type: Type.STRING },
                },
                required: ["candidateIndex", "matchScore", "whyWeRecommendIt", "experienceHighlights"],
              },
            },
          },
          required: ["rankedList"],
        },
      },
    });

    const parsedRanking = JSON.parse(rankingResponse.text || "{}");
    const rankedItems = parsedRanking.rankedList || [];

    const recommendations: RankedEventRecommendation[] = rankedItems
      .map((item: any, rankIdx: number) => {
        const originalEvent = candidateEvents[item.candidateIndex] || candidateEvents[rankIdx];
        if (!originalEvent) return null;
        return {
          event: originalEvent,
          matchScore: Math.min(99, Math.max(75, item.matchScore || (95 - rankIdx * 3))),
          rank: rankIdx + 1,
          whyWeRecommendIt: item.whyWeRecommendIt || `Specially curated for your ${intent.occasion.toLowerCase()} vibe.`,
          experienceHighlights: item.experienceHighlights || [
            "Handpicked atmosphere",
            "Great sound & seating",
            "Authentic ticket access",
          ],
          recommendedArrival: item.recommendedArrival || "Arrive 30 minutes prior to showtime.",
          atmospherePros: item.atmospherePros || ["Intimate setting", "Great acoustic sightlines"],
          idealCompanion: item.idealCompanion || intent.occasion,
        };
      })
      .filter(Boolean) as RankedEventRecommendation[];

    if (recommendations.length >= 3) {
      return { recommendations, retrievalSource: source };
    }
  } catch (err) {
    console.error("Gemini RAG ranking error, using structured fallback:", err);
  }

  // Fallback ranking if Gemini call failed
  const fallbackRecommendations: RankedEventRecommendation[] = candidateEvents.slice(0, 4).map((ev, idx) => ({
    event: ev,
    matchScore: 96 - idx * 4,
    rank: idx + 1,
    whyWeRecommendIt: `A standout experience for your ${intent.occasion.toLowerCase()}. ${ev.info || ev.pleaseNote || "One of the most highly rated events in the city."}`,
    experienceHighlights: [
      ev.priceRanges?.[0]?.min ? `Starting at $${ev.priceRanges[0].min}` : "Flexible pricing",
      ev._embedded?.venues?.[0]?.name ? `At ${ev._embedded.venues[0].name}` : "Central location",
      "Authentic verified tickets",
    ],
    recommendedArrival: "Arrive 45 minutes prior for optimal seating.",
    atmospherePros: ["Great sightlines", "Lively social ambiance"],
    idealCompanion: intent.occasion,
  }));

  return { recommendations: fallbackRecommendations, retrievalSource: source };
}
