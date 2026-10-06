export interface EventVenue {
  id: string;
  name: string;
  city: { name: string };
  state?: { name: string; stateCode: string };
  address?: { line1: string };
  postalCode?: string;
  location?: { longitude: string; latitude: string };
  boxOfficeInfo?: { openHoursDetail?: string; acceptedPaymentDetail?: string };
  generalInfo?: { generalRule?: string; childRule?: string };
}

export interface EventAttraction {
  id: string;
  name: string;
  classifications?: Array<{
    segment?: { name: string };
    genre?: { name: string };
    subGenre?: { name: string };
  }>;
}

export interface EventPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface EventImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback?: boolean;
}

export interface LiveEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  locale?: string;
  images: EventImage[];
  dates: {
    start: {
      localDate: string;
      localTime?: string;
      dateTime?: string;
    };
    status: {
      code: string;
    };
  };
  classifications: Array<{
    segment?: { id?: string; name: string };
    genre?: { id?: string; name: string };
    subGenre?: { id?: string; name: string };
  }>;
  priceRanges?: EventPriceRange[];
  pleaseNote?: string;
  info?: string;
  _embedded?: {
    venues?: EventVenue[];
    attractions?: EventAttraction[];
  };
  isSponsored?: boolean;
  sponsoredNote?: string;
  vibeTags?: string[];
}

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
  atmospherePros?: string[];
  idealCompanion?: string;
}

export interface SystemStatus {
  status: string;
  app: string;
  version: string;
  geminiConfigured: boolean;
  providerMode: "live_api" | "curated_provider";
  tagline: string;
}
