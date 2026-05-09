import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Movie } from '../types';
import { ArrowDown, Heart, Star, Calendar } from 'lucide-react';

interface ArchiveParallaxViewProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

const MovieParallaxItem: React.FC<{ 
  movie: Movie; 
  index: number; 
  onSelect: (movie: Movie) => void;
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
}> = ({ movie, index, onSelect, layoutStyle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative py-20 px-4 group"
      onClick={() => onSelect(movie)}
    >
      <motion.div 
        style={{ opacity, scale }}
        className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center cursor-pointer"
      >
        {/* Poster with Parallax Background */}
        <div className="md:col-span-12 relative flex justify-center">
            {/* Background Title - Parallax layer 1 */}
            <motion.div 
                style={{ y: springY1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
                <h3 className="text-[15vw] md:text-[18vw] font-black uppercase tracking-tighter opacity-5 whitespace-nowrap select-none overflow-hidden text-center w-full">
                    {movie.title}
                </h3>
            </motion.div>

            {/* Poster - Parallax layer 2 */}
            <motion.div 
                className="relative z-10 w-full max-w-2xl group-hover:scale-[1.02] transition-transform duration-700"
                style={{ y: y2 }}
            >
                <div className={`overflow-hidden shadow-2xl relative ${
                    layoutStyle === 'neo' ? 'rounded-[2rem]' : 
                    layoutStyle === 'brutalist' ? 'border-4 border-cinema-ink shadow-[20px_20px_0_rgba(0,0,0,1)]' :
                    'border border-white/10'
                }`}>
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full aspect-[16/10] md:aspect-[21/9] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-ink/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Meta overlay */}
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="space-y-2">
                           <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-lavender">Film Plate 0{index + 1}</span>
                           <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{movie.title}</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                           {movie.isFavorite && <Heart size={20} className="text-red-500 fill-current" />}
                           <div className="bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20">
                             <span className="text-white font-black text-lg">{movie.tmdbRating}</span>
                           </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Content Section - Offset to the side */}
        <div className={`md:col-span-12 flex justify-end md:pr-20 -mt-12 md:-mt-24 relative z-20`}>
            <motion.div 
                className={`max-w-md p-8 md:p-12 shadow-2xl ${
                    layoutStyle === 'neo' ? 'bg-white/80 backdrop-blur-xl rounded-[2rem]' : 
                    layoutStyle === 'brutalist' ? 'bg-yellow-400 border-4 border-cinema-ink shadow-[12px_12px_0_rgba(0,0,0,1)]' :
                    'bg-white'
                }`}
            >
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span>{movie.year}</span>
                        <div className="w-8 h-px bg-current" />
                        <span>{movie.director}</span>
                    </div>
                    <p className={`text-sm md:text-base leading-relaxed ${layoutStyle === 'brutalist' ? 'font-mono' : 'font-serif italic'}`}>
                        "{movie.quote || movie.overview}"
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                        {movie.genre?.map((g, i) => (
                            <span key={i} className="text-[8px] font-black uppercase border border-current/20 px-2 py-1 opacity-60">{g}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const ArchiveParallaxView: React.FC<ArchiveParallaxViewProps> = ({ movies, onSelect, layoutStyle = 'swiss' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (movies.length === 0) return null;

  const featuredMovies = movies.slice(0, 10); // Use a subset for performance if needed
  const remainingMovies = movies.slice(10);

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed left-0 top-0 bottom-0 w-1 bg-lavender z-50 origin-top"
        style={{ scaleY: useScroll().scrollYProgress }}
      />

      {/* Hero Entrance */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-12 bg-zinc-50 relative z-10">
          <div className="space-y-4">
              <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] font-black uppercase tracking-[1em] opacity-30 block"
              >
                  Preservation Archive
              </motion.span>
              <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none"
              >
                  馆藏录 <span className="serif-italic lowercase opacity-20 block md:inline md:ml-10">full archive</span>
              </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center space-y-4 pt-12"
          >
              <span className="text-[10px] font-mono animate-pulse uppercase tracking-widest">Scroll to Traverse Memory</span>
              <ArrowDown size={20} className="animate-bounce opacity-30" />
          </motion.div>
      </section>

      {/* Parallax List */}
      <div className="space-y-0">
        {featuredMovies.map((movie, index) => (
          <MovieParallaxItem 
            key={movie.id} 
            movie={movie} 
            index={index} 
            onSelect={onSelect} 
            layoutStyle={layoutStyle}
          />
        ))}
      </div>

      {/* Grid for the rest or as a summary */}
      {remainingMovies.length > 0 && (
          <section className="py-20 md:py-40 bg-zinc-100">
              <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-20">
                  <div className="text-center">
                      <h3 className="text-4xl font-black uppercase tracking-widest opacity-20 italic">Deep Archive Storage</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                      {remainingMovies.map((movie, idx) => (
                          <motion.div
                            key={movie.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            onClick={() => onSelect(movie)}
                            className="group cursor-pointer space-y-4"
                          >
                              <div className="aspect-[2/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                  <img src={movie.posterUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                              </div>
                              <h4 className="text-[10px] font-black uppercase tracking-tight truncate">{movie.title}</h4>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      )}
    </div>
  );
};
