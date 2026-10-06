import React from "react";
import { LiveEvent } from "../types";
import { X, GitCompare, ExternalLink, Calendar, MapPin, DollarSign, Sparkles, Check, Trash2 } from "lucide-react";

interface EventComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: LiveEvent[];
  onRemoveEvent: (eventId: string) => void;
  onClearAll: () => void;
}

export const EventComparisonModal: React.FC<EventComparisonModalProps> = ({
  isOpen,
  onClose,
  events,
  onRemoveEvent,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Experience Comparison ({events.length}/3)
              </h2>
              <p className="text-xs text-slate-400">
                Compare atmosphere, pricing, venue setting, and timing side by side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {events.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {events.length === 0 ? (
            <div className="py-16 text-center">
              <GitCompare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No experiences selected</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click “Compare” on any recommendation card to compare up to 3 experiences.
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-${events.length} gap-6`}>
              {events.map((event) => {
                const venue = event._embedded?.venues?.[0];
                const image =
                  event.images?.find((img) => img.ratio === "16_9")?.url ||
                  event.images?.[0]?.url;
                const minPrice = event.priceRanges?.[0]?.min;
                const maxPrice = event.priceRanges?.[0]?.max;
                const priceFormatted = minPrice
                  ? `$${Math.round(minPrice)}${maxPrice && maxPrice > minPrice ? ` - $${Math.round(maxPrice)}` : ""}`
                  : "Available Online";

                const category =
                  event.classifications?.[0]?.genre?.name ||
                  event.classifications?.[0]?.segment?.name ||
                  "Entertainment";

                return (
                  <div
                    key={event.id}
                    className="flex flex-col justify-between rounded-2xl bg-slate-950/70 border border-slate-800 p-5 relative overflow-hidden"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveEvent(event.id)}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      {/* Image */}
                      <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-slate-900">
                        {image && (
                          <img
                            src={image}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md">
                          {category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white mb-3 font-['Outfit'] line-clamp-2">
                        {event.name}
                      </h3>

                      {/* Spec 1: Pricing */}
                      <div className="mb-4 pb-3 border-b border-slate-800/80">
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                          Ticket Pricing
                        </span>
                        <div className="flex items-center gap-1.5 text-white font-mono font-bold text-sm">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>{priceFormatted}</span>
                        </div>
                      </div>

                      {/* Spec 2: Date & Time */}
                      <div className="mb-4 pb-3 border-b border-slate-800/80">
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                          Date & Schedule
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-200 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>
                            {event.dates.start.localDate}
                            {event.dates.start.localTime ? ` @ ${event.dates.start.localTime.slice(0, 5)}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Spec 3: Venue & Setting */}
                      <div className="mb-4 pb-3 border-b border-slate-800/80">
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                          Venue & Location
                        </span>
                        <div className="flex items-start gap-1.5 text-slate-200 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-white">{venue?.name || "Premier Venue"}</p>
                            <p className="text-slate-400 text-[11px]">
                              {venue?.address?.line1 ? `${venue.address.line1}, ` : ""}
                              {venue?.city?.name || "Downtown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Spec 4: Vibe Tags */}
                      {event.vibeTags && event.vibeTags.length > 0 && (
                        <div className="mb-4 pb-3 border-b border-slate-800/80">
                          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1.5">
                            Atmosphere
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {event.vibeTags.map((v, vI) => (
                              <span
                                key={vI}
                                className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Spec 5: Info / Note */}
                      <div className="mb-4">
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                          Event Overview
                        </span>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {event.info || event.pleaseNote || "Verified live experience."}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 mt-auto">
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                      >
                        <span>Book Official Tickets</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Official box office partner links • No price inflation</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
