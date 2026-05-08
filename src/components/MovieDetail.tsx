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
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose, onEdit, onDelete, isAdmin }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto font-sans"
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

      <div className="min-h-screen relative z-10 bg-white/60 backdrop-blur-3xl flex flex-col md:flex-row">
        {/* Navigation / Actions */}
        <div className="fixed top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 z-[110] flex justify-between items-center pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-lavender p-2 md:p-3 transition-colors border-2 border-cinema-ink bg-white shadow-[2px_2px_0_var(--color-cinema-ink)] md:shadow-[4px_4px_0_var(--color-cinema-ink)]"
          >
            <ArrowLeft size={14} md:size={16} />
            <span className="hidden sm:inline">返回影库</span>
          </button>

          <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
            {isAdmin && (
              <>
                <button 
                    onClick={() => onEdit(movie)}
                    className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-lavender p-2 md:p-3 transition-colors border-2 border-cinema-ink bg-white shadow-[2px_2px_0_var(--color-cinema-ink)] md:shadow-[4px_4px_0_var(--color-cinema-ink)]"
                >
                    <Edit2 size={12} md:size={14} />
                    <span className="hidden sm:inline">编辑</span>
                </button>
                <button 
                    onClick={() => {
                      if (window.confirm(`确认要删除《${movie.title}》吗？此操作无法撤销。`)) {
                          onDelete(movie);
                      }
                    }}
                    className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-red-600 text-white p-2 md:p-3 transition-all border-2 border-cinema-ink shadow-[2px_2px_0_var(--color-cinema-ink)] md:shadow-[4px_4px_0_var(--color-cinema-ink)] hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5"
                    title="彻底删除此条目"
                >
                    <Trash2 size={12} md:size={14} />
                    <span className="hidden md:inline">删除</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Left Column: Visuals */}
        <div className="w-full md:w-[40%] md:h-screen md:sticky top-0 flex items-center justify-center p-8 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-cinema-ink/5 pt-20 md:pt-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[280px] md:max-w-sm shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative group"
          >
             <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full relative z-10"
              referrerPolicy="no-referrer"
            />
            {/* Year Badge */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 bg-cinema-ink flex items-center justify-center text-white font-sans font-black text-xl md:text-2xl z-20 shadow-xl">
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
        <div className="w-full md:w-[60%] p-6 md:p-24 space-y-12 md:space-y-16">
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <span className="text-[10px] font-mono text-cinema-ink/40 uppercase tracking-widest">Directed by {movie.director}</span>
               <div className="hidden sm:block h-px flex-1 bg-cinema-ink/10" />
               <div className="flex items-center self-start text-xs font-bold bg-zinc-100 px-3 py-1 border border-cinema-ink/5">
                  <Star size={12} className="mr-1 text-yellow-500" />
                  TMDB: {movie.tmdbRating}/10
               </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl break-words leading-[0.85] font-black">{movie.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6">
               <div className="flex items-center text-xl md:text-2xl font-black bg-lavender px-4 py-3 md:px-6 md:py-3 shadow-[4px_4px_0_var(--color-cinema-ink)] md:shadow-[8px_8px_0_var(--color-cinema-ink)] transition-spacing">
                  <span className="text-[10px] font-mono uppercase tracking-widest mr-4 opacity-40">User Score</span>
                  {movie.userRating}/10
               </div>
               <div className="text-[10px] md:text-[10px] font-mono text-cinema-ink/40 uppercase tracking-[0.2em]">
                 Archive Entry • {movie.viewingDate}
               </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 md:pt-6">
              {movie.moodTags?.map((tag, i) => (
                <span key={`detail-tag-${movie.id || 'new'}-${tag}-${i}`} className="text-[9px] md:text-[10px] font-black px-3 py-1 md:px-4 md:py-1.5 border border-cinema-ink/20 uppercase tracking-widest">
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
            className="aspect-video w-full overflow-hidden shadow-2xl grayscale group hover:grayscale-0 transition-all duration-1000 border border-cinema-ink/10"
          >
             <img 
               src={movie.backdropUrl || movie.posterUrl} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
               alt="Cinematic Still"
               referrerPolicy="no-referrer"
             />
          </motion.section>

          {/* Quote Section */}
          <section className="relative py-4 md:py-8">
            <Quote className="absolute -top-4 -left-4 text-lavender/40 w-12 h-12 md:w-16 md:h-16" />
            <p className="font-serif italic text-2xl md:text-5xl leading-tight text-cinema-ink relative z-10 pl-6 md:pl-8">
              {movie.quote || "捕捉电影中的珍贵瞬间..."}
            </p>
          </section>

          {/* Review Section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 md:gap-16 border-t border-cinema-ink/5 pt-12 md:pt-16">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black tracking-[0.3em] text-cinema-ink/30 uppercase">Personal Narrative</h4>
              <div className="space-y-4">
                <p className="text-lg md:text-xl leading-relaxed font-sans text-cinema-ink/80 whitespace-pre-wrap italic">
                  {movie.userComment || "该记录没有留下评价。"}
                </p>
                <div className="h-px w-8 bg-lavender" />
                <h4 className="text-[10px] font-black tracking-[0.3em] text-cinema-ink/30 uppercase pt-4">Movie Synopsis (TMDB)</h4>
                <p className="text-sm leading-relaxed text-cinema-ink/60">
                  {movie.overview}
                </p>
              </div>
            </div>

            {movie.emotionalProfile && (
              <div className="space-y-8">
                <h4 className="text-[10px] font-black tracking-[0.3em] text-cinema-ink/30 uppercase">Atmospheric Spectrum</h4>
                <div className="h-[250px] md:h-[300px] w-full border border-cinema-ink/5 p-4 bg-white/40 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={movie.emotionalProfile}>
                      <PolarGrid stroke="#eee" />
                      <PolarAngleAxis dataKey="label" tick={(props: any) => {
                        const { x, y, payload } = props;
                        return (
                          <text x={x} y={y} textAnchor="middle" fontSize={8} fontWeight={800} fill="#666">
                            {payload.value}
                          </text>
                        );
                      }} />
                      <Radar
                        name="Emotion"
                        dataKey="intensity"
                        stroke={movie.primaryColor || "#D8BFD8"}
                        fill={movie.primaryColor || "#D8BFD8"}
                        fillOpacity={0.5}
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
