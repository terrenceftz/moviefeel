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
    swiss: "bg-white border border-cinema-ink/5 p-3 hover:border-cinema-ink shadow-sm hover:shadow-xl",
    brutalist: "bg-white border-2 border-cinema-ink p-1.5 hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_rgba(0,0,0,1)]",
    neo: "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-xl p-3 border-0"
  };

  const imageClasses = {
    swiss: "rounded-none",
    brutalist: "rounded-none",
    neo: "rounded-lg"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 10) * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(movie)}
      className={`group cursor-pointer transition-all duration-500 overflow-hidden ${cardClasses[layoutStyle]}`}
    >
      <div className={`movie-poster-container mb-3 grayscale group-hover:grayscale-0 transition-all duration-1000 overflow-hidden relative ${imageClasses[layoutStyle]}`}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
          referrerPolicy="no-referrer"
        />
        {movie.isFavorite && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-full text-cinema-ink z-10 shadow-sm transition-transform group-hover:scale-110">
            <Heart size={10} className="fill-current" />
          </div>
        )}
        <div className="absolute inset-0 bg-cinema-ink opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline gap-1">
          <h3 className={`text-[11px] font-black uppercase tracking-tight leading-tight truncate group-hover:text-cinema-ink/80 transition-colors ${layoutStyle === 'neo' ? 'tracking-normal' : ''}`}>
            {movie.title}
          </h3>
          <span className="text-[8px] font-mono font-bold leading-tight shrink-0 opacity-30">{movie.year}</span>
        </div>
        <div className={`h-[1px] w-full transition-colors ${layoutStyle === 'brutalist' ? 'bg-cinema-ink' : 'bg-cinema-ink/5 group-hover:bg-cinema-ink/10'}`} />
        <div className="flex justify-between items-center">
          <p className="text-[7px] md:text-[8px] font-mono text-cinema-ink/30 uppercase tracking-widest truncate max-w-[65%]">
            {movie.director}
          </p>
          <div className="flex gap-1" key={`card-tags-container-${movie.id}`}>
            {movie.moodTags?.slice(0, 1).map((tag, i) => (
              <span key={`card-tag-${movie.id}-${i}`} className={`text-[7px] font-bold px-1 py-0.5 border uppercase ${
                layoutStyle === 'neo' ? 'bg-lavender/10 border-lavender/20 text-cinema-ink/60 rounded-full px-1.5' : 'bg-transparent border-cinema-ink/10 text-cinema-ink/40'
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
    <section className={`relative w-full h-[80vh] md:h-screen overflow-hidden flex items-center justify-center transition-all duration-1000 ${
      layoutStyle === 'brutalist' ? 'bg-[#1A1A1A]' : 
      layoutStyle === 'neo' ? 'bg-zinc-100/30' : 'bg-cinema-ink'
    }`}>
      {/* Dynamic Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
           key={`bg-${currentMovie.id}-${layoutStyle}`}
           initial={{ opacity: 0 }}
           animate={{ opacity: layoutStyle === 'brutalist' ? 0.4 : layoutStyle === 'neo' ? 0.3 : 0.2 }}
           exit={{ opacity: 0 }}
           className="absolute inset-0 pointer-events-none"
        >
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            className={`w-full h-full object-cover ${layoutStyle === 'neo' ? 'blur-[120px]' : 'blur-[80px] brightness-50'}`}
            alt=""
            referrerPolicy="no-referrer"
          />
          {layoutStyle !== 'neo' && (
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-ink via-transparent to-cinema-ink" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className={`w-full h-full relative z-10 flex flex-col items-center justify-center px-4 md:px-12`}>
        
        {/* Layout 1: SWISS (Modernist, Clean) */}
        {layoutStyle === 'swiss' && (
          <div className="w-full max-w-[1920px] space-y-12">
            <div className="relative group aspect-[16/9] md:aspect-[21/9] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] cursor-pointer" onClick={() => onClick(currentMovie)}>
               <AnimatePresence mode="wait">
                 <motion.img
                   key={`swiss-hero-${currentMovie.id}`}
                   initial={{ scale: 1.1, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.95, opacity: 0 }}
                   transition={{ duration: 1.5 }}
                   src={currentMovie.backdropUrl || currentMovie.posterUrl}
                   className="w-full h-full object-cover grayscale transition-all duration-[2000ms] group-hover:grayscale-0"
                   referrerPolicy="no-referrer"
                 />
               </AnimatePresence>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 md:p-20">
                  <h2 className="text-5xl md:text-[8rem] lg:text-[10rem] font-black leading-none text-white tracking-tighter italic">
                    {currentMovie.title}
                  </h2>
               </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-8 gap-8">
               <div className="space-y-1">
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-lavender">Archive No. 0{index + 1}</span>
                 <p className="text-2xl font-black text-white italic">{currentMovie.director}, {currentMovie.year}</p>
               </div>
               <div className="flex gap-4" key={`hero-tags-container-${currentMovie.id}`}>
                 {currentMovie.moodTags?.slice(0, 3).map((tag, i) => (
                   <span key={`hero-tag-${currentMovie.id}-${i}`} className="text-[10px] font-bold uppercase text-white/40 border border-white/10 px-4 py-2">{tag}</span>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Layout 2: BRUTALIST (Grid, Raw, Bold) */}
        {layoutStyle === 'brutalist' && (
          <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl border-4 border-cinema-ink shadow-[16px_16px_0px_#1A1A1A] bg-white overflow-hidden">
               <div className="md:col-span-7 aspect-video md:aspect-auto relative group overflow-hidden cursor-pointer" onClick={() => onClick(currentMovie)}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`brutal-hero-${currentMovie.id}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      src={currentMovie.backdropUrl || currentMovie.posterUrl}
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  <div className="absolute top-0 left-0 bg-cinema-ink text-white p-4 font-mono font-black text-3xl">0{index + 1}</div>
               </div>
               <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-lavender border-l-4 border-cinema-ink">
                  <div className="space-y-6">
                    <h2 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight break-words">
                      {currentMovie.title}
                    </h2>
                    <div className="text-xl font-mono font-bold uppercase underline">Directed by {currentMovie.director}</div>
                  </div>
                  <button 
                    onClick={() => onClick(currentMovie)}
                    className="mt-12 w-full py-6 bg-cinema-ink text-white font-mono font-black uppercase text-2xl hover:bg-white hover:text-cinema-ink transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_rgba(0,0,0,0.3)]"
                  >
                    Entry Detail _
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Layout 3: NEO (Soft, Glass, Elevated) */}
        {layoutStyle === 'neo' && (
          <motion.div 
            key={`neo-hero-${currentMovie.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16"
          >
            <div 
              className="w-full md:w-[45%] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] cursor-pointer group"
              onClick={() => onClick(currentMovie)}
            >
              <img 
                src={currentMovie.posterUrl} 
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-[55%] space-y-10 text-center md:text-left">
               <div className="space-y-4">
                 <motion.span 
                   className="inline-block px-4 py-2 bg-lavender/10 text-lavender rounded-full text-xs font-black uppercase tracking-widest"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                 >
                   Featured Vision
                 </motion.span>
                 <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-tight text-cinema-ink">
                   {currentMovie.title}
                 </h2>
                 <p className="text-2xl font-medium text-cinema-ink/40 tracking-tight">{currentMovie.director} / {currentMovie.year}</p>
               </div>
               <button 
                 onClick={() => onClick(currentMovie)}
                 className="inline-flex items-center space-x-4 bg-cinema-ink text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all"
               >
                 <span>Explore Detail</span>
                 <ArrowRight />
               </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* Hero Stats (Neo Style gets unique layout) */}
      {layoutStyle !== 'neo' && (
        <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center space-x-8">
           {featuredMovies.map((_, i) => (
             <button 
               key={`hero-nav-${i}-${layoutStyle}`} 
               onClick={() => setIndex(i)}
               className={`transition-all duration-500 ${
                 layoutStyle === 'brutalist' 
                   ? `w-4 h-4 border-2 border-cinema-ink ${i === index ? 'bg-cinema-ink' : 'hover:bg-cinema-ink/20'}`
                   : `w-1 ${i === index ? 'h-16 bg-lavender' : 'h-6 bg-white/10 hover:bg-white/30'}`
               }`}
             />
           ))}
        </div>
      )}
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

  const containerClasses = {
    swiss: "space-y-0",
    brutalist: "space-y-1 bg-cinema-ink",
    neo: "space-y-12 px-4 md:px-8 py-8"
  };

  const sectionClasses = {
    swiss: "bg-white border-y border-cinema-ink/5",
    brutalist: "bg-white border-y-4 border-cinema-ink",
    neo: "bg-white/60 backdrop-blur-2xl rounded-[4rem] border border-white/50 shadow-sm"
  };

  return (
    <div className={`transition-all duration-1000 ${containerClasses[layoutStyle]}`}>
      {!hideHero && <CinemaHero movies={movies} onClick={onSelect} layoutStyle={layoutStyle} />}

      {favoriteMovies.length > 0 && (
        <section className={`px-4 md:px-12 py-20 md:py-32 space-y-12 md:space-y-24 relative overflow-hidden transition-all duration-700 ${sectionClasses[layoutStyle]}`}>
          {layoutStyle === 'neo' && (
            <div className="absolute top-0 right-0 w-96 h-96 bg-lavender/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          )}
          
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-24 relative z-10">
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 ${
              layoutStyle === 'brutalist' ? 'border-b-8 border-cinema-ink pb-8' : 
              layoutStyle === 'swiss' ? 'border-b-2 border-cinema-ink pb-8' : ''
            }`}>
              <div className="space-y-2 md:space-y-4">
                 <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.6em] ${
                   layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white px-2 py-1' : 'opacity-30'
                 }`}>
                   Personal Choice
                 </span>
                 <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
                   心动收藏 <span className="serif-italic lowercase opacity-40 ml-4 hidden md:inline">Favorites</span>
                 </h2>
              </div>
              <div className="text-3xl md:text-4xl font-mono font-black border-l border-cinema-ink/10 pl-6 hidden md:block">
                 {favoriteMovies.length < 10 ? `0${favoriteMovies.length}` : favoriteMovies.length}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-20" key="fav-grid">
              {favoriteMovies.map((movie, idx) => (
                <MovieCard key={`fav-card-${movie.id}-${idx}`} movie={movie} onClick={onSelect} index={idx} layoutStyle={layoutStyle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {watchlistCount > 0 && !hideHero && (
        <section className={`px-4 md:px-12 py-16 md:py-24 transition-all duration-700 ${
          layoutStyle === 'neo' ? 'bg-lavender/5 rounded-[3rem] mx-4 md:mx-0' : 
          layoutStyle === 'brutalist' ? 'bg-yellow-400 border-y-4 border-cinema-ink' : 
          'bg-lavender/5 border-y border-cinema-ink/5'
        }`}>
           <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-6 gap-8`}>
              <div className="flex items-center space-x-6">
                 <div className={`w-14 h-14 flex items-center justify-center font-black text-xl shadow-xl ${
                   layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white border-2 border-cinema-ink shadow-[8px_8px_0px_white]' : 
                   layoutStyle === 'neo' ? 'bg-white text-lavender rounded-2xl' :
                   'bg-cinema-ink text-lavender'
                 }`}>
                   W
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight">待看模块 Watchlist</h3>
                    <p className={`text-[9px] font-mono uppercase tracking-[0.3em] ${layoutStyle === 'brutalist' ? 'text-cinema-ink' : 'opacity-40'}`}>
                      {watchlistCount} cinematic explorations planned.
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => {
                  const event = new CustomEvent('set-view', { detail: 'watchlist' });
                  window.dispatchEvent(event);
                }}
                className={`group flex items-center space-x-4 px-10 py-5 transition-all text-xs font-black uppercase tracking-widest shadow-xl ${
                  layoutStyle === 'neo' ? 'bg-cinema-ink text-white rounded-full hover:shadow-lavender/30' : 
                  layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white border-4 border-cinema-ink hover:bg-white hover:text-cinema-ink shadow-[8px_8px_0px_rgba(0,0,0,0.2)]' : 
                  'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
                }`}
              >
                <span>进入模块 View List</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </section>
      )}

      {/* Viewing Summary Section */}
      {!hideHero && (
        <section className={`transition-all duration-700 ${layoutStyle === 'neo' ? 'px-0' : ''}`}>
           <MovieSummary movies={movies} />
        </section>
      )}

      <section className={`px-4 md:px-12 py-24 md:py-40 space-y-20 md:space-y-32 transition-all duration-700 ${
        layoutStyle === 'brutalist' ? 'bg-zinc-100 border-y-4 border-cinema-ink' : 
        layoutStyle === 'neo' ? 'bg-white/60 backdrop-blur-2xl rounded-[4rem] border border-white/50 shadow-sm' : 
        'bg-zinc-50 border-t border-cinema-ink/5'
      }`}>
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-32 relative z-10">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 ${
            layoutStyle === 'brutalist' ? 'border-b-8 border-cinema-ink pb-10' : 
            layoutStyle === 'swiss' ? 'border-b-2 border-cinema-ink pb-10' : ''
          }`}>
            <div className="space-y-3 md:space-y-5">
               <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.6em] ${
                 layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white px-2 py-1' : 'opacity-30'
               }`}>
                 Archive Snapshot
               </span>
               <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
                 {hideHero ? '全部馆藏' : '最近更新'} 
                 <span className="serif-italic lowercase opacity-40 ml-4 hidden md:inline">{hideHero ? 'Full Collection' : 'Recent Entries'}</span>
               </h2>
            </div>
            <div className="text-3xl md:text-5xl font-mono font-black flex items-baseline gap-2 self-end">
               <span className="text-xs md:text-sm opacity-20 uppercase font-black tracking-widest">{hideHero ? 'Total' : 'Latest'}</span>
               {movies.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-20" key="main-grid">
            {movies.map((movie, idx) => (
              <MovieCard key={`main-card-${movie.id}-${idx}`} movie={movie} onClick={onSelect} index={idx} layoutStyle={layoutStyle} />
            ))}
          </div>
        </div>
      </section>
    </div>

  );
};
