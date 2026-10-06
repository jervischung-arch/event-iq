import React, { useState } from "react";
import { X, Building2, Terminal, Code2, Check, Copy, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "api_docs" | "inquire">("overview");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Hospitality & Hotels");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const sampleCurl = `curl -X POST https://api.eventiq.ai/v2/concierge/recommend \\
  -H "Authorization: Bearer eiq_live_demo99" \\
  -H "Content-Type: application/json" \\
  -d '{
    "naturalPrompt": "Romantic anniversary dinner show under $150",
    "location": "New York",
    "metadata": { "hotelGuestId": "MRTT-8821" }
  }'`;

  const sampleResponse = `{
  "status": "success",
  "extractedIntent": {
    "occasion": "Anniversary / Romantic Celebration",
    "budgetPerPerson": 150,
    "vibes": ["Romantic", "Intimate", "Elevated"]
  },
  "recommendations": [
    {
      "rank": 1,
      "eventiqMatchScore": 98,
      "eventId": "vvG1zZ4t9x3aBc01",
      "name": "Midnight Candlelight Jazz Sessions",
      "venue": "Blue Note Jazz Club",
      "whyWeRecommendIt": "Immersive candlelit atmosphere with reserved banquettes and vintage champagne.",
      "ticketUrl": "https://www.ticketmaster.com/event/vvG1zZ4t9x3aBc01?aff=partner_marriott"
    }
  ]
}`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleInquire = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/b2b/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, industry, email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-['Outfit']">
                  EventIQ for Enterprise
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  B2B AI Concierge & API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                White-label AI event intelligence for hotels, airlines, travel platforms, and luxury cards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "overview"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Enterprise Solutions
          </button>
          <button
            onClick={() => setActiveTab("api_docs")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "api_docs"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Interactive API Sandbox
          </button>
          <button
            onClick={() => setActiveTab("inquire")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "inquire"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Request API Access
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 border border-indigo-500/20">
                <h3 className="text-base font-bold text-white mb-2">
                  Transform Raw Event Listings into High-Converting Guest Experiences
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ticketmaster lists millions of events, but travelers don’t want a directory — they want curated recommendations that match their trip vibe. EventIQ seamlessly embeds into your digital ecosystem.
                </p>
              </div>

              {/* Use Cases Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-rose-400 text-xl mb-2">🏨</div>
                  <h4 className="text-sm font-bold text-white mb-1">Luxury & Boutique Hotels</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deploy AI smart concierges on in-room tablets or guest messaging apps (WhatsApp/SMS). Recommend tonight’s jazz show or comedy set tailored to the guest’s profile.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-blue-400 text-xl mb-2">✈️</div>
                  <h4 className="text-sm font-bold text-white mb-1">Airlines & OTAs</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Integrate experience recommendations at checkout and in 48-hour pre-flight emails. Monetize ancillary ticket affiliate revenue automatically.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-amber-400 text-xl mb-2">💳</div>
                  <h4 className="text-sm font-bold text-white mb-1">Premium Banking & Credit Cards</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Power next-generation cardholder benefits with personalized event curation that respects cardholder spend tiers and dining partnerships.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-emerald-400 text-xl mb-2">🌆</div>
                  <h4 className="text-sm font-bold text-white mb-1">Destination Tourism Boards</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Offer visitors a natural language concierge that highlights local arts, theatre, and culture without algorithmic clutter.
                  </p>
                </div>
              </div>

              {/* Business Model Summary */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-1">
                <strong className="text-white block mb-1">EventIQ Monetization Architecture:</strong>
                <p>• <strong>B2C:</strong> Free consumer experience discovery powered by verified Ticketmaster affiliate links.</p>
                <p>• <strong>B2B API:</strong> Tiered monthly API subscription based on query volume + white-label UI SDK.</p>
                <p>• <strong>Sponsored Discovery:</strong> Verified event promoters can bid on sponsored placements, transparently badged and never overriding true relevance.</p>
              </div>
            </div>
          )}

          {activeTab === "api_docs" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    cURL Request Example
                  </span>
                  <button
                    onClick={handleCopyCurl}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  {sampleCurl}
                </pre>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Standard JSON Response
                </span>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                  {sampleResponse}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "inquire" && (
            <div>
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Sandbox Access Granted</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    We’ve dispatched an evaluation sandbox API key to <strong>{email}</strong>. Our enterprise team will follow up within 24 hours.
                  </p>
                  <button
                    onClick={() => setActiveTab("api_docs")}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    View API Sandbox Documentation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquire} className="space-y-4 max-w-md mx-auto py-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Grand Hyatt Hotels, Delta Air Lines"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Hospitality & Hotels">Hospitality & Hotels</option>
                      <option value="Airlines & Aviation">Airlines & Aviation</option>
                      <option value="Online Travel Agency (OTA)">Online Travel Agency (OTA)</option>
                      <option value="Luxury Banking / Loyalty">Luxury Banking / Loyalty</option>
                      <option value="Tourism Board / Government">Tourism Board / Government</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Business Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="concierge@company.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-lg transition cursor-pointer"
                  >
                    Request Enterprise Sandbox API Key
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II & GDPR Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
