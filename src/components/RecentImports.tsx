import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Film, Tv } from 'lucide-react';
import { fetchRecentItems, EmbyItem } from '../services/embyService';
import { getEmbyConfig } from '../services/configService';

interface RecentImportsProps {
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
}

const EmbyCard: React.FC<{ item: EmbyItem; index: number; layoutStyle: string }> = ({ item, index, layoutStyle }) => {
  const cardClasses = {
    swiss: "bg-white border border-cinema-ink/5 p-3 hover:border-cinema-ink shadow-sm hover:shadow-xl",
    brutalist: "bg-white border-2 border-cinema-ink p-1.5 hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[2px_2px_0_var(--color-cinema-ink)] hover:shadow-[4px_4px_0_var(--color-cinema-ink)]",
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
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group cursor-default transition-all duration-500 overflow-hidden ${cardClasses[layoutStyle]}`}
    >
      <div className={`mb-3 grayscale group-hover:grayscale-0 transition-all duration-1000 overflow-hidden relative ${imageClasses[layoutStyle]}`}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-zinc-100 flex items-center justify-center">
            <Film size={32} className="text-zinc-300" />
          </div>
        )}
        <div className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1 z-10 ${
          item.type === 'Movie' ? 'bg-cinema-ink text-white' : 'bg-lavender text-cinema-ink'
        }`}>
          {item.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
          <span>{item.type === 'Movie' ? '电影' : '剧集'}</span>
        </div>
        <div className="absolute inset-0 bg-cinema-ink opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline gap-1">
          <h3 className={`text-[11px] font-black uppercase tracking-tight leading-tight truncate group-hover:text-cinema-ink/80 transition-colors ${layoutStyle === 'neo' ? 'tracking-normal' : ''}`}>
            {item.name}
          </h3>
          {item.year && <span className="text-[8px] font-mono font-bold leading-tight shrink-0 opacity-30">{item.year}</span>}
        </div>
        <div className={`h-[1px] w-full transition-colors ${layoutStyle === 'brutalist' ? 'bg-cinema-ink' : 'bg-cinema-ink/5 group-hover:bg-cinema-ink/10'}`} />
        <div className="flex justify-between items-center">
          <p className="text-[7px] md:text-[8px] font-mono text-cinema-ink/30 uppercase tracking-widest truncate">
            {item.overview ? item.overview.slice(0, 40) : 'New Import'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const RecentImports: React.FC<RecentImportsProps> = ({ layoutStyle }) => {
  const [items, setItems] = useState<EmbyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const config = getEmbyConfig();

  useEffect(() => {
    if (!config) {
      setLoading(false);
      return;
    }
    fetchRecentItems().then(data => {
      setItems(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (!config) return null;
  if (!loading && items.length === 0) return null;

  const sectionClasses = {
    swiss: "bg-white border-y border-cinema-ink/5",
    brutalist: "bg-white border-y-4 border-cinema-ink",
    neo: "bg-white/60 backdrop-blur-2xl rounded-[4rem] border border-white/50 shadow-sm"
  };

  return (
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
              Recent Imports
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
              最新入库 <span className="serif-italic lowercase opacity-40 ml-4 hidden md:inline">From Emby</span>
            </h2>
          </div>
          <div className="text-3xl md:text-4xl font-mono font-black border-l border-cinema-ink/10 pl-6 hidden md:block">
            {items.length < 10 ? `0${items.length}` : items.length}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-20">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`skel-${i}`} className={`animate-pulse ${
                layoutStyle === 'neo' ? 'rounded-xl overflow-hidden' : ''
              }`}>
                <div className="aspect-[2/3] bg-zinc-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-20">
            {items.map((item, idx) => (
              <EmbyCard key={item.id} item={item} index={idx} layoutStyle={layoutStyle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
