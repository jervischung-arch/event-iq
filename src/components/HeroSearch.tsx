import React, { useState } from "react";
import { Sparkles, Search, ArrowRight, Compass, Heart, Users, Music2, Laugh, Trophy, Wand2 } from "lucide-react";

interface HeroSearchProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
  selectedCity: string;
}

const EXPERIENCE_CHIPS = [
  { id: "date-night", label: "❤️ Date night", prompt: "I want a fun, romantic date this Saturday under $100." },
  { id: "family", label: "👨‍👩‍👧 Family", prompt: "An exciting all-ages family afternoon show with dazzling visuals." },
  { id: "music", label: "🎵 Music", prompt: "Intimate live music with great acoustics, craft cocktails, and soul." },
  { id: "comedy", label: "😂 Comedy", prompt: "Hilarious stand-up comedy showcase with friends this weekend." },
  { id: "sports", label: "🏟️ Sports", prompt: "High-energy rivalry sports game with electric stadium atmosphere." },
  { id: "memorable", label: "✨ Memorable", prompt: "A once-in-a-lifetime immersive experience or secret speakeasy show." },
  { id: "theatre", label: "🎭 Theatre & Broadway", prompt: "Captivating musical theatre or cabaret dinner show." },
  { id: "late-night", label: "🌙 Late Night", prompt: "Late night vibe with DJ sets, acoustic jams, or midnight comedy." },
];

const CURATED_PROMPTS = [
  "“I want a fun date this Saturday under $100.”",
  "“Candlelight jazz with craft cocktails in an intimate setting.”",
  "“Hilarious comedy night for 4 friends, somewhere casual.”",
  "“Something memorable and visually stunning for a celebration.”",
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, isLoading, selectedCity }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSearch(prompt.trim());
    }
  };

  const handleChipClick = (chipPrompt: string) => {
    setPrompt(chipPrompt);
    onSearch(chipPrompt);
  };

  return (
    <div className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-rose-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Core Value Prop Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner mb-6">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="text-xs sm:text-sm font-medium text-slate-200">
            AI Event Concierge grounded in <strong className="text-white font-semibold">Ticketmaster Discovery v2</strong>
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight sm:leading-none mb-4">
          Don’t search for events. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Describe the experience.
          </span>
        </h1>

        {/* Supporting subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Tell EventIQ the mood, budget, companionship, and vibe. Our hybrid RAG engine extracts your intent, retrieves live Ticketmaster events, and explains why they fit.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center rounded-2xl bg-slate-900/90 p-2 sm:p-2.5 shadow-2xl shadow-purple-950/30 border border-slate-700/80 focus-within:border-rose-500/60 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-rose-400" />
            </div>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g. "I want a fun date this Saturday under $100 in ${selectedCity}..."`}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none py-2 px-1"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Concierge working...</span>
                </div>
              ) : (
                <>
                  <span>Find Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Experience Chips (Search Box + Chips) */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            What kind of experience are you looking for?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
            {EXPERIENCE_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.prompt)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-white shadow-sm hover:shadow-rose-500/10 transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Curated quick starter prompts */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-medium">Try asking:</span>
          {CURATED_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(sample.replace(/[“”]/g, ""))}
              disabled={isLoading}
              className="hover:text-rose-300 transition underline underline-offset-4 decoration-slate-700 hover:decoration-rose-400 cursor-pointer text-left"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Core Message Callout */}
        <div className="mt-10 max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800/80 text-center shadow-lg">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <span className="text-slate-400">“Ticketmaster tells us what is happening.</span>{" "}
            <span className="text-rose-400 font-bold">EventIQ tells you what you should do.”</span>
          </p>
        </div>
      </div>
    </div>
  );
};
