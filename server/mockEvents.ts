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
  sales?: {
    public?: {
      startDateTime?: string;
      endDateTime?: string;
    };
  };
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
  experienceRating?: number;
}

export const MOCK_DISCOVERY_EVENTS: LiveEvent[] = [
  {
    id: "vvG1zZ4t9x3aBc01",
    name: "Midnight Candlelight Jazz Sessions: Nora Jones Trio",
    type: "event",
    url: "https://tickets.eventiq.ai/events/midnight-candlelight-jazz-new-york",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      },
      {
        ratio: "4_3",
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "20:30:00",
        dateTime: "2026-10-11T00:30:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Jazz" },
        subGenre: { name: "Vocal Jazz" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 45.0, max: 95.0 }],
    pleaseNote: "Intimate cabaret seating. Doors open at 7:30 PM. Warm acoustic set with artisanal cocktail service.",
    info: "An enchanting evening of acoustic standards and soul-stirring ballads in an iconic Greenwich Village venue illuminated by hundreds of candles.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7AAEA",
          name: "Blue Note Jazz Club",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "131 W 3rd St" },
          postalCode: "10012",
          generalInfo: { generalRule: "Intimate table seating. Great acoustic sightlines from all tables." }
        }
      ],
      attractions: [
        {
          id: "K8vZ9171oV7",
          name: "Nora Jones Trio",
          classifications: [{ segment: { name: "Music" }, genre: { name: "Jazz" } }]
        }
      ]
    },
    vibeTags: ["Romantic", "Intimate", "Date Night", "Sophisticated", "Relaxed"]
  },
  {
    id: "vvG1zZ9Q8p1kLn02",
    name: "Comedy Underground: Saturday Night All-Stars Showcase",
    type: "event",
    url: "https://tickets.eventiq.ai/events/comedy-underground-allstars-new-york",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      },
      {
        ratio: "4_3",
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "21:15:00",
        dateTime: "2026-10-11T01:15:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Comedy" },
        subGenre: { name: "Standup" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 32.0, max: 55.0 }],
    pleaseNote: "Ages 21+. Two item minimum. Features top nationally touring headliners and surprise celebrity drop-ins.",
    info: "Fast-paced, laugh-until-you-cry showcase featuring 5 top headliners.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Av1A",
          name: "Gotham Comedy Club",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "208 W 23rd St" },
          postalCode: "10011",
          generalInfo: { generalRule: "Classic red-curtain comedy club with warm ambiance and cocktail service." }
        }
      ],
      attractions: [
        {
          id: "K8vZ9174kPf",
          name: "Gotham All-Stars",
          classifications: [{ segment: { name: "Arts & Theatre" }, genre: { name: "Comedy" } }]
        }
      ]
    },
    vibeTags: ["Fun", "High Energy", "Date Night", "Lively", "Laugh Out Loud"]
  },
  {
    id: "vvG1zZ7Mm3qW03",
    name: "Secret Rooftop Sunset Cinema & Wine Pairing",
    type: "event",
    url: "https://tickets.eventiq.ai/events/rooftop-cinema-sunset-soho",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "18:45:00",
        dateTime: "2026-10-10T22:45:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Film" },
        genre: { name: "Outdoor Experience" },
        subGenre: { name: "Classic & Modern" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 42.0, max: 78.0 }],
    pleaseNote: "Includes deck chair, warm fleece blanket, wireless personal headphones, and complimentary welcome glass of prosecco.",
    info: "Watch critically acclaimed romance and adventure films against the illuminated Manhattan skyline with artisanal charcuterie boxes available.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Aoo2",
          name: "Skyline Terrace at Soho Loft",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "485 Broadway" },
          postalCode: "10013",
          generalInfo: { generalRule: "Panoramic 360-degree views of Manhattan. Weather covered pavilion available if light rain." }
        }
      ]
    },
    vibeTags: ["Romantic", "Memorable", "Adventurous", "Scenic", "Unique Experience"]
  },
  {
    id: "vvG1zZ1P7y8K04",
    name: "Cirque Nouveau: Celestial Dreamscapes",
    type: "event",
    url: "https://tickets.eventiq.ai/events/cirque-nouveau-celestial-dreamscapes",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-11",
        localTime: "14:00:00",
        dateTime: "2026-10-11T18:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Circus" },
        subGenre: { name: "Acrobatic" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 48.0, max: 125.0 }],
    pleaseNote: "All ages welcome. Stunning visual projection mapping, gravity-defying aerialists, and live orchestral score.",
    info: "A breathtaking family-friendly masterpiece blending modern French circus arts, synchronized trampolines, and cosmic storytelling.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Akk5",
          name: "The Beacon Theatre",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "2124 Broadway" },
          postalCode: "10023",
          generalInfo: { generalRule: "Grand historic theatre with tiered seating and pristine acoustics." }
        }
      ]
    },
    vibeTags: ["Family", "Memorable", "High Energy", "Visual Spectacle", "All Ages"]
  },
  {
    id: "vvG1zZ5Tx1pQ05",
    name: "Brooklyn Indie Fest: Acoustic Garden Sessions",
    type: "event",
    url: "https://tickets.eventiq.ai/events/brooklyn-indie-garden-sessions",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "17:00:00",
        dateTime: "2026-10-10T21:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Indie Rock" },
        subGenre: { name: "Folk/Singer-Songwriter" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 35.0, max: 65.0 }],
    pleaseNote: "Craft food trucks, natural wine garden, artisan stalls, and two intimate acoustic stages.",
    info: "Vibrant indie festival in an open-air courtyard showcasing emerging folk-rock acts, vinyl DJs, and craft culinary creators.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7App9",
          name: "Brooklyn Steel Outdoor Courtyard",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "319 Frost St" },
          postalCode: "11222",
          generalInfo: { generalRule: "Spacious industrial chic outdoor garden." }
        }
      ]
    },
    vibeTags: ["Chill", "Friends Outing", "Fun", "Outdoor", "Music Lovers", "Casual"]
  },
  {
    id: "vvG1zZ8Mm9sT06",
    name: "New York City FC vs. LA Galaxy: Eastern Showcase",
    type: "event",
    url: "https://tickets.eventiq.ai/events/nycfc-vs-la-galaxy-soccer-showdown",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "19:00:00",
        dateTime: "2026-10-10T23:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Sports" },
        genre: { name: "Soccer" },
        subGenre: { name: "MLS" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 38.0, max: 145.0 }],
    pleaseNote: "Family section and supporters section available. Pre-match fan fest with interactive games starts 2 hours prior.",
    info: "Electric soccer clash under stadium lights featuring international stars and high-tempo rivalry soccer action.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Az81",
          name: "Yankee Stadium",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "1 E 161st St" },
          postalCode: "10451",
          generalInfo: { generalRule: "Historic venue with extensive food concession stands and subway connection." }
        }
      ]
    },
    vibeTags: ["Sports", "High Energy", "Family", "Friends", "Lively", "Electric"]
  },
  {
    id: "vvG1zZ2Nn4kL07",
    name: "Illuminated Bach: Classical Strings by Candlelight",
    type: "event",
    url: "https://tickets.eventiq.ai/events/illuminated-bach-classical-strings",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "19:30:00",
        dateTime: "2026-10-10T23:30:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Classical" },
        subGenre: { name: "Symphonic" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 40.0, max: 88.0 }],
    pleaseNote: "Historic church sanctuary adorned with over 2,000 flickering flameless candles.",
    info: "Experience timeless masterworks performed by an award-winning string quartet inside a gothic revival sanctuary with celestial acoustics.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Atu3",
          name: "The Church of the Heavenly Rest",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "1085 5th Ave" },
          postalCode: "10128",
          generalInfo: { generalRule: "Serene architectural marvel facing Central Park." }
        }
      ]
    },
    vibeTags: ["Romantic", "Intimate", "Peaceful", "Date Night", "Memorable", "Refined"]
  },
  {
    id: "vvG1zZ6Kk8vM08",
    name: "Immersive Van Gogh & Digital Masters: Nocturne Lounge",
    type: "event",
    url: "https://tickets.eventiq.ai/events/immersive-van-gogh-nocturne-lounge",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "20:00:00",
        dateTime: "2026-10-11T00:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Fine Art" },
        subGenre: { name: "Immersive Exhibition" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 39.0, max: 75.0 }],
    pleaseNote: "Evening session includes ambient electronic soundscapes and specialty themed cocktail bar.",
    info: "Step inside 500,000 cubic feet of animated projections where brushstrokes swirl across 30-foot walls, synchronized to cinematic music.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Amk1",
          name: "Pier 36 NYC Cultural Pavilion",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "299 South St" },
          postalCode: "10002",
          generalInfo: { generalRule: "Expansive waterfront venue with lounge seating and photo spaces." }
        }
      ]
    },
    isSponsored: true,
    sponsoredNote: "Official Cultural Arts Partner — Verified Experience",
    vibeTags: ["Adventurous", "Memorable", "Date Night", "Visual Spectacle", "Art & Design"]
  },
  {
    id: "vvG1zZ3Jj7bN09",
    name: "Broadway Under the Stars: Cabaret & Dinner Show",
    type: "event",
    url: "https://tickets.eventiq.ai/events/broadway-under-the-stars-cabaret",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "19:00:00",
        dateTime: "2026-10-10T23:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Theatre" },
        subGenre: { name: "Musical/Cabaret" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 65.0, max: 135.0 }],
    pleaseNote: "Three-course prix fixe dinner available with package. Show features Tony Award-winning vocalists.",
    info: "An intoxicating night of Broadway anthems, witty banter, and powerhouse showtunes in a legendary supper club setting.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Aj99",
          name: "Feinstein's / 54 Below",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "254 W 54th St" },
          postalCode: "10019",
          generalInfo: { generalRule: "Broadway's living room. Cozy banquette and table seating." }
        }
      ]
    },
    vibeTags: ["Romantic", "Broadway", "Celebration", "Intimate", "Date Night", "Music"]
  },
  {
    id: "vvG1zZ0Pp5mX10",
    name: "Secret Speakeasy Magic: Parlour of Illusions",
    type: "event",
    url: "https://tickets.eventiq.ai/events/speakeasy-magic-parlour-illusions",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "21:00:00",
        dateTime: "2026-10-11T01:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Magic" },
        subGenre: { name: "Close-up Magic" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 55.0, max: 95.0 }],
    pleaseNote: "Strictly limited to 45 guests per show. Password sent via SMS 2 hours prior to curtain.",
    info: "Hidden behind a faux bookstore doorway, experience world-class close-up sleight of hand, mentalism, and craft cocktails.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7Amg7",
          name: "The McKittrick Hotel Parlour",
          city: { name: "New York" },
          state: { name: "New York", stateCode: "NY" },
          address: { line1: "530 W 27th St" },
          postalCode: "10001",
          generalInfo: { generalRule: "Immersive vintage decor. 21+ only." }
        }
      ]
    },
    vibeTags: ["Adventurous", "Memorable", "Unique Experience", "Date Night", "Intimate"]
  },
  {
    id: "vvG1zZ7La1bC11",
    name: "Sunset Acoustic Sessions at Griffith Observatory Lawn",
    type: "event",
    url: "https://tickets.eventiq.ai/events/sunset-acoustic-los-angeles",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "17:30:00",
        dateTime: "2026-10-10T21:30:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Acoustic" },
        subGenre: { name: "Indie Pop" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 35.0, max: 65.0 }],
    info: "Open-air golden hour concert overlooking the Los Angeles basin with food trucks and astronomy viewings after dark.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7ALa1",
          name: "The Greek Theatre Plaza",
          city: { name: "Los Angeles" },
          state: { name: "California", stateCode: "CA" },
          address: { line1: "2700 N Vermont Ave" },
          postalCode: "90027"
        }
      ]
    },
    vibeTags: ["Romantic", "Outdoor", "Date Night", "Scenic", "Relaxed"]
  },
  {
    id: "vvG1zZ8Chi1k12",
    name: "Second City Mainstage: Best of Chicago Improv",
    type: "event",
    url: "https://tickets.eventiq.ai/events/second-city-chicago-saturday-improv",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "20:00:00",
        dateTime: "2026-10-11T01:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Arts & Theatre" },
        genre: { name: "Comedy" },
        subGenre: { name: "Improvisation" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 34.0, max: 60.0 }],
    info: "The legendary comedy institution in a razor-sharp Saturday sketch revue.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7AChi",
          name: "The Second City Mainstage",
          city: { name: "Chicago" },
          state: { name: "Illinois", stateCode: "IL" },
          address: { line1: "1616 N Wells St" },
          postalCode: "60614"
        }
      ]
    },
    vibeTags: ["Comedy", "Fun", "Date Night", "Lively", "Laugh Out Loud", "High Energy"]
  },
  {
    id: "vvG1zZ9Aus1m13",
    name: "Austin Blues & BBQ Twilight Jam",
    type: "event",
    url: "https://tickets.eventiq.ai/events/austin-blues-bbq-twilight-jam",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: "2026-10-10",
        localTime: "18:00:00",
        dateTime: "2026-10-10T23:00:00Z"
      },
      status: { code: "onsale" }
    },
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Blues" },
        subGenre: { name: "Texas Blues" }
      }
    ],
    priceRanges: [{ type: "standard", currency: "USD", min: 28.0, max: 55.0 }],
    info: "Smoked Texas brisket, cold craft brews, and blazing electric blues guitar underneath sprawling oak trees.",
    _embedded: {
      venues: [
        {
          id: "KovZpZA7AAus",
          name: "Antone's Nightclub Garden",
          city: { name: "Austin" },
          state: { name: "Texas", stateCode: "TX" },
          address: { line1: "305 E 5th St" },
          postalCode: "78701"
        }
      ]
    },
    vibeTags: ["Food & Drinks", "Music", "Casual", "Lively", "Friends Outing", "Soulful"]
  }
];
