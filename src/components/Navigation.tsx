import React from 'react';
import { Movie, ViewMode } from '../types';
import { Film, Calendar, LayoutGrid, ListFilter, Plus, LogOut, User, RefreshCw, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  onAdd: () => void;
  onSync: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
  setLayoutStyle: (style: 'swiss' | 'brutalist' | 'neo') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, setView, onAdd, onSync, isAuthenticated, onLogout, layoutStyle, setLayoutStyle 
}) => {
  const navClasses = {
    swiss: "bg-cinema-bg/80 backdrop-blur-md border-b border-cinema-ink/10",
    brutalist: "bg-cinema-bg border-b-2 border-cinema-ink",
    neo: "bg-white/40 backdrop-blur-xl border-none shadow-sm"
  };

  const btnClasses = {
    swiss: "rounded-none",
    brutalist: "rounded-none",
    neo: "rounded-full"
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navClasses[layoutStyle]}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('grid')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-cinema-ink flex items-center justify-center text-white font-bold text-lg md:text-xl shrink-0">
            C
          </div>
          <span className="font-sans font-black tracking-tighter text-lg md:text-2xl uppercase truncate max-w-[100px] sm:max-w-none">Cinema.Archive</span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Main Views */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {[
              { id: 'grid', label: '首页', icon: LayoutGrid },
              { id: 'archive', label: '馆藏', icon: Film },
              { id: 'watchlist', label: '待看', icon: ListFilter },
              { id: 'timeline', label: '轴', icon: Calendar },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`flex items-center space-x-1 p-2 md:px-3 md:py-1.5 transition-colors group ${btnClasses[layoutStyle]} ${currentView === item.id ? 'text-cinema-ink bg-lavender/20' : 'text-cinema-ink/40 hover:text-cinema-ink'}`}
                title={item.label}
              >
                <item.icon size={16} />
                <span className="hidden lg:inline text-[10px] md:text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-cinema-ink/10 hidden md:block" />

          {/* Layout Switcher */}
          <div className="hidden sm:flex items-center bg-zinc-100 p-1 rounded-sm border border-cinema-ink/5">
            {(['swiss', 'brutalist', 'neo'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setLayoutStyle(style)}
                className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-1 rounded-sm transition-all ${
                  layoutStyle === style 
                    ? 'bg-white text-cinema-ink shadow-sm' 
                    : 'text-cinema-ink/30 hover:text-cinema-ink/60'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-cinema-ink/10" />

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAdd}
              className={`w-8 h-8 md:w-10 md:h-10 border border-cinema-ink flex items-center justify-center transition-colors group relative ${btnClasses[layoutStyle]} ${isAuthenticated ? 'bg-lavender' : 'hover:bg-lavender'}`}
            >
              <Plus size={16} md:size={18} />
              {!isAuthenticated && (
                <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </button>

            {isAuthenticated && (
              <>
                <button 
                  onClick={onSync}
                  className={`w-8 h-8 md:w-10 md:h-10 border border-cinema-ink flex items-center justify-center hover:bg-lavender transition-colors hidden md:flex ${btnClasses[layoutStyle]}`}
                  title="同步豆瓣"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  onClick={onLogout}
                  className={`w-8 h-8 md:w-10 md:h-10 border border-cinema-ink flex items-center justify-center hover:bg-zinc-100 transition-colors ${btnClasses[layoutStyle]}`}
                  title="退出"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
