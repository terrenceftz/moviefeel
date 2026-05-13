import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { X, Loader2, Search } from 'lucide-react';
import { enhanceMovieMetadata } from '../services/metadataService';
import { searchMovies, getMovieDetails, TMDBMovie } from '../services/tmdbService';

interface MovieFormProps {
  onSave: (movie: Movie) => void;
  onClose: () => void;
  initialMovie?: Movie;
}

export const MovieForm: React.FC<MovieFormProps> = ({ onSave, onClose, initialMovie }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [movie, setMovie] = useState<Partial<Movie>>(initialMovie || {
    title: '',
    director: '',
    year: new Date().getFullYear(),
    tmdbRating: 0,
    userRating: 8,
    posterUrl: '',
    overview: '',
    userComment: '',
    quote: '',
    genre: [],
    cast: [],
    viewingDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
    }
  }, [initialMovie]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results.slice(0, 5));
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectTMDB = async (tmdbMovie: TMDBMovie) => {
    setLoading(true);
    setSearchQuery('');
    setSearchResults([]);
    
    const details = await getMovieDetails(tmdbMovie.id, tmdbMovie.media_type as any);
    if (details) {
      setMovie(prev => ({
        ...prev,
        title: details.title,
        director: details.director,
        year: details.year,
        posterUrl: details.posterUrl,
        backdropUrl: details.backdropUrl,
        overview: details.overview,
        tmdbRating: Math.round(details.tmdbRating * 10) / 10,
        genre: details.genre,
        cast: details.cast,
        runtime: details.runtime,
      }));
    }
    setLoading(false);
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // AI Enhancement happens here
    const enhanced = await enhanceMovieMetadata(movie);
    
    onSave({
      ...enhanced,
      id: initialMovie?.id || `movie-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    } as Movie);
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-cinema-ink/20 backdrop-blur-sm">
      <div className="bg-white border border-cinema-ink w-full max-w-xl p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 hover:scale-110 transition-transform">
          <X size={20} />
        </button>
        
        <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 border-b-4 border-lavender inline-block">
          {initialMovie ? '编辑记录' : '新增记录'}
        </h2>
        
        {/* Search Bar */}
        <div className="mb-6 md:mb-8 relative">
          <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">搜索电影 (TMDB)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/30" size={16} />
            <input 
              className="w-full border border-cinema-ink/10 focus:border-cinema-ink outline-none py-2 pl-10 pr-4 text-sm"
              placeholder="输入电影名称自动填充..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-cinema-ink/30" size={16} />}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-cinema-ink mt-1 z-10 shadow-xl">
              {searchResults.map((result, idx) => (
                <button
                  key={`search-result-${result.id}-${idx}`}
                  onClick={() => handleSelectTMDB(result)}
                  className="w-full text-left p-3 hover:bg-lavender flex items-center space-x-3 transition-colors border-b border-cinema-ink/5 last:border-0"
                >
                  <img 
                    src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : 'https://via.placeholder.com/92x138'} 
                    className="w-8 h-12 object-cover"
                    alt="" 
                  />
                  <div>
                    <div className="text-sm font-bold">{result.title}</div>
                    <div className="text-[10px] opacity-50">{result.release_date?.split('-')[0]}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">电影名称</label>
              <input 
                required
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2 text-lg font-sans"
                value={movie.title || ''}
                onChange={e => setMovie({...movie, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">导演</label>
              <input 
                required
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2 text-lg"
                value={movie.director || ''}
                onChange={e => setMovie({...movie, director: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">上映年份</label>
              <input 
                type="number"
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2"
                value={movie.year || ''}
                onChange={e => setMovie({...movie, year: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">时长 (分钟)</label>
              <input 
                type="number"
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2"
                value={movie.runtime || ''}
                onChange={e => setMovie({...movie, runtime: parseInt(e.target.value) || undefined})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">我的评分 (0-10)</label>
              <input 
                type="number" step="0.1"
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2"
                value={movie.userRating || 0}
                onChange={e => setMovie({...movie, userRating: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">观影日期</label>
              <input 
                type="date"
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2"
                value={movie.viewingDate || ''}
                onChange={e => setMovie({...movie, viewingDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest">我的评价</label>
            <textarea 
              className="w-full min-h-[100px] border border-cinema-ink/10 focus:border-cinema-ink outline-none p-4 font-sans text-sm resize-none italic bg-zinc-50"
              value={movie.userComment || ''}
              placeholder="这部电影给你留下了什么评价？"
              onChange={e => setMovie({...movie, userComment: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest">经典金句台词 (手动输入)</label>
            <textarea 
              className="w-full min-h-[60px] border border-cinema-ink/10 focus:border-cinema-ink outline-none p-4 font-sans text-sm resize-none italic bg-zinc-50"
              value={movie.quote || ''}
              placeholder="输入该电影最触动人心的一句台词..."
              onChange={e => setMovie({...movie, quote: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest">电影简介 (来自 TMDB)</label>
            <textarea 
              className="w-full min-h-[80px] border border-cinema-ink/10 focus:border-cinema-ink outline-none p-4 font-sans text-sm resize-none bg-zinc-50"
              value={movie.overview || ''}
              onChange={e => setMovie({...movie, overview: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">类型 (逗号分隔)</label>
              <input 
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2 text-sm"
                value={movie.genre?.join(', ') || ''}
                onChange={e => setMovie({...movie, genre: e.target.value.split(',').map(s => s.trim())})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">演员 (逗号分隔)</label>
              <input 
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2 text-sm"
                value={movie.cast?.join(', ') || ''}
                onChange={e => setMovie({...movie, cast: e.target.value.split(',').map(s => s.trim())})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[9px] font-mono opacity-40 uppercase tracking-widest bg-zinc-50 p-4 border border-cinema-ink/5">
             <div>TMDB Rating: {movie.tmdbRating}/10</div>
             <div className="truncate">Source ID: {movie.id}</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-cinema-ink/5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">海报 URL (可选)</label>
              <input 
                className="w-full border-b-2 border-cinema-ink/10 focus:border-cinema-ink outline-none p-2 text-xs"
                value={movie.posterUrl || ''}
                placeholder="https://..."
                onChange={e => setMovie({...movie, posterUrl: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                 <input 
                   type="checkbox" 
                   id="favorite"
                   className="w-4 h-4 accent-cinema-ink" 
                   checked={!!movie.isFavorite}
                   onChange={e => setMovie({...movie, isFavorite: e.target.checked})}
                 />
                 <label htmlFor="favorite" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none">加入心动收藏 Add to Favorites</label>
              </div>
 
              <div className="flex items-center space-x-3">
                 <input 
                   type="checkbox" 
                   id="watchlist"
                   className="w-4 h-4 accent-cinema-ink" 
                   checked={!!movie.isWatchlist}
                   onChange={e => setMovie({...movie, isWatchlist: e.target.checked})}
                 />
                 <label htmlFor="watchlist" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-lavender-dark">加入待看清单 Add to Watchlist</label>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cinema-ink text-white py-4 font-black uppercase tracking-widest hover:bg-lavender hover:text-cinema-ink transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center space-x-2"
          >
            {loading ? <><Loader2 className="animate-spin" /> <span>正在生成电影元数据...</span></> : <span>保存记录</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
