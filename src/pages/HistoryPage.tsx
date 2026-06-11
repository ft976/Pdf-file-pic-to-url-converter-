import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  File as FileIcon, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface HistoryItem {
  id: string;
  originalName: string;
  size: number;
  mimetype: string;
  createdAt: number;
  expiresAt: number;
}

function formatRemainingTime(ms: number) {
  if (ms <= 0) return "Expired";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
  const tokens = [];
  if (hours > 0) tokens.push(`${hours}h`);
  if (minutes > 0 || hours > 0) tokens.push(`${minutes}m`);
  tokens.push(`${seconds}s`);
  return tokens.join(" ");
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Sync timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hydrate local cache
  useEffect(() => {
    const stored = localStorage.getItem("ethereal_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const copyHistoryLink = async (id: string) => {
    const url = `${window.location.origin}/view/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("ethereal_history", JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete all local history logs? Remote assets will remain until their individual expiration countdown runs out.")) {
      setHistory([]);
      localStorage.removeItem("ethereal_history");
    }
  };

  // Search filter
  const filteredHistory = history.filter(item => {
    return item.originalName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-3xl mx-auto py-12 pb-20 select-none relative px-6">
      {/* Background Atmosphere Lights */}
      <div className="absolute top-0 left-12 w-[500px] h-[500px] bg-orange-500/[0.04] blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="mb-12 border-b border-white/[0.06] pb-8">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-white mb-3">
          Transfers History
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
          Monitor your active sharing links and manage cached file records on this device.
        </p>
      </div>

      {/* Core History Table / List Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* List Header, Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search historical files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-white/[0.1] hover:border-white/30 focus:border-orange-500/50 pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* List Body */}
        {history.length === 0 ? (
          <div className="py-12">
            <h3 className="text-base font-semibold text-white mb-2">No historical share records</h3>
            <p className="text-sm text-neutral-400 mb-8 max-w-sm">
              Local indexes are created dynamically in this browser during successful uploads.
            </p>
            <Link
              to="/"
              className="text-orange-400 font-semibold hover:text-orange-300 transition-colors text-sm"
            >
              Start sharing files &rarr;
            </Link>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-8 text-neutral-500 text-sm">
            No matches found for "{searchQuery}".
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item) => {
              const msRemaining = item.expiresAt - currentTime;
              const isExpired = msRemaining <= 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4 group border-b border-white/[0.03] last:border-0"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-0.5 w-6 h-6 flex items-center justify-center shrink-0 ${
                      isExpired ? "text-neutral-600" : "text-orange-400"
                    }`}>
                      {isExpired ? <FileIcon className="w-5 h-5 opacity-40" /> : <Zap className="w-5 h-5" />}
                    </div>

                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm mb-1 ${
                        isExpired ? "text-neutral-500 line-through" : "text-white"
                      }`} title={item.originalName}>
                        {item.originalName}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-600" />
                          <span className={isExpired ? "text-red-500/50" : "text-orange-400"}>
                            {isExpired ? "Expired" : `${formatRemainingTime(msRemaining)} remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:pt-0 pt-2">
                    {!isExpired && (
                      <>
                        <button
                          onClick={() => copyHistoryLink(item.id)}
                          className="text-neutral-400 hover:text-white transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <span className="text-xs font-semibold uppercase tracking-wide">Copy</span>
                          )}
                        </button>

                        <Link
                          to={`/view/${item.id}`}
                          className="text-neutral-400 hover:text-white transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="text-neutral-600 hover:text-red-400 transition-colors ml-2"
                      title="Clear Index"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500">
            <span>Indexes stored locally.</span>
            
            <button
              onClick={clearAllHistory}
              className="text-red-500/70 hover:text-red-400 font-semibold transition-colors"
            >
              Clear complete log files
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
