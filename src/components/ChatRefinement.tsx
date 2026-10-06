import React, { useState } from "react";
import { Sparkles, Send, CornerDownLeft, MessageSquare, Flame, ArrowRight, Check } from "lucide-react";

interface ChatRefinementProps {
  onRefine: (refinementText: string) => void;
  isLoading: boolean;
  appliedRefinements: string[];
}

const REFINEMENT_PRESETS = [
  { label: "💰 Something cheaper", text: "Something cheaper with budget friendly tickets" },
  { label: "🚀 More adventurous", text: "Make it more adventurous, immersive or unique" },
  { label: "📍 Closer to me", text: "Keep it in the central downtown area or closer to me" },
  { label: "🌙 Later in the evening", text: "Starts later in the evening after 8:30 PM" },
  { label: "🍷 Craft cocktail vibe", text: "Needs an intimate atmosphere with craft drinks or dinner service" },
  { label: "😂 Stand-up comedy instead", text: "Switch the experience to stand-up comedy" },
  { label: "🌿 Rooftop / Outdoor", text: "Prefer an open-air, rooftop, or outdoor garden setting" },
];

export const ChatRefinement: React.FC<ChatRefinementProps> = ({
  onRefine,
  isLoading,
  appliedRefinements,
}) => {
  const [refinementInput, setRefinementInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementInput.trim() && !isLoading) {
      onRefine(refinementInput.trim());
      setRefinementInput("");
    }
  };

  const handlePresetClick = (presetText: string) => {
    if (!isLoading) {
      onRefine(presetText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16">
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Conversational Refinement
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Context-Aware RAG
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mb-4 max-w-xl">
            EventIQ preserves your date, occasion, and preferences while adjusting only what you ask.
          </p>

          {/* Quick refinement tap buttons */}
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-2">
              Quick One-Click Adjustments:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {REFINEMENT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset.text)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Natural language refinement form */}
          <form onSubmit={handleSubmit} className="relative mt-2">
            <div className="flex items-center rounded-2xl bg-slate-950 border border-slate-700 p-1.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
              <input
                type="text"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder="Say: “Something cheaper”, “More adventurous”, “Closer to me”, or describe any tweak..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!refinementInput.trim() || isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Refine</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Applied history timeline if any */}
          {appliedRefinements.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400 overflow-x-auto">
              <span className="text-[11px] text-slate-500 font-medium flex-shrink-0">Applied refinements:</span>
              {appliedRefinements.map((ref, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30 text-[11px] whitespace-nowrap"
                >
                  <Check className="w-3 h-3 text-purple-400" />
                  <span>{ref}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
