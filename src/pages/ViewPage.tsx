import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, FileText, Download, Calendar, HardDrive, Clock } from "lucide-react";

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<any>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-white/60 font-medium text-sm animate-pulse">Retrieving file...</p>
      </div>
    );
  }

  if (error || !fileDetails) {
    return (
      <div className="max-w-md mx-auto text-center py-20 glass-panel px-8 mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="w-16 h-16 bg-red-500/10 text-red-400 flex items-center justify-center rounded-2xl mx-auto mb-6 border border-red-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-semibold mb-3 text-white">File Unavailable</h2>
        <p className="text-white/50 mb-8 max-w-[280px] mx-auto text-sm">{error || "The link may be broken, or the file has expired."}</p>
        <Link to="/" className="inline-flex py-3 px-8 btn-primary text-sm rounded-xl font-medium w-full justify-center">
          Back to Home
        </Link>
      </div>
    );
  }

  const fileUrl = `/api/raw/${fileDetails.filename}`;
  const isImage = fileDetails.mimetype.startsWith("image/");
  const isPdf = fileDetails.mimetype === "application/pdf";

  return (
    <div className="w-full max-w-6xl mx-auto pt-4 relative z-10">
      
      <div className="glass-panel p-2 shadow-2xl shadow-black/50 overflow-hidden isolate relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-5 sm:p-6 rounded-[22px] border border-white/[0.05] mb-2 backdrop-blur-md">
          <div className="flex items-start sm:items-center gap-5">
            <div className="hidden sm:flex w-14 h-14 bg-gradient-to-br from-orange-400/20 to-orange-600/5 rounded-xl border border-orange-500/20 items-center justify-center text-orange-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-medium text-lg sm:text-xl text-white truncate max-w-xs sm:max-w-md lg:max-w-xl mb-3 tracking-tight" title={fileDetails.originalName}>
                {fileDetails.originalName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-white/50 font-mono">
                <div className="flex items-center gap-1.5 border border-white/10 px-2 py-1 rounded-md bg-white/5"><HardDrive className="w-3.5 h-3.5" /> {(fileDetails.size / 1024 / 1024).toFixed(2)} MB</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/30" /> {new Date(fileDetails.createdAt).toLocaleDateString()}</div>
                {fileDetails.expiresAt && (
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-orange-400/50" /> Expires {new Date(fileDetails.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center shrink-0 w-full md:w-auto">
            <a 
              href={fileUrl}
              download={fileDetails.originalName}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 btn-primary px-6 py-3 rounded-xl transition-all font-semibold text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>

        <div className="bg-black/60 border-t border-white/[0.05] rounded-[0_0_22px_22px] overflow-hidden min-h-[400px] sm:min-h-[600px] flex items-center justify-center relative">
          {isImage ? (
            // Add a subtle checkered pattern for transparent images
            <div className="w-full h-full min-h-[400px] sm:min-h-[600px] flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyNSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyNSIvPgo8L3N2Zz4=')]">
              <img 
                src={fileUrl} 
                alt={fileDetails.originalName}
                className="max-w-full max-h-[75vh] object-contain shadow-2xl"
              />
            </div>
          ) : isPdf ? (
            <iframe 
              src={`${fileUrl}#view=FitH`} 
              className="w-full h-[75vh] lg:h-[80vh] bg-[#323639]"
              title={fileDetails.originalName}
            />
          ) : (
            <div className="text-center p-12 m-8 max-w-sm w-full mx-auto">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FileText className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white font-display font-medium text-xl mb-2">No preview available</p>
              <p className="text-white/50 mb-8 text-sm leading-relaxed">This file format cannot be previewed in the browser. You can download it securely directly to your device.</p>
              <a 
                href={fileUrl}
                download={fileDetails.originalName}
                className="inline-flex items-center justify-center gap-2 btn-secondary w-full px-6 py-3.5 rounded-xl font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Download to device
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
