import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Loader2, 
  AlertCircle, 
  FileText, 
  Download, 
  Calendar, 
  HardDrive, 
  Clock, 
  ArrowLeft, 
  Layers,
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Expired";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
  const tokenList = [];
  if (hours > 0) tokenList.push(`${hours}h`);
  if (minutes > 0 || hours > 0) tokenList.push(`${minutes}m`);
  tokenList.push(`${seconds}s`);
  return tokenList.join(" ");
}

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/files/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) throw new Error(data.error);
        setFileDetails(data.file);
      })
      .catch(err => {
        setError(err.message || "Failed to load file");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!fileDetails || !fileDetails.expiresAt) return;
    
    const calculateTimeLeft = () => {
      const difference = fileDetails.expiresAt - Date.now();
      if (difference <= 0) {
        setTimeLeft(0);
        setError("This secure link has expired.");
      } else {
        setTimeLeft(difference);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [fileDetails]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative">
        <div className="absolute w-72 h-72 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        <p className="text-neutral-400 font-mono text-xs tracking-widest uppercase animate-pulse">Requesting file stream...</p>
      </div>
    );
  }

  if (error || !fileDetails) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-8 mt-12 relative overflow-hidden select-none">
        {/* Soft glowing ambient drop behind to avoid rigid boxes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/[0.04] blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-400 flex items-center justify-center rounded-2xl mx-auto mb-6 border border-red-500/15 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-semibold mb-3 text-white tracking-tight">Transmission Closed</h2>
          <p className="text-neutral-500 mb-8 max-w-[280px] mx-auto text-xs sm:text-sm leading-relaxed">
            {error || "This secure file has expired, expired automatically, or has been revoked."}
          </p>
          <Link 
            to="/" 
            className="inline-flex py-3.5 px-8 bg-white/5 hover:bg-white/10 text-white border border-white/[0.08] hover:border-white/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Go to Uploader
          </Link>
        </motion.div>
      </div>
    );
  }

  const fileUrl = `/api/raw/${fileDetails.filename}`;
  const isImage = fileDetails.mimetype.startsWith("image/");
  const isPdf = fileDetails.mimetype === "application/pdf";

  return (
    <div className="w-full max-w-5xl mx-auto pt-2 pb-16 relative">
      {/* Cinematic Ambient Glow behind the whole view stage */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-500/[0.03] via-violet-500/[0.02] to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Floating Meta Panel (Avoids thick heavy boxes, utilizes flowing layout) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-white/[0.06] relative z-10"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/[0.02] border border-white/[0.06] text-orange-400 rounded-xl flex items-center justify-center shrink-0">
            {isImage ? <Layers className="w-5 h-5 text-amber-400" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0 text-left">
            <h1 className="font-display font-medium text-xl sm:text-2xl text-white truncate max-w-xs sm:max-w-md lg:max-w-2xl mb-2 tracking-tight" title={fileDetails.originalName}>
              {fileDetails.originalName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.03]">
                <HardDrive className="w-3 h-3 text-neutral-500" /> 
                {(fileDetails.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-500" /> 
                {new Date(fileDetails.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              {fileDetails.expiresAt && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/5 text-orange-400 rounded-md font-bold">
                  <Clock className="w-3 h-3 animate-pulse" />
                  <span>
                    {timeLeft !== null && timeLeft > 0 ? `${formatTimeLeft(timeLeft)} remaining` : "Expiring..."}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a 
            href={fileUrl}
            download={fileDetails.originalName}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-7 py-3 rounded-xl transition-all font-semibold text-sm active:scale-95 shadow-[0_8px_20px_rgba(249,115,22,0.15)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download High-res</span>
          </a>
        </div>
      </motion.div>

      {/* Main Display Stage: No box frame, but floating glass visualizer */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative rounded-3xl bg-black/40 border border-white/[0.03] overflow-hidden min-h-[420px] sm:min-h-[580px] flex items-center justify-center shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
      >
        {isImage ? (
          <div className="w-full h-full min-h-[420px] sm:min-h-[580px] flex items-center justify-center relative p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAxNSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAxNSIvPgo8L3N2Zz4=')]">
            <img 
              src={fileUrl} 
              alt={fileDetails.originalName}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/[0.03]"
            />
          </div>
        ) : isPdf ? (
          <div className="w-full h-[72vh] lg:h-[78vh] relative">
            <iframe 
              src={`${fileUrl}#view=FitH`} 
              className="w-full h-full bg-[#1e1e1e]"
              title={fileDetails.originalName}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="text-center p-12 max-w-sm w-full mx-auto select-none">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-neutral-500" />
            </div>
            
            <h4 className="font-display font-semibold text-lg text-white mb-2">No preview loaded</h4>
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-8">
              This asset format cannot be previewed. Download with 100% full original metadata intact.
            </p>
            
            <a 
              href={fileUrl}
              download={fileDetails.originalName}
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 active:scale-95 text-white border border-white/[0.08] hover:border-white/20 w-full px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        )}
      </motion.div>

      {/* Trust Signpost Footer to enrich page experience */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-neutral-500 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Metadata secure. Original file unaltered.</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Expires automatically on deadline.</span>
        </div>
      </div>
    </div>
  );
}
