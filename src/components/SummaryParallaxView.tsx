import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Movie } from '../types';
import { ArrowDown, Film, Star, Clock, Trophy, Quote } from 'lucide-react';

interface SummaryParallaxViewProps {
  movies: Movie[];
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const SummaryParallaxView: React.FC<SummaryParallaxViewProps> = ({ movies, layoutStyle = 'swiss' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax Values
  const avatarY = useTransform(scrollYProgress, [0, 0.2], [40, -100]);
  const avatarScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const avatarOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 0.3, 0]);
  
  const textY = useTransform(scrollYProgress, [0, 0.2], [100, -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Derived Statistics
  const stats = useMemo(() => {
    const totalCount = movies.length;
    const totalRuntime = movies.reduce((acc, m) => acc + (m.runtime || 120), 0); // fallback 120min
    
    const directors: Record<string, number> = {};
    const genres: Record<string, number> = {};
    const castRecord: Record<string, number> = {};
    
    let totalScore = 0;
    
    movies.forEach(m => {
      if (m.director) {
        directors[m.director] = (directors[m.director] || 0) + 1;
      }
      m.genre?.forEach(g => {
        genres[g] = (genres[g] || 0) + 1;
      });
      m.cast?.forEach(c => {
         castRecord[c] = (castRecord[c] || 0) + 1;
      });
      totalScore += m.userRating;
    });

    const topDirector = Object.entries(directors).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];
    const topActor = Object.entries(castRecord).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];
    
    const favorites = movies.filter(m => m.isFavorite).sort((a, b) => b.userRating - a.userRating);

    const longestReviewMovie = movies
      .filter(m => m.userComment && m.userComment.trim().length > 0)
      .sort((a, b) => (b.userComment?.length || 0) - (a.userComment?.length || 0))[0];

    return {
      totalCount,
      totalHours: Math.round(totalRuntime / 60),
      avgScore: movies.length ? (totalScore / movies.length).toFixed(1) : '0.0',
      topDirector: topDirector[0],
      topGenre: topGenre[0],
      topActor: topActor[0],
      favorites: favorites.slice(0, 3),
      longestReview: longestReviewMovie
        ? { title: longestReviewMovie.title, count: longestReviewMovie.userComment!.length }
        : null
    };
  }, [movies]);

  if (movies.length === 0) return null;

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-zinc-50 overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div 
        className={`fixed top-0 left-0 w-full h-1 z-50 origin-left ${layoutStyle === 'brutalist' ? 'bg-cinema-ink' : 'bg-lavender'}`}
        style={{ scaleX: scrollYProgress }}
      />

      {/* Intro Hero Section - Sticky Parallax */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Avatar */}
        <motion.div 
           style={{ y: avatarY, scale: avatarScale, opacity: avatarOpacity }}
           className="absolute inset-0 flex items-center justify-center p-4 md:p-0"
        >
           <div className={`relative w-full max-w-2xl aspect-[3/4] md:aspect-[4/5] overflow-hidden ${
             layoutStyle === 'neo' ? 'rounded-[4rem]' : 
             layoutStyle === 'brutalist' ? 'border-8 border-cinema-ink shadow-[24px_24px_0_var(--color-cinema-ink)]' :
             'shadow-2xl'
           }`}>
               <img 
                 src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80" 
                 alt="Profile" 
                 className="w-full h-full object-cover grayscale brightness-75 mix-blend-multiply"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent opacity-80" />
           </div>
        </motion.div>

        {/* Foreground Content */}
        <motion.div 
           style={{ y: textY, opacity: textOpacity }}
           className="relative z-10 flex flex-col items-center text-center space-y-8 px-4"
        >
           <span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.5em] md:tracking-[1em] text-cinema-ink/60 border border-cinema-ink/20 px-6 py-2 backdrop-blur-md">
             Personal Visual Archive
           </span>
           <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none text-cinema-ink mix-blend-difference drop-shadow-2xl">
              观影品鉴 <br/> 
              <span className="text-4xl md:text-[5rem] italic serif-italic normal-case opacity-40">Taste & Summary</span>
           </h1>
           <div className="flex flex-col items-center pt-12 animate-pulse text-cinema-ink/40">
             <span className="text-[10px] font-mono uppercase tracking-widest mb-4">Scroll Down</span>
             <ArrowDown size={24} />
           </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className={`relative z-20 max-w-7xl mx-auto px-4 md:px-12 py-32 space-y-32 ${layoutStyle === 'brutalist' ? 'font-mono' : ''}`}>
         
         {/* Big Numbers */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
               { label: 'Total Films', value: stats.totalCount, icon: <Film size={32} /> },
               { label: 'Hours Watched', value: stats.totalHours, icon: <Clock size={32} /> },
               { label: 'Avg Rating', value: stats.avgScore, icon: <Star size={32} /> },
            ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ delay: i * 0.1, duration: 0.8 }}
                 className={`flex flex-col p-10 md:p-16 space-y-4 ${
                   layoutStyle === 'neo' ? 'bg-white rounded-[3rem] shadow-xl' :
                   layoutStyle === 'brutalist' ? 'bg-white border-4 border-cinema-ink shadow-[12px_12px_0_var(--color-cinema-ink)]' :
                   'bg-white border border-cinema-ink/10 shadow-sm'
                 }`}
               >
                 <div className="text-lavender mb-6">{stat.icon}</div>
                 <h3 className="text-[12px] font-black uppercase tracking-widest opacity-40">{stat.label}</h3>
                 <p className="text-6xl md:text-8xl font-black tracking-tighter">{stat.value}</p>
               </motion.div>
            ))}
         </section>

         {/* Taste Preferences Section */}
         <section className="relative">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 px-4 border-l-8 border-lavender/30">
               偏好与品味 <span className="text-xl md:text-3xl italic serif-italic opacity-30 block md:inline md:ml-6">Signature Preferences</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { title: 'Top Director', desc: '最常看导演', name: stats.topDirector },
                 { title: 'Top Genre', desc: '偏爱类型', name: stats.topGenre },
                 { title: 'Top Actor', desc: '常看演员', name: stats.topActor },
                 { title: 'Longest Review', desc: '最长评论', name: stats.longestReview?.title || '—', extra: stats.longestReview ? `${stats.longestReview.count} 字` : undefined },
               ].map((pref, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.15, duration: 0.6 }}
                   className={`flex flex-col justify-end min-h-[300px] p-8 md:p-12 transition-all hover:-translate-y-2 ${
                     layoutStyle === 'neo' ? 'bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-lg' :
                     layoutStyle === 'brutalist' ? 'bg-yellow-400 border-4 border-cinema-ink shadow-[12px_12px_0_var(--color-cinema-ink)]' :
                     'bg-cinema-ink text-zinc-50'
                   }`}
                 >
                    <div className="mb-auto">
                       <Quote className={`rotate-180 w-12 h-12 mb-4 ${layoutStyle === 'swiss' ? 'text-zinc-50/20' : 'text-cinema-ink/20'}`} />
                    </div>
                    <div className="space-y-4">
                       <span className={`text-[10px] uppercase font-black tracking-widest ${layoutStyle === 'swiss' ? 'text-zinc-50/50' : 'text-cinema-ink/50'}`}>
                         {pref.title} / {pref.desc}
                       </span>
                       <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none break-words">
                         {pref.name}
                       </h3>
                       {pref.extra && (
                         <p className="text-sm font-mono opacity-40">{pref.extra}</p>
                       )}
                    </div>
                 </motion.div>
               ))}
            </div>
         </section>

         {/* Hall of Fame - Top 3 Movies */}
         {stats.favorites.length > 0 && (
           <section className="space-y-16">
              <div className="text-center space-y-4 mb-20">
                  <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">最高赞誉</h2>
                  <p className="text-sm font-mono uppercase tracking-[0.5em] opacity-40">Hall of Fame / Honorable Mentions</p>
              </div>

              <div className="space-y-8 md:space-y-24 max-w-5xl mx-auto">
                 {stats.favorites.map((movie, index) => (
                    <motion.div 
                      key={movie.id}
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 group ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                       <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden">
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title}
                            className={`w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ${
                              layoutStyle === 'neo' ? 'rounded-[3rem] shadow-2xl' : 
                              layoutStyle === 'brutalist' ? 'border-4 border-cinema-ink shadow-[16px_16px_0_var(--color-cinema-ink)]' :
                              'shadow-2xl'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 bg-white text-cinema-ink px-4 py-2 text-2xl font-black shadow-lg">
                            {index + 1}
                          </div>
                       </div>
                       <div className="w-full md:w-1/2 space-y-8 p-4 md:p-0">
                          <div className="space-y-4">
                             <div className="flex items-center space-x-4">
                                <Trophy className="text-yellow-500" />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Masterpiece Collection</span>
                             </div>
                             <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">
                                {movie.title}
                             </h3>
                             <p className="text-xl font-serif italic opacity-60">{movie.director} / {movie.year}</p>
                          </div>
                          <div className="flex flex-wrap gap-4">
                             {movie.genre?.map(g => (
                               <span key={g} className="px-4 py-1.5 border border-cinema-ink/20 text-[10px] font-bold uppercase tracking-widest">{g}</span>
                             ))}
                          </div>
                          {movie.quote && (
                            <blockquote className="border-l-4 border-cinema-ink/20 pl-6 text-lg italic text-cinema-ink/70">
                               "{movie.quote}"
                            </blockquote>
                          )}
                       </div>
                    </motion.div>
                 ))}
              </div>
           </section>
         )}

      </div>
    </div>
  );
};
