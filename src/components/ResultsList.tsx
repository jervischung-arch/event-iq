import React from "react";
import { RankedEventRecommendation, LiveEvent } from "../types";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  GitCompare,
  Bookmark,
  Check,
  ShieldCheck,
  Award,
  Eye,
  Info,
} from "lucide-react";

interface ResultsListProps {
  recommendations: RankedEventRecommendation[];
  retrievalSource?: "live_api" | "curated_provider";
  onSelectEventDetail: (rec: RankedEventRecommendation) => void;
  onToggleCompare: (event: LiveEvent) => void;
  onToggleSave: (event: LiveEvent) => void;
  compareList: LiveEvent[];
  savedList: LiveEvent[];
}

export const ResultsList: React.FC<ResultsListProps> = ({
  recommendations,
  retrievalSource,
  onSelectEventDetail,
  onToggleCompare,
  onToggleSave,
  compareList,
  savedList,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No matching experiences found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Try broadening your budget, changing the location, or tweaking your requested vibe.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight font-['Outfit']">
              Ranked Experience Recommendations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {recommendations.length} Curated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ranked by AI concierge match score and grounded in verified event data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Event Ground Truth</span>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => {
          const { event, matchScore, whyWeRecommendIt, experienceHighlights } = rec;
          const venue = event._embedded?.venues?.[0];
          const isCompared = compareList.some((e) => e.id === event.id);
          const isSaved = savedList.some((e) => e.id === event.id);
          const primaryImage =
            event.images?.find((img) => img.ratio === "16_9")?.url ||
            event.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

          const category =
            event.classifications?.[0]?.genre?.name ||
            event.classifications?.[0]?.segment?.name ||
            "Entertainment";

          const minPrice = event.priceRanges?.[0]?.min;
          const maxPrice = event.priceRanges?.[0]?.max;
          const priceText = minPrice
            ? `$${Math.round(minPrice)}${maxPrice && maxPrice > minPrice ? ` - $${Math.round(maxPrice)}` : ""}`
            : "Available Online";

          const isTopMatch = index === 0;

          return (
            <div
              key={event.id}
              className={`group relative rounded-3xl overflow-hidden transition-all duration-300 border ${
                isTopMatch
                  ? "bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-rose-500/40 shadow-2xl shadow-rose-950/20"
                  : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700 shadow-xl"
              }`}
            >
              {/* Sponsored Discovery banner if sponsored */}
              {event.isSponsored && (
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-transparent px-5 py-1.5 border-b border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsored Discovery</span>
                    <span className="text-amber-400/80">•</span>
                    <span className="text-slate-400">Relevance algorithm remains 100% impartial</span>
                  </span>
                  <span className="hidden sm:inline text-amber-400/80 font-mono text-[10px]">
                    Verified Experience
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Event Image Column */}
                <div className="md:col-span-5 relative h-64 md:h-auto min-h-[260px] overflow-hidden bg-slate-950">
                  <img
                    src={primaryImage}
                    alt={event.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-md border border-white/10 shadow-md">
                      {category}
                    </span>
                    {isTopMatch && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Top Pick
                      </span>
                    )}
                  </div>

                  {/* Match Score Badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-rose-500/30 shadow-lg">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          EventIQ Score
                        </span>
                        <span className="text-xl font-black bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent leading-none">
                          {matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action floating buttons on image */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={() => onToggleSave(event)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                          : "bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900"
                      }`}
                      title={isSaved ? "Remove from saved" : "Save this experience"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => onSelectEventDetail(rec)}
                      className="p-2 rounded-xl bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md transition-all cursor-pointer"
                      title="Quick details & concierge guide"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Event Content Column */}
                <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
                  <div>
                    {/* Event Name & Metadata */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        onClick={() => onSelectEventDetail(rec)}
                        className="text-xl sm:text-2xl font-bold text-white group-hover:text-rose-300 transition-colors cursor-pointer leading-snug font-['Outfit']"
                      >
                        {event.name}
                      </h3>
                    </div>

                    {/* Location, Venue, Time row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="truncate">
                          <strong>{venue?.name || "Premier Venue"}</strong>
                          {venue?.city?.name ? `, ${venue.city.name}` : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>
                          {event.dates.start.localDate}
                          {event.dates.start.localTime ? ` • ${event.dates.start.localTime.slice(0, 5)}` : ""}
                        </span>
                      </div>
                    </div>

                    {/* "Why we recommend it" Core AI Section */}
                    <div className="rounded-2xl bg-gradient-to-r from-rose-950/30 via-purple-950/20 to-slate-900/60 border border-rose-500/20 p-4 mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                        <span>Why We Recommend It</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        {whyWeRecommendIt}
                      </p>
                    </div>

                    {/* Experience Highlights Chips */}
                    {experienceHighlights && experienceHighlights.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-5">
                        {experienceHighlights.map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300"
                          >
                            <span>{hl}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Action Row */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Price and Partner Note */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400">Tickets from:</span>
                        <span className="text-lg font-extrabold text-white font-mono">{priceText}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Official Box Office Partner • Verified Authentic
                      </span>
                    </div>

                    {/* Buttons: Compare & Get Tickets */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => onToggleCompare(event)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isCompared
                            ? "bg-purple-600/30 text-purple-200 border-purple-500/60 shadow-md shadow-purple-900/30"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white"
                        }`}
                      >
                        {isCompared ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-purple-300" />
                            <span>Compared</span>
                          </>
                        ) : (
                          <>
                            <GitCompare className="w-3.5 h-3.5" />
                            <span>Compare</span>
                          </>
                        )}
                      </button>

                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                      >
                        <span>Get Tickets</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
