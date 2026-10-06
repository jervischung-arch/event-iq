import React, { useState } from "react";
import { UserIntent } from "../types";
import { Sparkles, SlidersHorizontal, DollarSign, Calendar, MapPin, Tag, Plus, X, RefreshCw } from "lucide-react";

interface IntentScreenProps {
  intent: UserIntent;
  onUpdateIntent: (updatedIntent: UserIntent) => void;
  isLoading: boolean;
}

export const IntentScreen: React.FC<IntentScreenProps> = ({ intent, onUpdateIntent, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOccasion, setEditedOccasion] = useState(intent.occasion);
  const [editedBudget, setEditedBudget] = useState(intent.maxBudgetPerPerson ? String(intent.maxBudgetPerPerson) : "");
  const [editedTimeframe, setEditedTimeframe] = useState(intent.timeframe);
  const [editedLocation, setEditedLocation] = useState(intent.location);
  const [vibesList, setVibesList] = useState<string[]>(intent.vibes);
  const [newVibeInput, setNewVibeInput] = useState("");

  const handleRemoveVibe = (vibeToRemove: string) => {
    const updated = vibesList.filter((v) => v !== vibeToRemove);
    setVibesList(updated);
    onUpdateIntent({ ...intent, vibes: updated });
  };

  const handleAddVibe = () => {
    if (newVibeInput.trim() && !vibesList.includes(newVibeInput.trim())) {
      const updated = [...vibesList, newVibeInput.trim()];
      setVibesList(updated);
      setNewVibeInput("");
      onUpdateIntent({ ...intent, vibes: updated });
    }
  };

  const handleSaveAllEdits = () => {
    const numericBudget = editedBudget ? parseFloat(editedBudget) : null;
    onUpdateIntent({
      ...intent,
      occasion: editedOccasion,
      maxBudgetPerPerson: numericBudget,
      timeframe: editedTimeframe,
      location: editedLocation,
      vibes: vibesList,
      summary: `A ${editedOccasion.toLowerCase()} experience in ${editedLocation} with ${vibesList.join(", ")} vibes.`,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mb-8">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-sm uppercase tracking-wider font-bold text-slate-300">
                Extracted Experience Intent
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Editable Chips
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {intent.summary}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer self-start md:self-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
            <span>{isEditing ? "Done Adjusting" : "Adjust Constraints"}</span>
          </button>
        </div>

        {/* Normal Chips View */}
        {!isEditing ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Occasion Chip */}
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition cursor-pointer"
              title="Click to edit occasion"
            >
              <span>Occasion:</span>
              <span className="text-white font-bold">{intent.occasion}</span>
            </div>

            {/* Budget Chip */}
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition cursor-pointer"
              title="Click to edit budget"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Budget:{" "}
                <strong className="text-white">
                  {intent.maxBudgetPerPerson ? `< $${intent.maxBudgetPerPerson}/person` : "Flexible"}
                </strong>
              </span>
            </div>

            {/* Timeframe Chip */}
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 transition cursor-pointer"
              title="Click to edit timing"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Timing: <strong className="text-white">{intent.timeframe}</strong>
              </span>
            </div>

            {/* Location Chip */}
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition cursor-pointer"
              title="Click to edit location"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>
                City: <strong className="text-white">{intent.location}</strong>
              </span>
            </div>

            {/* Vibes Chips */}
            {intent.vibes.map((vibe) => (
              <span
                key={vibe}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-medium"
              >
                <Tag className="w-3 h-3 text-rose-400" />
                <span>{vibe}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVibe(vibe);
                  }}
                  className="hover:text-rose-400 ml-0.5 cursor-pointer"
                  title="Remove vibe tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          /* Inline Editor View */
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Occasion input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Occasion</label>
                <input
                  type="text"
                  value={editedOccasion}
                  onChange={(e) => setEditedOccasion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Budget input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Budget ($/ticket)</label>
                <input
                  type="number"
                  value={editedBudget}
                  onChange={(e) => setEditedBudget(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Timeframe input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Timeframe</label>
                <input
                  type="text"
                  value={editedTimeframe}
                  onChange={(e) => setEditedTimeframe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Location input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Vibe Tags editor */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Vibes & Atmosphere</label>
              <div className="flex flex-wrap items-center gap-2">
                {vibesList.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={() => setVibesList(vibesList.filter((x) => x !== v))}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newVibeInput}
                    onChange={(e) => setNewVibeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVibe())}
                    placeholder="Add vibe..."
                    className="w-28 bg-slate-950 border border-slate-700 rounded-full px-3 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddVibe}
                    className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllEdits}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-md cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Save & Re-rank Recommendations</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
