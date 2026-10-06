import React from "react";
import { LiveEvent } from "../types";
import { X, Bookmark, ExternalLink, Calendar, MapPin, Trash2, GitCompare } from "lucide-react";

interface SavedEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: LiveEvent[];
  onRemoveSaved: (eventId: string) => void;
  onCompareEvent: (event: LiveEvent) => void;
  onClearAll: () => void;
}

export const SavedEventsDrawer: React.FC<SavedEventsDrawerProps> = ({
  isOpen,
  onClose,
  savedEvents,
  onRemoveSaved,
  onCompareEvent,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Saved Experiences ({savedEvents.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {savedEvents.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedEvents.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Bookmark className="w-10 h-10 text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No saved experiences yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any event recommendation to save it for later.
              </p>
            </div>
          ) : (
            savedEvents.map((event) => {
              const venue = event._embedded?.venues?.[0];
              const image =
                event.images?.find((img) => img.ratio === "16_9")?.url ||
                event.images?.[0]?.url;
              const minPrice = event.priceRanges?.[0]?.min;
              const priceText = minPrice ? `From $${Math.round(minPrice)}` : "Available Online";

              return (
                <div
                  key={event.id}
                  className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 relative group"
                >
                  <div className="flex gap-3">
                    {image && (
                      <img
                        src={image}
                        alt={event.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-900 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-rose-300 transition-colors">
                        {event.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span>{venue?.name || "Premier Venue"}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span>{event.dates.start.localDate}</span>
                        <span className="text-emerald-400 font-mono font-semibold ml-2">
                          {priceText}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      onClick={() => onRemoveSaved(event.id)}
                      className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCompareEvent(event)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>Compare</span>
                      </button>

                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Tickets</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
