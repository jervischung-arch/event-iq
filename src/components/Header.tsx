import React from "react";
import { Sparkles, Compass, Bookmark, GitCompare, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { SystemStatus, TicketmasterEvent } from "../types";

interface HeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  status: SystemStatus | null;
  savedEvents: TicketmasterEvent[];
  compareEvents: TicketmasterEvent[];
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  onOpenEnterprise: () => void;
  onResetToHome: () => void;
}

const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "San Francisco",
  "Austin",
  "London",
  "Miami",
  "Nashville",
];

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onCityChange,
  status,
  savedEvents,
  compareEvents,
  onOpenSaved,
  onOpenCompare,
  onOpenEnterprise,
  onResetToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onResetToHome}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-['Outfit']">
                Event<span className="text-rose-500">IQ</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                v2 Discovery + RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              “Don’t search for events. Describe the experience.”
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City selector */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 transition">
            <MapPin className="w-3.5 h-3.5 text-rose-400 mr-1.5 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Ticketmaster Data Source Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Ticketmaster Discovery API</span>
          </div>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            disabled={compareEvents.length === 0}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              compareEvents.length > 0
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 cursor-pointer"
                : "bg-slate-900/40 text-slate-500 border border-slate-800/60 cursor-not-allowed opacity-60"
            }`}
            title={compareEvents.length > 0 ? "Compare selected events" : "Select events to compare"}
          >
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                compareEvents.length > 0 ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {compareEvents.length}/3
            </span>
          </button>

          {/* Saved Events */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedEvents.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {savedEvents.length}
              </span>
            )}
          </button>

          {/* Enterprise B2B Modal Trigger */}
          <button
            onClick={onOpenEnterprise}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-indigo-500/30 text-indigo-300 hover:text-indigo-100 hover:border-indigo-400/50 shadow-sm transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>B2B API</span>
          </button>
        </div>
      </div>
    </header>
  );
};
