import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Film, Tv, Clock } from 'lucide-react';
import { fetchRecentItems, EmbyItem } from '../services/embyService';
import { getEmbyConfig } from '../services/configService';

interface RecentImportsProps {
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 1) return '今天';
  if (diffDays < 2) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return `${Math.floor(diffDays / 30)}月前`;
}

const SkeletonCard: React.FC<{ layoutStyle: string }> = ({ layoutStyle }) => (
  <div className={`flex-shrink-0 w-36 md:w-44 animate-pulse ${
    layoutStyle === 'neo' ? 'rounded-2xl overflow-hidden' : ''
  }`}>
    <div className="aspect-[2/3] bg-zinc-200" />
  </div>
);

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
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (!config) return null;
  if (!loading && items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 md:mt-24 px-4 md:px-0"
    >
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-cinema-ink">
            最新入库
          </h2>
          <p className={`text-[10px] font-mono uppercase tracking-[0.3em] text-cinema-ink/30 mt-1 ${
            layoutStyle === 'brutalist' ? '' : 'italic'
          }`}>
            Recent Imports from Emby
          </p>
        </div>
        <div className={`text-[10px] font-mono text-cinema-ink/30 ${
          layoutStyle === 'neo' ? 'bg-zinc-100 rounded-full px-3 py-1' : ''
        }`}>
          {items.length} items
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skel-${i}`} layoutStyle={layoutStyle} />)
          : items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex-shrink-0 w-36 md:w-44 group cursor-default ${
                  layoutStyle === 'neo' ? 'rounded-2xl overflow-hidden shadow-lg' :
                  layoutStyle === 'brutalist' ? 'border-2 border-cinema-ink' : ''
                }`}
              >
                {/* Poster */}
                <div className={`relative aspect-[2/3] bg-zinc-100 overflow-hidden ${
                  layoutStyle === 'neo' ? '' :
                  layoutStyle === 'brutalist' ? '' : ''
                }`}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-200">
                      <Film size={32} className="text-zinc-300" />
                    </div>
                  )}

                  {/* Type badge */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                    item.type === 'Movie'
                      ? 'bg-cinema-ink text-white'
                      : 'bg-lavender text-cinema-ink'
                  }`}>
                    {item.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
                    <span>{item.type === 'Movie' ? '电影' : '剧集'}</span>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                  {/* Title + meta on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-bold leading-tight line-clamp-2">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.year && <span className="text-white/60 text-[10px]">{item.year}</span>}
                      <span className="text-white/40 text-[10px] flex items-center space-x-1">
                        <Clock size={9} />
                        <span>{relativeTime(item.dateCreated)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </motion.section>
  );
};
