import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSearch } from "./components/HeroSearch";
import { IntentScreen } from "./components/IntentScreen";
import { ResultsList } from "./components/ResultsList";
import { ChatRefinement } from "./components/ChatRefinement";
import { EventComparisonModal } from "./components/EventComparisonModal";
import { EventDetailModal } from "./components/EventDetailModal";
import { EnterpriseModal } from "./components/EnterpriseModal";
import { SavedEventsDrawer } from "./components/SavedEventsDrawer";
import { UserIntent, RankedEventRecommendation, LiveEvent, SystemStatus } from "./types";
import { Sparkles, AlertCircle, RefreshCw, Layers, Compass, ArrowUp } from "lucide-react";

export default function App() {
  const [selectedCity, setSelectedCity] = useState("New York");
  const [currentIntent, setCurrentIntent] = useState<UserIntent | null>(null);
  const [recommendations, setRecommendations] = useState<RankedEventRecommendation[]>([]);
  const [retrievalSource, setRetrievalSource] = useState<"live_api" | "curated_provider">("curated_provider");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [savedEvents, setSavedEvents] = useState<LiveEvent[]>(() => {
    try {
      const stored = localStorage.getItem("eventiq_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [compareEvents, setCompareEvents] = useState<LiveEvent[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [selectedDetailRec, setSelectedDetailRec] = useState<RankedEventRecommendation | null>(null);
  const [appliedRefinements, setAppliedRefinements] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync saved events to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("eventiq_saved", JSON.stringify(savedEvents));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }, [savedEvents]);

  // Initial load status check & default seed query
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.warn("Status check failed:", err));

    handleSearch("I want a fun date this Saturday under $100.");
  }, []);

  // Primary natural language search pipeline
  const handleSearch = async (prompt: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/experience/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, location: selectedCity }),
      });

      if (!response.ok) {
        throw new Error(`Concierge pipeline failed with status ${response.status}`);
      }

      const data = await response.json();
      setCurrentIntent(data.intent);
      setRecommendations(data.recommendations || []);
      setRetrievalSource(data.retrievalSource || "curated_provider");
      setAppliedRefinements([]);
    } catch (err: any) {
      console.error("Search error:", err);
      setErrorMessage(err.message || "Failed to retrieve recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update intent via editable chips
  const handleUpdateIntent = async (updatedIntent: UserIntent) => {
    setCurrentIntent(updatedIntent);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/events/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: updatedIntent }),
      });

      if (!response.ok) throw new Error("Failed to re-rank with updated intent");

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setRetrievalSource(data.retrievalSource || "curated_provider");
    } catch (err: any) {
      console.error("Update intent error:", err);
      setErrorMessage("Failed to update recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Conversational refinement follow-up
  const handleRefine = async (refinementText: string) => {
    if (!currentIntent) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/events/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousIntent: currentIntent,
          refinementPrompt: refinementText,
        }),
      });

      if (!response.ok) throw new Error("Failed to refine experience");

      const data = await response.json();
      setCurrentIntent(data.intent);
      setRecommendations(data.recommendations || []);
      setRetrievalSource(data.retrievalSource || "curated_provider");
      setAppliedRefinements((prev) => [...prev, refinementText]);
    } catch (err: any) {
      console.error("Refine error:", err);
      setErrorMessage("Refinement failed. Please try a different adjustment.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle comparison item (up to 3)
  const handleToggleCompare = (event: LiveEvent) => {
    setCompareEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      if (exists) {
        return prev.filter((e) => e.id !== event.id);
      }
      if (prev.length >= 3) {
        setIsCompareModalOpen(true);
        return prev;
      }
      return [...prev, event];
    });
  };

  // Toggle saved bookmarks
  const handleToggleSave = (event: LiveEvent) => {
    setSavedEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      if (exists) {
        return prev.filter((e) => e.id !== event.id);
      }
      return [...prev, event];
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (currentIntent) {
      handleUpdateIntent({ ...currentIntent, location: city });
    } else {
      handleSearch(`Best weekend experiences in ${city}`);
    }
  };

  const handleResetToHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Header */}
      <Header
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        status={status}
        savedEvents={savedEvents}
        compareEvents={compareEvents}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenEnterprise={() => setIsEnterpriseModalOpen(true)}
        onResetToHome={handleResetToHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero & Natural Language Search Box + Chips */}
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          selectedCity={selectedCity}
        />

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="max-w-md mx-auto px-4 py-8 text-center animate-in fade-in">
            <div className="relative w-12 h-12 mx-auto mb-3">
              <div className="absolute inset-0 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" style={{ animationDirection: "reverse" }} />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              EventIQ Concierge is synthesizing experiences...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Extracting intent • Filtering Live Discovery • Gemini RAG Ranking
            </p>
          </div>
        )}

        {/* Extracted Intent Screen */}
        {currentIntent && !isLoading && (
          <IntentScreen
            intent={currentIntent}
            onUpdateIntent={handleUpdateIntent}
            isLoading={isLoading}
          />
        )}

        {/* Recommendations Results List */}
        {!isLoading && recommendations.length > 0 && (
          <ResultsList
            recommendations={recommendations}
            retrievalSource={retrievalSource}
            onSelectEventDetail={(rec) => setSelectedDetailRec(rec)}
            onToggleCompare={handleToggleCompare}
            onToggleSave={handleToggleSave}
            compareList={compareEvents}
            savedList={savedEvents}
          />
        )}

        {/* Conversational Refinement Component */}
        {currentIntent && !isLoading && recommendations.length > 0 && (
          <ChatRefinement
            onRefine={handleRefine}
            isLoading={isLoading}
            appliedRefinements={appliedRefinements}
          />
        )}
      </main>

      {/* Floating Compare Pill if 1+ items selected */}
      {compareEvents.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/60 border border-purple-400/40 hover:scale-105 transition cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Compare {compareEvents.length} Experiences</span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <EventComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        events={compareEvents}
        onRemoveEvent={(id) => setCompareEvents((prev) => prev.filter((e) => e.id !== id))}
        onClearAll={() => setCompareEvents([])}
      />

      <EventDetailModal
        recommendation={selectedDetailRec}
        onClose={() => setSelectedDetailRec(null)}
      />

      <EnterpriseModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
      />

      <SavedEventsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedEvents={savedEvents}
        onRemoveSaved={(id) => setSavedEvents((prev) => prev.filter((e) => e.id !== id))}
        onCompareEvent={(event) => {
          handleToggleCompare(event);
          setIsSavedDrawerOpen(false);
          setIsCompareModalOpen(true);
        }}
        onClearAll={() => setSavedEvents([])}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-10 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-slate-300 font-['Outfit'] text-sm">EventIQ</span>
            <span>•</span>
            <span className="text-slate-400">The AI Event Concierge</span>
          </div>
          <p className="max-w-lg mx-auto text-slate-400 italic">
            “Search tells you what is happening. EventIQ tells you what you should do.”
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Live Event Discovery Engine</span>
            <span>•</span>
            <span>Gemini RAG Hybrid Ranking</span>
            <span>•</span>
            <button
              onClick={() => setIsEnterpriseModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Enterprise White-Label API
            </button>
          </div>
          <p className="text-[10px] text-slate-500 pt-2">
            © 2026 EventIQ Technologies. All event data, trademarks, and tickets sourced via verified event partner APIs.
          </p>
        </div>
      </footer>
    </div>
  );
}
