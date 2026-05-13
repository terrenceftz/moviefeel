import React, { useState, useEffect } from 'react';
import { Movie, ViewMode } from '../types';
import { Film, Calendar, LayoutGrid, ListFilter, Plus, LogOut, User, RefreshCw, BarChart3, Menu, X, Settings } from 'lucide-react';
import { getSiteName } from '../services/configService';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteName, setSiteNameState] = useState(getSiteName());

  useEffect(() => {
    const handler = (e: Event) => setSiteNameState((e as CustomEvent).detail);
    window.addEventListener('site-name-changed', handler);
    return () => window.removeEventListener('site-name-changed', handler);
  }, []);

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
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${navClasses[layoutStyle]}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('grid')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-cinema-ink flex items-center justify-center text-white font-bold text-lg md:text-xl shrink-0">
            C
          </div>
          <span className="font-sans font-black tracking-tighter text-lg md:text-2xl uppercase truncate max-w-[100px] sm:max-w-none">{siteName}</span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Desktop Main Views */}
          <div className="hidden md:flex items-center space-x-1 md:space-x-4">
            {[
              { id: 'grid', label: '首页', icon: LayoutGrid },
              { id: 'archive', label: '馆藏', icon: Film },
              { id: 'watchlist', label: '待看', icon: ListFilter },
              { id: 'timeline', label: '轴', icon: Calendar },
              { id: 'summary', label: '总结', icon: BarChart3 },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`relative flex items-center space-x-1 p-2 md:px-3 md:py-1.5 transition-colors group ${btnClasses[layoutStyle]} ${currentView === item.id ? 'text-cinema-ink' : 'text-cinema-ink/40 hover:text-cinema-ink'}`}
                title={item.label}
              >
                {currentView === item.id && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute inset-0 bg-lavender/30 mix-blend-multiply"
                    style={{ borderRadius: layoutStyle === 'neo' ? '9999px' : '0px' }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-1">
                  <item.icon size={16} />
                  <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-cinema-ink/10 hidden md:block" />

          {/* Desktop Layout Switcher */}
          <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-sm border border-cinema-ink/5">
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

          <div className="h-4 w-px bg-cinema-ink/10 hidden md:block" />

          {/* Desktop Actions + Mobile Shared Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAdd}
              className={`w-8 h-8 md:w-10 md:h-10 border border-cinema-ink flex items-center justify-center transition-colors group relative ${btnClasses[layoutStyle]} ${isAuthenticated ? 'bg-lavender' : 'hover:bg-lavender'}`}
            >
              <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              {!isAuthenticated && (
                <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={onSync}
                  className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 border border-cinema-ink items-center justify-center hover:bg-lavender transition-colors ${btnClasses[layoutStyle]}`}
                  title="同步豆瓣"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setView('settings')}
                  className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 border border-cinema-ink items-center justify-center hover:bg-lavender transition-colors ${btnClasses[layoutStyle]}`}
                  title="设置"
                >
                  <Settings size={14} />
                </button>
                <button 
                  onClick={onLogout}
                  className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 border border-cinema-ink items-center justify-center hover:bg-zinc-100 transition-colors ${btnClasses[layoutStyle]}`}
                  title="退出"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden flex w-8 h-8 border border-cinema-ink items-center justify-center transition-colors ${btnClasses[layoutStyle]} ${isMobileMenuOpen ? 'bg-cinema-ink text-zinc-50' : 'bg-transparent text-cinema-ink'}`}
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden border-t overflow-hidden ${navClasses[layoutStyle] === 'brutalist' ? 'border-cinema-ink bg-cinema-bg' : 'border-cinema-ink/10 bg-zinc-50/95 backdrop-blur-xl'}`}
          >
            <div className="flex flex-col px-4 py-6 space-y-8">
              {/* Mobile Main Views */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/40 ml-2">Views 视图</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'grid', label: '首页', icon: LayoutGrid },
                    { id: 'archive', label: '馆藏', icon: Film },
                    { id: 'watchlist', label: '待看', icon: ListFilter },
                    { id: 'timeline', label: '轴', icon: Calendar },
                    { id: 'summary', label: '总结', icon: BarChart3 },
                  ].map((item) => (
                    <button 
                      key={`mobile-${item.id}`}
                      onClick={() => {
                        setView(item.id as ViewMode);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 p-3 transition-colors ${btnClasses[layoutStyle]} ${currentView === item.id ? 'bg-cinema-ink text-zinc-50' : 'bg-transparent border border-cinema-ink/10 text-cinema-ink'}`}
                    >
                      <item.icon size={16} />
                      <span className="text-xs font-bold tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Layout Switcher */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/40 ml-2">Styles 款式</span>
                <div className="flex bg-zinc-100/50 p-1 rounded-sm border border-cinema-ink/5">
                  {(['swiss', 'brutalist', 'neo'] as const).map((style) => (
                    <button
                      key={`mobile-style-${style}`}
                      onClick={() => {
                        setLayoutStyle(style);
                      }}
                      className={`flex-1 text-[10px] font-bold uppercase tracking-tighter py-3 rounded-sm transition-all ${
                        layoutStyle === style 
                          ? 'bg-white text-cinema-ink shadow-sm' 
                          : 'text-cinema-ink/40 hover:text-cinema-ink/80'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Actions */}
              {isAuthenticated && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/40 ml-2">Management 管理</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSync();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-lavender border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <RefreshCw size={14} />
                      <span className="text-xs font-bold">同步豆瓣</span>
                    </button>
                    <button
                      onClick={() => {
                        setView('settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-zinc-200 border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <Settings size={14} />
                      <span className="text-xs font-bold">系统设置</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-zinc-200 border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <LogOut size={14} />
                      <span className="text-xs font-bold">退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
