import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  File as FileIcon, 
  X, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Loader2, 
  Check, 
  ChevronRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface ExpiryOption {
  label: string;
  value: number; // minutes
  desc: string;
}

const EXPIRY_OPTIONS: ExpiryOption[] = [
  { label: "10 min", value: 10, desc: "Expires in 10 minutes" },
  { label: "30 min", value: 30, desc: "Expires in 30 minutes" },
  { label: "1 hr", value: 60, desc: "Expires in 1 hour" },
  { label: "6 hr", value: 360, desc: "Expires in 6 hours" },
  { label: "12 hr", value: 720, desc: "Expires in 12 hours" },
  { label: "24 hr", value: 1440, desc: "Expires in 24 hours (Max)" },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState<number>(1440); // Default to 24 hours
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File is too large. Maximum size is 50MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiryMinutes", String(selectedExpiry));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      
      setResultId(data.file.id);

      // Register successfully uploaded file to local history
      const newHistoryItem = {
        id: data.file.id,
        originalName: data.file.originalName,
        size: data.file.size,
        mimetype: data.file.mimetype,
        createdAt: data.file.createdAt,
        expiresAt: data.file.expiresAt,
      };

      const stored = localStorage.getItem("ethereal_history");
      const currentHistory = stored ? JSON.parse(stored) : [];
      const updatedHistory = [newHistoryItem, ...currentHistory];
      localStorage.setItem("ethereal_history", JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const copyLink = async () => {
    if (!resultId) return;
    const url = `${window.location.origin}/view/${resultId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-10 pb-24 select-none relative px-4 sm:px-6">
      {/* Dynamic Background Atmosphere Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/[0.08] via-amber-500/[0.04] to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white mb-4"
        >
          Share files securely.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Ephemeral file sharing. Files expire automatically based on your selected timer.
        </motion.p>
      </div>

      {/* Main Uploader */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {resultId ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-10 text-center relative z-10"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
              >
                <CheckCircle2 className="w-7 h-7" />
              </motion.div>
              
              <h2 className="font-display font-bold text-2xl mb-8 text-white">Transmission Ready</h2>

              <div className="w-full max-w-md mx-auto bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl p-1.5 flex flex-col sm:flex-row items-center gap-2 mb-8 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/view/${resultId}`} 
                  className="bg-transparent w-full px-4 py-2 outline-none text-white/90 font-mono text-xs selection:bg-orange-500/40 cursor-text"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button 
                  onClick={copyLink}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer shadow-lg"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>

              <div className="flex justify-center gap-4">
                <Link 
                  to={`/view/${resultId}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 active:scale-98 transition-all rounded-xl px-8 py-3 font-semibold text-xs shadow-lg text-white"
                >
                  Open Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button 
                  onClick={() => {
                    setResultId(null);
                    setFile(null);
                  }}
                  className="flex justify-center items-center gap-2 px-6 py-3 font-semibold text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Post another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploader-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 sm:p-5">
                {!file ? (
                  <div 
                    className={`
                      border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center py-24 px-6 transition-all duration-300 cursor-pointer relative group
                      ${isHovering 
                        ? "border-orange-500/50 bg-orange-500/[0.02]" 
                        : "border-white/[0.06] hover:border-white/20"}
                    `}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleChange}
                      className="hidden"
                    />
                    
                    <div className="absolute w-28 h-28 bg-orange-500/5 rounded-full blur-[25px] group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 relative ${isHovering ? "text-orange-400 scale-110 shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-orange-500/10" : "text-neutral-400 group-hover:text-white"}`}>
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    
                    <h3 className="font-display font-medium text-lg text-white mb-2 tracking-tight">Drop your file here</h3>
                    <p className="text-neutral-500 text-xs sm:text-sm text-center mb-8">
                      Max file size: 50MB
                    </p>

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wider transition-all z-10 cursor-pointer"
                    >
                      Browse Files
                    </button>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-6 px-4 py-2 bg-red-950/90 text-red-300 rounded-xl text-xs font-mono backdrop-blur-md"
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 sm:py-12 max-w-lg mx-auto text-center">
                    <div className="flex flex-col items-center justify-center mb-12">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                        <div className="relative w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center">
                          <FileIcon className="w-10 h-10 text-orange-400" />
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-white text-center truncate px-4 w-full mb-2">
                        {file.name}
                      </h3>
                      <p className="font-mono text-sm text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="mb-12">
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-semibold text-white tracking-wide">
                          Expiration Timer
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {EXPIRY_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            disabled={uploading}
                            onClick={() => setSelectedExpiry(opt.value)}
                            className={`py-2.5 px-5 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                              selectedExpiry === opt.value
                                ? "bg-white text-black drop-shadow-md"
                                : "text-neutral-400 hover:text-white bg-transparent"
                            }`}
                            title={opt.desc}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4">
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-full font-bold text-base shadow-lg hover:opacity-95 disabled:opacity-70 flex justify-center items-center gap-3 cursor-pointer transition-all active:scale-98 mx-auto"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-black" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <span>Generate Link</span>
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setFile(null)}
                        disabled={uploading}
                        className="mt-4 px-6 py-3 font-semibold text-sm text-center text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    {error && (
                      <div className="mt-8 text-center text-red-400 text-sm font-mono">
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
