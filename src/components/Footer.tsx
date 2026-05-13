import React, { useState, useEffect } from 'react';
import { Film, Github, Mail, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { getSiteName } from '../services/configService';

interface FooterProps {
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const Footer: React.FC<FooterProps> = ({ layoutStyle = 'swiss' }) => {
  const [siteName, setSiteNameState] = useState(getSiteName());

  useEffect(() => {
    const handler = (e: Event) => setSiteNameState((e as CustomEvent).detail);
    window.addEventListener('site-name-changed', handler);
    return () => window.removeEventListener('site-name-changed', handler);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerClasses = {
    swiss: "bg-cinema-ink text-white border-t border-white/5",
    brutalist: "bg-white text-cinema-ink border-t-8 border-cinema-ink",
    neo: "bg-white/40 backdrop-blur-xl border-t border-white/20"
  };

  return (
    <footer className={`py-12 md:py-24 px-4 md:px-12 relative overflow-hidden transition-all duration-700 ${footerClasses[layoutStyle]}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 relative z-10">
        
        {/* Brand Section */}
        <div className="md:col-span-5 space-y-8">
          <div className="flex items-center space-x-3">
             <div className={`w-12 h-12 flex items-center justify-center font-black text-xl ${
               layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white' : 'bg-lavender text-cinema-ink'
             }`}>
               C
             </div>
             <span className="text-2xl font-black uppercase tracking-tighter">{siteName}</span>
          </div>
          <p className={`text-lg md:text-xl font-medium leading-relaxed opacity-60 ${layoutStyle === 'brutalist' ? 'font-mono uppercase' : 'font-serif italic'}`}>
            一个私人影视记忆库，旨在捕捉和保存每一个在大银幕前怦然心动的瞬间。在这里，电影不仅是影像，更是时间的切片。
          </p>
        </div>

        {/* Links Section */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Quick Access</h4>
          <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
            <li><a href="#" className="hover:text-lavender transition-colors">影库预览 Home</a></li>
            <li><a href="#" className="hover:text-lavender transition-colors">个人收藏 Favorites</a></li>
            <li><a href="#" className="hover:text-lavender transition-colors">时轴回顾 Timeline</a></li>
            <li><a href="#" className="hover:text-lavender transition-colors">管理入口 Database</a></li>
          </ul>
        </div>

        {/* External Section */}
        <div className="md:col-span-4 space-y-8">
           <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Connect</h4>
             <div className="flex space-x-6">
               <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Github size={20} /></a>
               <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Film size={20} /></a>
               <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Mail size={20} /></a>
             </div>
           </div>
           
           <button 
             onClick={scrollToTop}
             className={`flex items-center space-x-4 px-8 py-4 transition-all text-[10px] font-black uppercase tracking-[0.2em] ${
               layoutStyle === 'neo' ? 'bg-cinema-ink text-white rounded-full shadow-xl' : 
               layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white border-2 border-cinema-ink' : 
               'bg-white text-cinema-ink border border-white/10'
             }`}
           >
             <span>Back to Top</span>
             <ArrowUp size={14} />
           </button>
        </div>

      </div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-20 -left-20 text-[20rem] font-black uppercase tracking-tighter opacity-[0.02] pointer-events-none select-none italic whitespace-nowrap">
        CINEMATIC MEMORY
      </div>

      <div className="max-w-7xl mx-auto pt-12 md:pt-24 mt-12 md:mt-24 border-t border-current opacity-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono uppercase tracking-[0.3em]">
        <span>© 2024 Cinema.Archive — Digital Preservation Unit</span>
        <span>Powered by TMDB & Cinema Archive</span>
      </div>
    </footer>
  );
};
