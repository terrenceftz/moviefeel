import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';
import { Calendar, Clock, Star, ArrowRight, Play, LayoutGrid } from 'lucide-react';

interface WatchlistViewProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ movies, onSelect, layoutStyle = 'swiss' }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-dashed border-cinema-ink/20 rounded-full animate-spin-slow" />
          <LayoutGrid className="absolute inset-0 m-auto text-cinema-ink/20" size={32} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter">清单空空如也</h3>
          <p className="text-xs font-mono uppercase opacity-40">Your futuristic watchlist is currently a void.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-40">
      {/* Background Dynamic Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {hoveredId ? (
            <motion.div
              key={hoveredId}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img 
                src={movies.find(m => m.id === hoveredId)?.posterUrl} 
                className="w-full h-full object-cover blur-[100px] saturate-150"
                alt=""
              />
            </motion.div>
          ) : (
            <div className={`absolute inset-0 transition-colors duration-1000 ${
              layoutStyle === 'brutalist' ? 'bg-yellow-400/5' : 'bg-lavender/5'
            }`} />
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        {/* Header Section */}
        <header className="py-20 md:py-32 flex flex-col items-start space-y-6">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-[10px] font-mono font-black uppercase tracking-[0.5em] px-4 py-1 border ${
              layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white border-cinema-ink' : 'border-cinema-ink/20'
            }`}
          >
            Mission: Cinematic Intake
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none"
          >
            待看清单 <span className="serif-italic lowercase opacity-20 block md:inline md:ml-6">watchlist</span>
          </motion.h1>
        </header>

        {/* Film Strip List */}
        <div className="flex flex-col">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(movie)}
              className={`group relative flex flex-col md:flex-row items-center py-12 md:py-24 border-b border-cinema-ink/10 cursor-pointer transition-all hover:bg-white/40 ${
                layoutStyle === 'brutalist' ? 'hover:bg-yellow-400' : ''
              }`}
            >
              {/* Index & Background Text */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-6 md:pr-12 relative z-10 w-full">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-mono font-bold opacity-30"># {movie.year}</span>
                  <div className="h-[2px] w-12 bg-lavender" />
                  <div className="flex gap-2">
                    {movie.genre?.slice(0, 2).map((g, i) => (
                      <span key={i} className="text-[9px] font-black uppercase border border-cinema-ink/10 px-2 py-0.5">{g}</span>
                    ))}
                  </div>
                </div>

                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight group-hover:pl-4 transition-all duration-500">
                  {movie.title}
                </h2>

                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase opacity-60">
                    <Calendar size={12} />
                    <span>Added: {movie.viewingDate ? new Date(movie.viewingDate).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase opacity-60">
                    <Clock size={12} />
                    <span>Priority: HIGH</span>
                  </div>
                  <div className="flex items-center space-x-2 text-lavender font-bold">
                    <Star size={12} className="fill-current" />
                    <span className="text-xs uppercase">{movie.tmdbRating}/10</span>
                  </div>
                </div>
              </div>

              {/* Interaction Component */}
              <div className="mt-8 md:mt-0 flex items-center justify-center md:justify-end md:w-1/3 relative">
                <motion.div 
                  className="relative overflow-hidden w-40 md:w-64 aspect-[2/3] shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-700"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-cinema-ink/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-white p-4 rounded-full text-cinema-ink">
                      <Play size={20} className="fill-current ml-1" />
                    </div>
                  </div>
                </motion.div>

                {/* Ticket Aesthetic Element */}
                <div className={`absolute -right-4 -bottom-4 md:right-0 md:bottom-0 p-4 md:p-8 flex flex-col items-center justify-center transition-all duration-500 group-hover:translate-x-2 ${
                  layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white' : 'bg-white shadow-xl text-cinema-ink'
                }`}>
                  <span className="text-[8px] font-mono font-black vertical-rl rotate-180 uppercase tracking-widest border-b border-current pb-2 mb-2">Reserved</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
