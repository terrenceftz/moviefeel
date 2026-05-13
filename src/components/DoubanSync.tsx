import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, Loader2, Database, ExternalLink } from 'lucide-react';
import { fetchDoubanMovies, enrichWithTMDB, DoubanMovie } from '../services/doubanService';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DoubanSyncProps {
  onClose: () => void;
  onImport: (movies: Movie[]) => void;
  existingMovies: Movie[];
}

export const DoubanSync: React.FC<DoubanSyncProps> = ({ onClose, onImport, existingMovies }) => {
  const [doubanId, setDoubanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [movies, setMovies] = useState<(DoubanMovie & { status?: 'pending' | 'success' | 'failed' | 'exists' })[]>([]);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  const handleFetch = async (nextPage: number = 0) => {
    const cleanId = doubanId.trim();
    if (!cleanId) return;
    setError(null);
    try {
      if (nextPage === 0) setLoading(true);
      else setFetchingMore(true);

      const results = await fetchDoubanMovies(cleanId, nextPage);
      
      if (results.length === 0) {
        throw new Error('未发现观影记录，请检查豆瓣ID或该用户是否公开了记录');
      }
      const processedResults = results.map(m => {
         const exists = existingMovies.some(em => em.title === m.title);
         return { ...m, status: (exists ? 'exists' as const : 'pending' as const) };
      });

      if (nextPage === 0) {
        setMovies(processedResults);
        setStep('preview');
      } else {
        setMovies(prev => {
          // Filter out results that already exist in the preview to prevent duplicate keys
          const existingIds = new Set(prev.map(p => p.doubanId));
          const newItems = processedResults.filter(r => !existingIds.has(r.doubanId));
          return [...prev, ...newItems];
        });
      }

      setPage(nextPage);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || '获取数据失败，请重试');
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const handleSync = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const importedMovies: Movie[] = [];
      const currentMovies = [...movies];
      
      for (let i = 0; i < currentMovies.length; i++) {
         const m = currentMovies[i];
         if (m.status !== 'pending') continue;

         const details = await enrichWithTMDB(m);
         
         if (details) {
           const newMovie: Movie = {
             id: `db-${m.doubanId}-${Date.now()}-${i}`, // Unique ID with index
             ...details,
             viewingDate: m.viewingDate || new Date().toISOString().split('T')[0],
             userRating: m.rating * 2,
             userComment: m.comment || '',
             isFavorite: m.rating >= 4,
           };
           importedMovies.push(newMovie);
           
           setMovies(prev => prev.map((item, idx) => 
             idx === i ? { ...item, status: 'success' as const } : item
           ));
         } else {
           setMovies(prev => prev.map((item, idx) => 
             idx === i ? { ...item, status: 'failed' as const } : item
           ));
         }
      }

      if (importedMovies.length > 0) {
        onImport(importedMovies);
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-6 bg-cinema-ink/60 backdrop-blur-md">
      <div className="bg-white border-2 border-cinema-ink w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-[15px_15px_0_var(--color-lavender)] md:shadow-[30px_30px_0_var(--color-lavender)]">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b-2 border-cinema-ink flex items-center justify-between bg-zinc-50">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-cinema-ink text-white shrink-0">
                <Database className="w-[18px] h-[18px] md:w-5 md:h-5" />
             </div>
             <div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter">Douban Data Intercept</h2>
                <p className="text-[9px] md:text-[10px] font-mono opacity-40 uppercase tracking-widest leading-none">同步豆瓣观影记录并自动增强元数据</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-1">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto space-y-8 py-8 md:py-12"
              >
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-widest">输入豆瓣用户 ID / 域名</label>
                   {error && (
                     <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 uppercase tracking-widest">
                       Error: {error}
                     </div>
                   )}
                   <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        className="flex-1 border-b-2 border-cinema-ink outline-none py-3 px-2 font-mono text-lg"
                        placeholder="e.g. 1234567 or username"
                        value={doubanId}
                        onChange={e => setDoubanId(e.target.value)}
                      />
                      <button 
                        onClick={() => handleFetch(0)}
                        disabled={loading || !doubanId}
                        className="bg-cinema-ink text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-lavender hover:text-cinema-ink transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : 'Fetch'}
                      </button>
                   </div>
                   <p className="text-[9px] md:text-[10px] font-mono opacity-40 uppercase">通常可以在你的豆瓣个人主页 URL 中找到：douban.com/people/[ID]</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-12 border-t border-cinema-ink/5 text-[10px] font-mono uppercase tracking-widest opacity-60">
                   <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cinema-ink" />
                      <span>自动匹配 TMDB</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cinema-ink" />
                      <span>高清海报自动抓取</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cinema-ink" />
                      <span>评分转换 (5星 {"->"} 10分)</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cinema-ink" />
                      <span>保留观影时间戳</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <h3 className="text-xs md:text-sm font-black uppercase tracking-widest border-l-4 border-lavender pl-4">捕获到 {movies.length} 条记录</h3>
                   <div className="flex items-center space-x-4">
                      <button onClick={() => setStep('input')} className="text-[10px] font-bold uppercase tracking-widest hover:underline whitespace-nowrap">重新选择</button>
                      <button 
                        onClick={handleSync}
                        disabled={loading}
                        className="bg-cinema-ink text-white px-4 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-lavender hover:text-cinema-ink transition-all flex items-center space-x-2 shrink-0"
                      >
                        {loading ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                        <span>开始同步到库</span>
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                   {movies.map((m, idx) => (
                     <div key={`douban-preview-${m.doubanId}-${idx}`} className="flex items-center justify-between border border-cinema-ink/5 p-4 hover:bg-zinc-50 transition-colors group">
                        <div className="flex items-center space-x-6">
                           <div className="text-[10px] font-mono opacity-20 w-4">{idx + 1}</div>
                           <div>
                              <div className="text-sm font-black uppercase tracking-tight">
                                {m.title}
                                {m.originalTitle && <span className="ml-2 opacity-30 font-normal lowercase italic">/ {m.originalTitle}</span>}
                              </div>
                              <div className="flex items-center space-x-3 text-[9px] font-mono opacity-40">
                                 <span>DOUBAN: {m.doubanId}</span>
                                 <span>•</span>
                                 <span>{m.viewingDate}</span>
                                 {m.comment && (
                                   <span className="text-lavender font-bold ml-1"># WITH_COMMENT</span>
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           {m.status === 'exists' && (
                             <span className="text-[9px] font-bold text-lavender uppercase border border-lavender px-1">IN ARCHIVE</span>
                           )}
                           {m.status === 'failed' && (
                             <span className="text-[9px] font-bold text-red-500 uppercase border border-red-500 px-1">MATCH FAILED</span>
                           )}
                           <div className="text-xs font-black bg-lavender/50 px-2 py-0.5">{m.rating * 2}/10</div>
                           <div className="w-24 flex justify-end">
                              {m.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                              {m.status === 'failed' && <X size={16} className="text-red-500" />}
                              {(m.status === 'pending' || (m.status === 'failed' && loading)) && loading && (
                                 <Loader2 size={14} className="animate-spin opacity-20" />
                              )}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-center py-8">
                   <button 
                     onClick={() => handleFetch(page + 1)}
                     disabled={fetchingMore}
                     className="text-[10px] font-black uppercase tracking-[0.3em] border-2 border-cinema-ink px-10 py-3 hover:bg-lavender transition-all disabled:opacity-30"
                   >
                     {fetchingMore ? 'Fetching...' : 'Load More Records'}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

         {/* Footer */}
        <div className="p-4 md:p-6 border-t-2 border-cinema-ink bg-zinc-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[10px] md:text-xs font-bold font-mono opacity-40 uppercase tracking-tight">
             {movies.filter(m => m.status === 'success').length} IMPORTED / {movies.filter(m => m.status === 'pending').length} PENDING
           </div>
           
           <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
              {step === 'preview' && movies.some(m => m.status === 'pending') && (
                <button 
                  onClick={handleSync}
                  disabled={loading}
                  className="w-full sm:w-auto bg-cinema-ink text-white px-6 md:px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-lavender hover:text-cinema-ink transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                  <span>Start Synchronization</span>
                </button>
              )}

              <button 
                disabled={loading}
                onClick={onClose} 
                className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline disabled:opacity-50"
              >
                {step === 'input' ? 'Cancel' : 'Finish and Exit'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
