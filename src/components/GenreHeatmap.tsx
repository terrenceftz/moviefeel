import React from 'react';
import { Movie } from '../types';
import { motion } from 'motion/react';
import { Trophy, Film, Hash, UserCircle } from 'lucide-react';

interface MovieSummaryProps {
  movies: Movie[];
}

export const MovieSummary: React.FC<MovieSummaryProps> = ({ movies }) => {
  const totalCount = movies.length;
  const favoriteCount = movies.filter(m => m.isFavorite).length;

  // Calculate genre distribution
  const genreData: Record<string, number> = movies.reduce((acc, movie) => {
    if (movie.genre && Array.isArray(movie.genre)) {
      movie.genre.forEach(g => {
        acc[g] = (acc[g] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedGenres = Object.entries(genreData).sort((a, b) => b[1] - a[1]);
  const mainGenres = sortedGenres.slice(0, 4);

  // Simple "Persona" logic based on data
  const getPersona = () => {
    if (totalCount < 5) return { 
      title: "光影初行者", 
      english: "Cinema Novice", 
      desc: "你的影库正处于蓄势待发的起步阶段，每一部新加入的影片都在扩展你的艺术边界。"
    };
    
    if (favoriteCount / totalCount > 0.5) return { 
      title: "挑剔的影评人", 
      english: "Critical Aestheticist", 
      desc: "你对银幕艺术有着严苛的标准，唯有真正的杰作才能进入你的收藏序列。" 
    };

    const topGenre = sortedGenres[0]?.[0];
    if (topGenre === 'Science Fiction' || topGenre === 'Fantasy') return { 
      title: "时空漫游者", 
      english: "Interstellar Voyager", 
      desc: "你沉入超现实的叙事海洋，在幻想与硬核科技的交织中寻找人类文明的终极出口。" 
    };
    
    if (topGenre === 'Documentary' || topGenre === 'History') return { 
      title: "真相守望者", 
      english: "Reality Sentinel", 
      desc: "你偏爱真实的刻痕，在历史的尘埃与现实的镜像中寻找生命的底色。" 
    };

    return { 
      title: "资深私藏家", 
      english: "Senior Archivist", 
      desc: "你构建了一座属于自己的光影圣殿，杂食且敏锐，在广阔的类型图谱中自由穿梭。" 
    };
  };

  const persona = getPersona();

  return (
    <section className="px-6 md:px-12 py-20 md:py-32 bg-cinema-ink text-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 md:pb-12 gap-8">
          <div className="space-y-2 md:space-y-4">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-lavender"
            >
              System Analytics v1.0
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter"
            >
              观影总结 <span className="serif-italic lowercase opacity-30 block md:inline md:ml-6">Summary Report</span>
            </motion.h2>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6 text-[10px] md:text-sm font-mono text-white/40">
            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>SYNCED</span>
            </div>
            <span className="truncate">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Major Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
          {/* Total Records */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group border border-white/5 p-6 md:p-10 space-y-6 md:space-y-8 hover:bg-white hover:text-cinema-ink transition-all duration-700"
          >
            <div className="flex justify-between items-start">
              <Film className="w-6 h-6 md:w-8 md:h-8 opacity-20 group-hover:opacity-100" />
              <span className="text-[10px] font-mono opacity-40">ITEM: 001</span>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] opacity-40">已记录影片数</p>
              <div className="text-6xl md:text-8xl font-black font-mono leading-none tracking-tighter">
                {totalCount.toString().padStart(2, '0')}
              </div>
            </div>
          </motion.div>

          {/* Favorite Count */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group border border-white/5 p-6 md:p-10 space-y-6 md:space-y-8 hover:bg-white hover:text-cinema-ink transition-all duration-700"
          >
            <div className="flex justify-between items-start">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 opacity-20 group-hover:opacity-100" />
              <span className="text-[10px] font-mono opacity-40">ITEM: 002</span>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] opacity-40">特别喜爱剧目</p>
              <div className="text-6xl md:text-8xl font-black font-mono leading-none tracking-tighter">
                {favoriteCount.toString().padStart(2, '0')}
              </div>
            </div>
          </motion.div>

          {/* Top Genres */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group border border-white/5 p-6 md:p-10 space-y-6 md:space-y-8 hover:bg-white hover:text-cinema-ink transition-all duration-700 sm:col-span-2 md:col-span-1"
          >
            <div className="flex justify-between items-start">
              <Hash className="w-6 h-6 md:w-8 md:h-8 opacity-20 group-hover:opacity-100" />
              <span className="text-[10px] font-mono opacity-40">ITEM: 003</span>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] opacity-40">最偏好的类型</p>
                <div className="flex flex-wrap gap-2" key={`summary-genres-list-${movies.length}`}>
                  {mainGenres.length > 0 ? mainGenres.map(([genre], i) => (
                    <span key={`summary-main-genre-${genre}-${i}`} className="text-[10px] font-black border border-white/20 group-hover:border-cinema-ink/20 px-2 py-1 flex items-center">
                      {genre}
                    </span>
                  )) : <span className="opacity-20 italic" key="no-genres">尚无分类信息</span>}
                </div>
            </div>
          </motion.div>
        </div>

        {/* Persona Analysis */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-24"
        >
          <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 scale-150 pointer-events-none">
             <UserCircle className="w-64 h-64 md:w-96 md:h-96" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-2">
                 <span className="text-xs md:text-sm font-mono font-black text-lavender uppercase tracking-[0.2em] md:tracking-[0.3em]">Viewing Persona Identity</span>
                 <h3 className="text-5xl sm:text-7xl md:text-8xl font-black leading-none uppercase tracking-tighter italic">
                   {persona.title}
                 </h3>
                 <p className="text-lg md:text-2xl font-mono opacity-30 truncate">{persona.english}</p>
              </div>
              <p className="text-lg md:text-3xl font-medium leading-relaxed max-w-xl opacity-80 serif-italic">
                "{persona.desc}"
              </p>
            </div>

            <div className="space-y-12">
               {/* Visual distribution visualization */}
               <div className="space-y-6" key={`summary-dist-list-${movies.length}`}>
                 {sortedGenres.slice(0, 5).map(([genre, count], idx) => (
                   <div key={`summary-dist-item-${genre}-${idx}-${count}`} className="space-y-2">
                     <div className="flex justify-between items-end text-xs font-mono font-black uppercase opacity-60">
                       <span>{genre}</span>
                       <span>{count} / {totalCount}</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(count / totalCount) * 100}%` }}
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                          className="absolute h-full bg-lavender" 
                        />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Swiss Grid Decor */}
        <div className="grid grid-cols-12 h-1 overflow-hidden opacity-10">
           {Array.from({ length: 12 }).map((_, i) => (
             <div key={`summary-decor-grid-${i}`} className={`h-full border-r border-white ${i % 3 === 0 ? 'bg-white' : ''}`} />
           ))}
        </div>
      </div>
    </section>
  );
};
