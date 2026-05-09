import React from 'react';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Quote, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  isAdmin?: boolean;
  layoutStyle?: 'swiss' | 'brutalist' | 'neo';
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ 
  movie, onClose, onEdit, onDelete, isAdmin, layoutStyle = 'swiss' 
}) => {
  const containerClasses = {
    swiss: "bg-white/60 backdrop-blur-3xl",
    brutalist: "bg-white",
    neo: "bg-zinc-50/40 backdrop-blur-3xl"
  };

  const buttonClasses = {
    swiss: "border-2 border-cinema-ink bg-white shadow-[4px_4px_0_var(--color-cinema-ink)]",
    brutalist: "border-4 border-cinema-ink bg-white shadow-[8px_8px_0_var(--color-cinema-ink)] hover:-translate-y-1 hover:-translate-x-1",
    neo: "bg-white/80 backdrop-blur-md rounded-full shadow-lg border-0 px-6 py-4"
  };

  const posterFrameClasses = {
    swiss: "shadow-[20px_20px_0_rgba(0,0,0,0.05)]",
    brutalist: "border-8 border-cinema-ink shadow-[20px_20px_0_var(--color-lavender)]",
    neo: "rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
  };

  const yearBadgeClasses = {
    swiss: "bg-cinema-ink text-white",
    brutalist: "bg-cinema-ink text-white border-4 border-cinema-ink",
    neo: "bg-white text-cinema-ink rounded-full shadow-xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-white overflow-y-auto ${layoutStyle === 'brutalist' ? 'font-mono' : 'font-sans'}`}
    >
      {/* Background Cinematic Still (Backdrop) */}
      <div className="fixed inset-0 z-0">
        <img 
          src={movie.backdropUrl || movie.posterUrl} 
          className="w-full h-full object-cover blur-sm brightness-50 opacity-20"
          alt=""
          referrerPolicy="no-referrer"
        />
      </div>

      <div className={`min-h-screen relative z-10 flex flex-col md:flex-row transition-all duration-700 ${containerClasses[layoutStyle]}`}>
        {/* Navigation / Actions */}
        <div className="fixed top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 z-[110] flex justify-between items-center pointer-events-none">
          <button 
            onClick={onClose}
            className={`pointer-events-auto flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all p-3 ${buttonClasses[layoutStyle]}`}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">返回影库 Back to Archive</span>
          </button>

          <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
            {isAdmin && (
              <>
                <button 
                    onClick={() => onEdit(movie)}
                    className={`flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all p-3 bg-white ${buttonClasses[layoutStyle]}`}
                >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">编辑</span>
                </button>
                <button 
                    onClick={() => {
                      if (window.confirm(`确认要删除《${movie.title}》吗？此操作无法撤销。`)) {
                          onDelete(movie);
                      }
                    }}
                    className={`flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest p-3 transition-all ${
                      layoutStyle === 'neo' ? 'bg-red-50 text-red-600 rounded-full shadow-lg' : 'bg-red-600 text-white'
                    } ${layoutStyle === 'brutalist' ? 'border-4 border-cinema-ink shadow-[8px_8px_0_#1A1A1A]' : (layoutStyle === 'swiss' ? 'border-2 border-cinema-ink' : '')}`}
                    title="彻底删除此条目"
                >
                    <Trash2 size={14} />
                    <span className="hidden md:inline">删除</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Left Column: Visuals */}
        <div className={`w-full md:w-[40%] md:h-screen md:sticky top-0 flex items-center justify-center p-8 md:p-12 transition-all duration-700 ${
          layoutStyle === 'brutalist' ? 'bg-zinc-100 border-r-4 border-cinema-ink' : (layoutStyle === 'swiss' ? 'border-r border-cinema-ink/5' : '')
        } pt-24 md:pt-12`}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-[280px] md:max-w-sm relative group transition-all duration-700 ${posterFrameClasses[layoutStyle]}`}
          >
             <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className={`w-full relative z-10 ${layoutStyle === 'neo' ? 'rounded-[3rem]' : ''}`}
              referrerPolicy="no-referrer"
            />
            {/* Year Badge */}
            <div className={`absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center font-black text-xl md:text-3xl z-20 transition-all ${yearBadgeClasses[layoutStyle]}`}>
              {movie.year}
            </div>
          </motion.div>

          {/* Color Decoration */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundColor: movie.primaryColor || '#E6E6FA' }}
          />
        </div>

        {/* Right Column: Content */}
        <div className={`w-full md:w-[60%] p-6 md:p-24 space-y-12 md:space-y-16 ${layoutStyle === 'neo' ? 'md:py-32' : ''}`}>
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] ${layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white px-2 py-1' : 'opacity-40'}`}>
                 Directed by {movie.director}
               </span>
               <div className="hidden sm:block h-px flex-1 bg-cinema-ink/10" />
               <div className={`flex items-center self-start text-xs font-bold px-4 py-2 ${
                 layoutStyle === 'neo' ? 'bg-white rounded-full shadow-sm' : 'bg-zinc-100 border border-cinema-ink/5'
               }`}>
                  <Star size={12} className="mr-2 text-yellow-500 fill-current" />
                  TMDB Score {movie.tmdbRating}
               </div>
            </div>
            
            <h1 className={`text-6xl sm:text-7xl md:text-9xl break-words leading-[0.85] font-black tracking-tighter ${
              layoutStyle === 'swiss' ? 'italic' : ''
            }`}>
              {movie.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-8 pt-6">
               <div className={`flex items-center text-2xl md:text-4xl font-black px-6 py-4 transition-all ${
                 layoutStyle === 'brutalist' ? 'bg-yellow-400 border-4 border-cinema-ink shadow-[12px_12px_0_#1A1A1A]' : 
                 layoutStyle === 'neo' ? 'bg-white text-cinema-ink rounded-[2rem] shadow-xl' :
                 'bg-lavender shadow-[8px_8px_0_#1A1A1A] italic'
               }`}>
                  <span className="text-[10px] font-mono uppercase tracking-widest mr-6 opacity-40">User Score</span>
                  {movie.userRating}
                  <span className="text-sm opacity-30 ml-1">/10</span>
               </div>
               <div className="text-[10px] font-mono text-cinema-ink/40 uppercase tracking-[0.3em]">
                 Archive Entry Ref. {movie.id?.slice(0, 8)} <br/>
                 Captured On {movie.viewingDate}
               </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6" key={`detail-tags-container-${movie.id}`}>
                {movie.moodTags?.map((tag, i) => (
                <span key={`detail-tag-${movie.id}-${i}-${layoutStyle}`} className={`text-[10px] font-black px-5 py-2 uppercase tracking-widest transition-all ${
                  layoutStyle === 'neo' ? 'bg-lavender/10 text-lavender rounded-full' : 
                  layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white' :
                  'border border-cinema-ink/20'
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Cinematic Still Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`aspect-video w-full overflow-hidden transition-all duration-1000 grayscale group hover:grayscale-0 ${
              layoutStyle === 'neo' ? 'rounded-[3rem] shadow-2xl' : 
              layoutStyle === 'brutalist' ? 'border-4 border-cinema-ink shadow-[12px_12px_0_#1A1A1A]' :
              'shadow-2xl border border-cinema-ink/10'
            }`}
          >
             <img 
               src={movie.backdropUrl || movie.posterUrl} 
               className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
               alt="Cinematic Still"
               referrerPolicy="no-referrer"
             />
          </motion.section>

          {/* Quote Section */}
          <section className={`relative py-8 md:py-16 px-8 md:px-12 transition-all ${
            layoutStyle === 'neo' ? 'bg-white rounded-[3rem] shadow-sm' : 
            layoutStyle === 'brutalist' ? 'bg-zinc-100 border-4 border-cinema-ink shadow-[8px_8px_0_#1A1A1A]' : ''
          }`}>
            <Quote className={`absolute -top-4 -left-4 w-12 h-12 md:w-20 md:h-20 ${
              layoutStyle === 'neo' ? 'text-lavender/20' : 'text-lavender/40'
            }`} />
            <p className={`font-serif italic text-3xl md:text-6xl leading-tight text-cinema-ink relative z-10 ${
              layoutStyle === 'brutalist' ? 'uppercase font-black not-italic tracking-tighter' : ''
            }`}>
              {movie.quote || "捕捉电影中的珍贵瞬间..."}
            </p>
          </section>

          {/* Review Section */}
          <section className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 pt-12 md:pt-20 border-t ${
            layoutStyle === 'brutalist' ? 'border-cinema-ink border-t-8' : 'border-cinema-ink/5'
          }`}>
            <div className="space-y-12">
              <div className="space-y-8">
                <h4 className={`text-[10px] font-black tracking-[0.4em] uppercase ${
                  layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white px-3 py-1 inline-block' : 'text-cinema-ink/30'
                }`}>
                  Personal Narrative
                </h4>
                <p className={`text-xl md:text-2xl leading-relaxed text-cinema-ink/80 whitespace-pre-wrap italic font-serif ${
                  layoutStyle === 'brutalist' ? 'font-mono not-italic' : ''
                }`}>
                  {movie.userComment || "该记录没有留下评价。"}
                </p>
                <div className="h-[2px] w-12 bg-lavender" />
              </div>

              <div className="space-y-6 opacity-60">
                <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-cinema-ink/40">Movie Synopsis</h4>
                <p className="text-base leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            </div>

            {movie.emotionalProfile && (
              <div className="space-y-10">
                <h4 className={`text-[10px] font-black tracking-[0.4em] uppercase ${
                  layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white px-3 py-1 inline-block' : 'text-cinema-ink/30'
                }`}>
                  Atmospheric Spectrum
                </h4>
                <div className={`h-[350px] md:h-[450px] w-full p-8 transition-all ${
                  layoutStyle === 'neo' ? 'bg-white rounded-[3rem] shadow-xl' : 
                  layoutStyle === 'brutalist' ? 'bg-white border-4 border-cinema-ink shadow-[12px_12px_0_#1A1A1A]' :
                  'bg-white/40 shadow-inner border border-cinema-ink/5'
                }`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart key={`radar-${movie.id}`} cx="50%" cy="50%" outerRadius="80%" data={movie.emotionalProfile}>
                      <PolarGrid stroke="#eee" />
                      <PolarAngleAxis dataKey="label" tick={(props: any) => {
                        const { x, y, payload } = props;
                        return (
                          <text x={x} y={y} textAnchor="middle" fontSize={10} fontWeight={900} fill="#1A1A1A" className="uppercase font-mono">
                            {payload.value}
                          </text>
                        );
                      }} />
                      <Radar
                        name="Emotion"
                        dataKey="intensity"
                        stroke={movie.primaryColor || "#D8BFD8"}
                        fill={movie.primaryColor || "#D8BFD8"}
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};
