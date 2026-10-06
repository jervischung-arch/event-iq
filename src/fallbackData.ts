import { UserIntent, RankedEventRecommendation } from "./types";

export const DEFAULT_FALLBACK_INTENT: UserIntent = {
  occasion: "Date Night",
  vibes: ["Romantic", "Intimate", "Fun"],
  maxBudgetPerPerson: 100,
  timeframe: "This Saturday Evening",
  location: "New York",
  categoryPreference: ["Music", "Arts & Theatre", "Comedy"],
  keywords: ["jazz", "candlelight", "cocktails"],
  summary: "A tailored date night experience with live music, great ambiance, and craft drinks.",
  userPrompt: "I want a fun date this Saturday under $100.",
};

export const DEFAULT_FALLBACK_RECOMMENDATIONS: RankedEventRecommendation[] = [
  {
    event: {
      id: "vvG1zZ4t9x3aBc01",
      name: "Midnight Candlelight Jazz Sessions: Nora Jones Trio",
      type: "event",
      url: "https://tickets.eventiq.ai/events/midnight-candlelight-jazz-new-york",
      images: [
        {
          ratio: "16_9",
          url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 675,
        },
      ],
      dates: {
        start: {
          localDate: "2026-10-10",
          localTime: "20:30:00",
        },
        status: { code: "onsale" },
      },
      classifications: [
        {
          segment: { name: "Music" },
          genre: { name: "Jazz" },
        },
      ],
      priceRanges: [{ type: "standard", currency: "USD", min: 45, max: 95 }],
      _embedded: {
        venues: [
          {
            id: "KovZpZA7AAEA",
            name: "Blue Note Jazz Club",
            city: { name: "New York" },
            address: { line1: "131 W 3rd St" },
          },
        ],
      },
      vibeTags: ["Romantic", "Intimate", "Date Night", "Sophisticated"],
    },
    matchScore: 97,
    rank: 1,
    whyWeRecommendIt:
      "Blue Note delivers quintessential New York romance with hundreds of candles illuminating an intimate jazz showcase that feels both classy and effortless. At $45 to $95, it comfortably meets your budget while providing an engaging, high-chemistry setting for an unforgettable Saturday night.",
    experienceHighlights: [
      "🕯️ Intimate candlelit table seating",
      "🎷 Iconic Greenwich Village acoustics",
      "💰 Prime ticket tiers under $100 budget",
    ],
    recommendedArrival: "Arrive 45 minutes prior to secure prime table placement and cocktails",
    idealCompanion: "Romantic date or partner",
  },
  {
    event: {
      id: "vvG1zZ9Q8p1kLn02",
      name: "Comedy Underground: Saturday Night All-Stars Showcase",
      type: "event",
      url: "https://tickets.eventiq.ai/events/comedy-underground-allstars-new-york",
      images: [
        {
          ratio: "16_9",
          url: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 675,
        },
      ],
      dates: {
        start: {
          localDate: "2026-10-10",
          localTime: "21:15:00",
        },
        status: { code: "onsale" },
      },
      classifications: [
        {
          segment: { name: "Arts & Theatre" },
          genre: { name: "Comedy" },
        },
      ],
      priceRanges: [{ type: "standard", currency: "USD", min: 32, max: 55 }],
      _embedded: {
        venues: [
          {
            id: "KovZpZA7Av1A",
            name: "Gotham Comedy Club",
            city: { name: "New York" },
            address: { line1: "208 W 23rd St" },
          },
        ],
      },
      vibeTags: ["Fun", "High Energy", "Date Night", "Lively"],
    },
    matchScore: 93,
    rank: 2,
    whyWeRecommendIt:
      "A fast-paced comedy showcase guarantees non-stop laughter and breaks the ice seamlessly. Priced from $32 to $55, it leaves plenty of room in your $100 budget for dinner or craft drinks nearby in Chelsea.",
    experienceHighlights: [
      "😂 5 top nationally touring headliners",
      "🍷 Classic red-curtain cocktail lounge vibe",
      "💸 Excellent value well under $100",
    ],
    recommendedArrival: "Arrive 30 minutes before showtime for table seating",
    idealCompanion: "Fun date or group of friends",
  },
  {
    event: {
      id: "vvG1zZ7Mm3qW03",
      name: "Secret Rooftop Sunset Cinema & Wine Pairing",
      type: "event",
      url: "https://tickets.eventiq.ai/events/rooftop-cinema-sunset-soho",
      images: [
        {
          ratio: "16_9",
          url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 675,
        },
      ],
      dates: {
        start: {
          localDate: "2026-10-10",
          localTime: "18:45:00",
        },
        status: { code: "onsale" },
      },
      classifications: [
        {
          segment: { name: "Film" },
          genre: { name: "Outdoor Experience" },
        },
      ],
      priceRanges: [{ type: "standard", currency: "USD", min: 42, max: 78 }],
      _embedded: {
        venues: [
          {
            id: "KovZpZA7Aoo2",
            name: "Skyline Terrace at Soho Loft",
            city: { name: "New York" },
            address: { line1: "485 Broadway" },
          },
        ],
      },
      vibeTags: ["Romantic", "Memorable", "Scenic", "Unique"],
    },
    matchScore: 89,
    rank: 3,
    whyWeRecommendIt:
      "Watching an acclaimed film against the illuminated Manhattan skyline wrapped in warm fleece blankets with personal headphones is an unforgettable romantic evening. Deck chair seating and welcome prosecco make this a standout $42 to $78 experience.",
    experienceHighlights: [
      "🏙️ 360-degree panoramic skyline views",
      "🥂 Includes welcome glass of prosecco",
      "🎧 Wireless personal audio headphones",
    ],
    recommendedArrival: "Arrive at 6:15 PM for golden hour photos before the screening",
    idealCompanion: "Romantic date",
  },
];
