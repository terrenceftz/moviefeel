import React from 'react';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { MovieSummary } from './GenreHeatmap';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  index: number;
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, index, layoutStyle = 'swiss' }) => {
  const cardClasses = {
    swiss: "bg-white border border-cinema-ink/5 p-4 hover:border-cinema-ink shadow-sm hover:shadow-xl",
    brutalist: "bg-white border-2 border-cinema-ink p-2 hover:-translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)]",
    neo: "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-4 border-0"
  };

  const imageClasses = {
    swiss: "rounded-none",
    brutalist: "rounded-none",
    neo: "rounded-xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 5) * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(movie)}
      className={`group cursor-pointer transition-all duration-500 overflow-hidden ${cardClasses[layoutStyle]}`}
    >
      <div className={`movie-poster-container mb-6 grayscale group-hover:grayscale-0 transition-all duration-1000 overflow-hidden relative ${imageClasses[layoutStyle]}`}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
          referrerPolicy="no-referrer"
        />
        {movie.isFavorite && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-cinema-ink z-10 shadow-sm">
            <Heart size={12} className="fill-current" />
          </div>
        )}
        {movie.isWatchlist && (
          <div className="absolute top-3 right-3 bg-lavender p-1.5 rounded-sm text-cinema-ink z-10 shadow-sm rotate-12">
            <Star size={12} className="fill-current" />
          </div>
        )}
        <div className="absolute inset-0 bg-cinema-ink opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className={`text-sm font-extrabold uppercase tracking-tight leading-none truncate group-hover:text-cinema-ink/60 transition-colors ${layoutStyle === 'neo' ? 'tracking-normal' : ''}`}>
            {movie.title}
          </h3>
          <span className="text-[10px] font-mono font-bold leading-none shrink-0 opacity-40">{movie.year}</span>
        </div>
        <div className={`h-px w-full transition-colors ${layoutStyle === 'brutalist' ? 'bg-cinema-ink' : 'bg-cinema-ink/5 group-hover:bg-cinema-ink/20'}`} />
        <div className="flex justify-between items-center">
          <p className="text-[9px] font-mono text-cinema-ink/40 uppercase tracking-widest truncate max-w-[70%]">
            Dir. {movie.director}
          </p>
          <div className="flex gap-1">
             {movie.moodTags?.slice(0, 1).map((tag, i) => (
               <span key={`${movie.id}-tag-${i}`} className={`text-[8px] font-bold px-1.5 py-0.5 uppercase ${
                 layoutStyle === 'neo' ? 'bg-lavender/20 text-cinema-ink/80 rounded-full px-2' : 'bg-lavender/50 text-cinema-ink/60'
               }`}>
                 {tag.replace('#', '')}
               </span>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CinemaHero: React.FC<{ movies: Movie[]; onClick: (m: Movie) => void; layoutStyle?: 'swiss' | 'brutalist' | 'neo' }> = ({ movies, onClick, layoutStyle = 'swiss' }) => {
  const [index, setIndex] = React.useState(0);
  const featuredMovies = movies.slice(0, 5); 

  const heroFrameClasses = {
    swiss: "aspect-[4/5] sm:aspect-[21/9] md:aspect-[2.4/1]",
    brutalist: "aspect-[21/9] border-4 border-cinema-ink shadow-[12px_12px_0px_#1A1A1A]",
    neo: "aspect-[16/10] sm:aspect-[21/9] md:aspect-[2.4/1] rounded-[2rem] overflow-hidden"
  };

  React.useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[index];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-cinema-ink flex items-center justify-center">
      {/* Immersive Panoramic Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
           key={`bg-${currentMovie.id}`}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 0.2, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
           className="absolute inset-0 pointer-events-none"
        >
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            className="w-full h-full object-cover blur-[80px] brightness-50"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cinema-ink via-transparent to-cinema-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-transparent to-cinema-ink" />
        </motion.div>
      </AnimatePresence>

      <div className="w-full relative z-10 flex flex-col items-center">
        {/* The "Cinemascope" Wide Container */}
        <div className="w-full relative py-12">
          <div className="max-w-[1920px] mx-auto relative group">
            
            {/* Artistic Floating Year Label */}
            <motion.div 
               key={`year-${currentMovie.id}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute top-0 left-12 md:left-24 -translate-y-full mb-4"
            >
              <div className="text-[10rem] font-black text-white/5 tracking-tighter mix-blend-overlay select-none">
                {currentMovie.year}
              </div>
            </motion.div>

            <div 
              className={`relative w-full overflow-hidden cursor-pointer shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] transition-all duration-700 ${heroFrameClasses[layoutStyle]}`}
              onClick={() => onClick(currentMovie)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`wide-img-${currentMovie.id}`}
                  initial={{ opacity: 0, filter: "brightness(0.3) blur(10px)" }}
                  animate={{ opacity: 1, filter: "brightness(0.8) blur(0px)" }}
                  exit={{ opacity: 0, filter: "brightness(0) blur(20px)" }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <img
                    src={currentMovie.backdropUrl || currentMovie.posterUrl}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover grayscale transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Avant-garde Interface Overlays */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-24 bg-gradient-to-t from-black/90 to-transparent">
                 <div className="overflow-hidden mb-2">
                    <motion.div
                      key={`idx-${currentMovie.id}`}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      className="text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-lavender"
                    >
                      Archive Entry Ref. 0{index + 1}
                    </motion.div>
                 </div>
                 <motion.div
                   key={`title-${currentMovie.id}`}
                   initial={{ opacity: 0, x: -50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 >
                   <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black leading-none text-white tracking-tighter italic">
                     {currentMovie.title}
                   </h2>
                 </motion.div>
              </div>

              {/* Red-dot aesthetic indicator */}
              <div className="absolute top-8 right-8 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Live_Feed</span>
              </div>
            </div>

            {/* Corner Bracket Decors */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/20 pointer-events-none" />
          </div>
        </div>

        {/* Global Stats Footer */}
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center border-t border-white/5 pt-8 md:pt-12">
           <div className="md:col-span-8 flex flex-wrap items-center gap-6 md:gap-12">
              <button 
                onClick={() => onClick(currentMovie)}
                className="group flex items-center space-x-4 h-12 md:h-16"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-lavender/30 flex items-center justify-center group-hover:bg-lavender group-hover:text-cinema-ink transition-all duration-500 relative">
                   <ArrowRight size={18} md:size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/30">Action</span>
                  <span className="text-xs md:text-sm font-black text-white hover:text-lavender transition-colors">Access Narrative</span>
                </div>
              </button>

              <div className="hidden md:block h-12 w-px bg-white/10" />

              <div className="space-y-1">
                 <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30">Auteur_Signature</p>
                 <p className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">{currentMovie.director}</p>
              </div>
           </div>

           <div className="md:col-span-4 flex justify-end space-x-2 overflow-hidden">
             {currentMovie.moodTags?.slice(0, 3).map((tag, i) => (
               <motion.span 
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8 + (i * 0.1) }}
                 className="text-[9px] font-black uppercase text-lavender/60 border border-lavender/20 px-4 py-2 hover:bg-lavender/10 cursor-default"
               >
                 {tag}
               </motion.span>
             ))}
           </div>
        </div>
      </div>

      {/* Progress Sync Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex">
        {featuredMovies.map((_, i) => (
          <div key={i} className="flex-1 h-full bg-white/5 relative border-r border-black/20 last:border-0">
             {i === index && (
               <motion.div 
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ duration: 10, ease: "linear" }}
                 className="absolute inset-0 bg-lavender origin-left"
               />
             )}
          </div>
        ))}
      </div>

      {/* Vertical Navigation Nodes */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
        {featuredMovies.map((_, i) => (
           <button
             key={i}
             onClick={() => setIndex(i)}
             className="group flex items-center justify-end"
           >
             <div className={`w-1 transition-all duration-700 ${i === index ? 'h-16 bg-lavender' : 'h-6 bg-white/10 group-hover:bg-white/30'}`} />
           </button>
        ))}
      </div>
    </section>
  );
};

interface GridGalleryProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
  watchlistCount?: number;
  hideHero?: boolean;
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const GridGallery: React.FC<GridGalleryProps> = ({ 
  movies, onSelect, watchlistCount = 0, hideHero = false, layoutStyle = 'swiss' 
}) => {
  const favoriteMovies = movies.filter(m => m.isFavorite);

  return (
    <div className="space-y-0">
      {!hideHero && <CinemaHero movies={movies} onClick={onSelect} layoutStyle={layoutStyle} />}

      {favoriteMovies.length > 0 && (
        <section className="px-4 md:px-12 py-20 md:py-32 space-y-12 md:space-y-24 bg-white relative overflow-hidden">
          {/* Decorative Background Grid */}
          <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 pointer-events-none opacity-[0.03]">
             {Array.from({ length: 12 }).map((_, i) => (
               <div key={i} className="border-r border-cinema-ink" />
             ))}
          </div>

          <div className="max-w-7xl mx-auto space-y-12 md:space-y-24 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-cinema-ink pb-8 md:pb-12 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-4">
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-30">Selection Focus</span>
                 <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
                   特别关注 <span className="serif-italic lowercase opacity-40 ml-4 hidden md:inline">The Core Selection</span>
                 </h2>
              </div>
              <div className="text-3xl md:text-4xl font-mono font-black flex items-baseline gap-2 self-end">
                <span className="text-xs md:text-sm opacity-20 uppercase font-black tracking-widest">Qty.</span>
                0{favoriteMovies.length}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-12">
              {favoriteMovies.map((movie, idx) => (
                <MovieCard key={`fav-${movie.id}-${idx}`} movie={movie} onClick={onSelect} index={idx} layoutStyle={layoutStyle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {watchlistCount > 0 && !hideHero && (
        <section className="px-4 md:px-12 py-12 md:py-20 bg-lavender/5">
           <div className="max-w-7xl mx-auto flex items-center justify-between border-cinema-ink/10 border-y py-8">
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 bg-cinema-ink text-lavender flex items-center justify-center font-black text-xl">
                   W
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase">待看模块 Watchlist</h3>
                    <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">You have {watchlistCount} cinematic explorations planned.</p>
                 </div>
              </div>
              <button 
                onClick={() => {
                  const event = new CustomEvent('set-view', { detail: 'watchlist' });
                  window.dispatchEvent(event);
                }}
                className="group flex items-center space-x-4 bg-cinema-ink text-white px-6 py-3 hover:bg-lavender hover:text-cinema-ink transition-all"
              >
                <span className="text-xs font-black uppercase tracking-widest">进入模块</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </section>
      )}

      {/* Viewing Summary Section */}
      {!hideHero && <MovieSummary movies={movies} />}

      <section className="px-4 md:px-12 py-20 md:py-32 space-y-12 md:space-y-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-cinema-ink pb-8 md:pb-12 gap-6 md:gap-8">
            <div className="space-y-2 md:space-y-4">
               <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-30">Archive Snapshot</span>
               <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
                 {hideHero ? '全部馆藏' : '最近更新'} 
                 <span className="serif-italic lowercase opacity-40 ml-4 hidden md:inline">{hideHero ? 'Full Collection' : 'Recent Entries'}</span>
               </h2>
            </div>
            <div className="text-3xl md:text-4xl font-mono font-black flex items-baseline gap-2 self-end">
               <span className="text-xs md:text-sm opacity-20 uppercase font-black tracking-widest">{hideHero ? 'Total' : 'Latest'}</span>
               {movies.length}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-12">
            {movies.map((movie, idx) => (
              <MovieCard key={`${movie.id}-${idx}`} movie={movie} onClick={onSelect} index={idx} layoutStyle={layoutStyle} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
