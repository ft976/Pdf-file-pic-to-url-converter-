import { FileUp, ArrowLeft, History, Info } from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import etherealLogo from "../assets/images/etherealshare_logo_1781183794545.jpg";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/";

  // Helper to check if a route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-orange-500/30">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 select-none">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src={etherealLogo} 
                alt="EtherealShare Logo"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(249,115,22,0.4)] border border-orange-500/30"
              />
              <span className="font-display font-semibold text-lg tracking-wide text-white group-hover:text-white/90 transition-colors">EtherealShare</span>
            </Link>
          </div>
          
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link 
              to="/"
              className={`text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                isActive("/") 
                  ? "bg-white/5 text-orange-400 border-white/10 shadow-[inner_0_1px_4px_rgba(255,255,255,0.05)]" 
                  : "text-neutral-400 hover:text-white border-transparent hover:bg-white/[0.03]"
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </Link>

            <Link 
              to="/history"
              className={`text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                isActive("/history") 
                  ? "bg-white/5 text-orange-400 border-white/10 shadow-[inner_0_1px_4px_rgba(255,255,255,0.05)]" 
                  : "text-neutral-400 hover:text-white border-transparent hover:bg-white/[0.03]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History</span>
            </Link>

            <Link 
              to="/info"
              className={`text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                isActive("/info") 
                  ? "bg-white/5 text-orange-400 border-white/10 shadow-[inner_0_1px_4px_rgba(255,255,255,0.05)]" 
                  : "text-neutral-400 hover:text-white border-transparent hover:bg-white/[0.03]"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Info</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10 min-h-[calc(100vh-4rem-4rem)]">
        <Outlet />
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-6 border-t border-white/5 text-center text-sm text-white/40">
        <p className="font-sans">Ephemeral file sharing. Files expire automatically after 24 hours.</p>
      </footer>
    </div>
  );
}
