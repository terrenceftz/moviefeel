import React from 'react';
import { Movie } from '../types';
import { motion } from 'motion/react';

interface TimelineProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ movies, onSelect }) => {
  const sortedMovies = [...movies].sort((a, b) => 
    new Date(b.viewingDate).getTime() - new Date(a.viewingDate).getTime()
  );

  return (
    <div className="pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="relative border-l border-cinema-ink/10 pl-6 md:pl-8 space-y-12 md:space-y-16">
        {sortedMovies.map((movie, idx) => (
          <motion.div
            key={`${movie.id}-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 10) * 0.1 }}
            className="relative"
            onClick={() => onSelect(movie)}
          >
            {/* Dot */}
            <div className="absolute -left-[31px] md:-left-[41px] top-2 w-4 h-4 md:w-5 md:h-5 bg-cinema-ink border-4 border-white rounded-full group-hover:scale-125 transition-transform" />
            
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-12 cursor-pointer group">
               <div className="w-20 md:w-24 shrink-0">
                  <span className="text-[10px] md:text-xs font-mono font-bold opacity-60">{movie.viewingDate}</span>
               </div>
               
               <div className="flex items-center space-x-4 md:space-x-6">
                 <div className="w-12 md:w-16 aspect-[2/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-cinema-ink/5">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                 </div>
                 <div className="flex-1">
                    <h2 className="text-xl md:text-2xl leading-none transition-colors group-hover:text-cinema-ink/60 font-black uppercase tracking-tight">{movie.title}</h2>
                    <p className="text-[9px] md:text-[10px] font-mono opacity-40 uppercase tracking-widest mt-1">
                      {movie.director} • {movie.year}
                    </p>
                 </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
