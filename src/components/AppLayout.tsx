import { FileUp, Link2, ArrowLeft } from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/";

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-orange-500/30">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
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
              <div className="bg-gradient-to-tr from-orange-600 to-amber-500 p-1.5 rounded-lg group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                <Link2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-lg tracking-wide text-white group-hover:text-white/90 transition-colors">EtherealShare</span>
            </Link>
          </div>
          
          <nav>
            <Link 
              to="/"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg"
            >
              <FileUp className="w-4 h-4" />
              Upload
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
