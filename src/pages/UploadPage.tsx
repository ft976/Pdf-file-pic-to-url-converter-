import React, { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle2, Copy, ExternalLink, Loader2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setResultId(data.file.id);
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
    <div className="max-w-2xl mx-auto w-full pt-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 text-white tracking-tight">Share files securely</h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">Upload any file type (images, documents, zips) to generate a secure link. Files auto-expire in 24 hours.</p>
      </div>

      <AnimatePresence mode="wait">
        {resultId ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 md:p-12 relative overflow-hidden"
          >
            {/* Background glowing orb for the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h2 className="font-display font-semibold text-3xl mb-3 text-white tracking-tight">Upload Complete</h2>
              <p className="text-white/50 mb-10 w-full max-w-sm">Your file is now ready to share. Anyone with the link can view and download it.</p>

              <div className="w-full bg-black/60 rounded-xl p-2.5 flex flex-col sm:flex-row items-center gap-3 border border-white/10 mb-8 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/view/${resultId}`} 
                  className="bg-transparent w-full px-4 py-2 outline-none text-white/80 font-mono text-sm tracking-wide selection:bg-orange-500/40"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button 
                  onClick={copyLink}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-all shadow-sm whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link 
                  to={`/view/${resultId}`}
                  className="flex items-center justify-center gap-2 btn-primary rounded-xl px-8 py-3.5 font-medium text-sm"
                >
                  Open Link
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => {
                    setResultId(null);
                    setFile(null);
                  }}
                  className="flex items-center justify-center gap-2 btn-secondary rounded-xl px-8 py-3.5 font-medium text-sm"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="glass-panel p-2 shadow-2xl shadow-black/50"
          >
            {!file ? (
              <div 
                className={`
                  border-2 border-dashed rounded-[22px] flex flex-col items-center justify-center py-24 px-6 transition-all cursor-pointer relative overflow-hidden group
                  ${isHovering 
                    ? "border-orange-500/50 bg-orange-500/5" 
                    : "border-white/10 bg-transparent hover:bg-white/[0.02] hover:border-white/20"}
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
                
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isHovering ? "bg-orange-500 text-white scale-110 shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60"}`}>
                  <UploadCloud className="w-10 h-10" />
                </div>
                
                <h3 className="font-display font-medium text-2xl mb-3 text-white tracking-tight">Drop your file here</h3>
                <p className="text-white/40 text-sm max-w-[280px] text-center mb-8">
                  Support for any file type including docs and zips<br/>(max. 50MB)
                </p>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="btn-secondary px-6 py-2.5 rounded-full text-sm font-medium z-10"
                >
                  Or browse files
                </button>
                
                {error && (
                  <div className="absolute bottom-6 mx-6 px-4 py-3 bg-red-950/80 text-red-300 rounded-xl text-sm font-medium border border-red-500/20 backdrop-blur-md">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                  <div className="flex items-center gap-5 truncate">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                      <FileIcon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="truncate text-left flex-1 min-w-0">
                      <p className="font-medium text-white truncate mb-1 text-sm sm:text-base">{file.name}</p>
                      <p className="font-mono text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-2 sm:p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white shrink-0 ml-4"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setFile(null)}
                    disabled={uploading}
                    className="btn-secondary px-6 py-3.5 rounded-xl font-medium text-sm w-full sm:w-auto text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium disabled:opacity-70 flex justify-center items-center gap-3 text-sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Generate Link"
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-6 px-4 py-3 bg-red-950/80 text-red-300 rounded-xl text-sm w-full font-medium border border-red-500/20 backdrop-blur-md">
                    {error}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
