import React from "react";
import { RankedEventRecommendation } from "../types";
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  DollarSign,
  Info,
  CheckCircle,
  Shirt,
  Car,
  GlassWater,
  ShieldCheck,
} from "lucide-react";

interface EventDetailModalProps {
  recommendation: RankedEventRecommendation | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  const { event, matchScore, whyWeRecommendIt, experienceHighlights, recommendedArrival, atmospherePros } =
    recommendation;
  const venue = event._embedded?.venues?.[0];
  const primaryImage =
    event.images?.find((img) => img.ratio === "16_9")?.url || event.images?.[0]?.url;

  const minPrice = event.priceRanges?.[0]?.min;
  const maxPrice = event.priceRanges?.[0]?.max;
  const priceFormatted = minPrice
    ? `$${Math.round(minPrice)}${maxPrice && maxPrice > minPrice ? ` - $${Math.round(maxPrice)}` : ""}`
    : "Official Pricing";

  const category =
    event.classifications?.[0]?.genre?.name ||
    event.classifications?.[0]?.segment?.name ||
    "Entertainment";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Image Hero */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 flex-shrink-0 overflow-hidden">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/80 text-white backdrop-blur-md mb-2 inline-block">
                {category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] leading-tight">
                {event.name}
              </h2>
            </div>

            <div className="flex-shrink-0 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-rose-500/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match</span>
              <span className="text-xl font-black text-rose-400 font-mono">{matchScore}%</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Quick Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Date</span>
                <span className="text-slate-200 font-medium">{event.dates.start.localDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Start Time</span>
                <span className="text-slate-200 font-medium">
                  {event.dates.start.localTime ? event.dates.start.localTime.slice(0, 5) : "TBD"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Pricing</span>
                <span className="text-white font-mono font-bold">{priceFormatted}</span>
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <MapPin className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">{venue?.name || "Premier Event Venue"}</h4>
              <p className="text-xs text-slate-400">
                {venue?.address?.line1 ? `${venue.address.line1}, ` : ""}
                {venue?.city?.name || ""}, {venue?.state?.stateCode || ""} {venue?.postalCode || ""}
              </p>
              {venue?.generalInfo?.generalRule && (
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Note: {venue.generalInfo.generalRule}
                </p>
              )}
            </div>
          </div>

          {/* Why We Recommend It */}
          <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/30 p-5">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>EventIQ Concierge Analysis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {whyWeRecommendIt}
            </p>

            {experienceHighlights && experienceHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-500/20">
                {experienceHighlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-medium"
                  >
                    <CheckCircle className="w-3 h-3 text-rose-400" />
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Concierge Night-Of Field Guide */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              EventIQ Experience Field Guide
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Recommended Arrival</strong>
                  <span className="text-slate-400">
                    {recommendedArrival || "Arrive 30–45 minutes early for relaxed bar service & seating."}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <Shirt className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Dress Code Vibe</strong>
                  <span className="text-slate-400">
                    Smart casual to elevated night-out attire.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full description */}
          {(event.info || event.pleaseNote) && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official Event Information
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {event.info || event.pleaseNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed verified authentic seats</span>
          </div>

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-rose-500/25 transition cursor-pointer"
          >
            <span>Proceed to Official Tickets</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
