import { useState, useEffect } from 'react';
import { Movie, ViewMode } from './types';
import { INITIAL_MOVIES } from './constants';
import { Navigation } from './components/Navigation';
import { GridGallery } from './components/GridGallery';
import { Timeline } from './components/Timeline';
import { WatchlistView } from './components/WatchlistView';
import { ArchiveParallaxView } from './components/ArchiveParallaxView';
import { SummaryParallaxView } from './components/SummaryParallaxView';
import { Footer } from './components/Footer';
import { MovieDetail } from './components/MovieDetail';
import { MovieForm } from './components/MovieForm';
import { LoginForm } from './components/LoginForm';
import { DoubanSync } from './components/DoubanSync';
import { SettingsPanel } from './components/SettingsPanel';
import { MovieSummary } from './components/GenreHeatmap';
import { getSiteName } from './services/configService';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinema_archive_movies');
    const baseMovies = saved ? JSON.parse(saved) : INITIAL_MOVIES;
    // CRITICAL: Robust deduplication on load to prevent duplicate key errors
    const unique: Movie[] = [];
    const seenIds = new Set();
    const seenTitles = new Set();

    for (const movie of baseMovies) {
      const id = String(movie.id || `init-${Math.random()}`);
      const titleYear = `${String(movie.title).trim()}-${movie.year}`;
      
      if (!seenIds.has(id) && !seenTitles.has(titleYear)) {
        seenIds.add(id);
        seenTitles.add(titleYear);
        unique.push({
          ...movie,
          id: id // Ensure ID exists
        });
      }
    }
    return unique;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('is_admin') === 'true';
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<'swiss' | 'brutalist' | 'neo'>(() => {
    return (localStorage.getItem('cinema_layout_style') as any) || 'swiss';
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('cinema_archive_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('cinema_layout_style', layoutStyle);
  }, [layoutStyle]);

  useEffect(() => {
    const handleSetView = (e: any) => {
      if (e.detail) setViewMode(e.detail);
    };
    window.addEventListener('set-view', handleSetView);
    return () => window.removeEventListener('set-view', handleSetView);
  }, []);

  useEffect(() => {
    document.title = getSiteName();
    const handler = (e: Event) => {
      document.title = (e as CustomEvent).detail;
    };
    window.addEventListener('site-name-changed', handler);
    return () => window.removeEventListener('site-name-changed', handler);
  }, []);

  const handleSaveMovie = (updatedMovie: Movie) => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    
    // Clean strings for comparison
    const targetTitle = updatedMovie.title.trim();
    const targetYear = Number(updatedMovie.year);

    setMovies(prev => {
      // 1. If it has an ID, check if it exists
      if (updatedMovie.id) {
        const index = prev.findIndex(m => String(m.id) === String(updatedMovie.id));
        if (index !== -1) {
          const newMovies = [...prev];
          newMovies[index] = updatedMovie;
          return newMovies;
        }
      }

      // 2. Otherwise/Fallback: Check for same title + year to prevent duplicates
      const duplicateIndex = prev.findIndex(m => 
        String(m.title).trim() === targetTitle && Number(m.year) === targetYear
      );
      
      if (duplicateIndex !== -1) {
        const newMovies = [...prev];
        // Merge with existing item's ID if we're "adding" something that already exists
        newMovies[duplicateIndex] = { ...updatedMovie, id: prev[duplicateIndex].id };
        return newMovies;
      }

      // 3. Brand new movie
      const id = updatedMovie.id || `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return [{ ...updatedMovie, id }, ...prev];
    });
    
    // Sync selection if it was the one being edited
    if (selectedMovie && (
      (updatedMovie.id && String(selectedMovie.id) === String(updatedMovie.id)) || 
      (selectedMovie.title.trim() === targetTitle && Number(selectedMovie.year) === targetYear)
    )) {
       setSelectedMovie(updatedMovie);
    }
    setEditingMovie(null);
    setIsFormOpen(false); // Close form after save
  };

  const handleDeleteMovie = (movieToDelete: Movie) => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    
    if (!movieToDelete) return;

    // Sync clear-out
    const mid = movieToDelete.id ? String(movieToDelete.id) : null;
    const mTitle = movieToDelete.title;
    const mYear = Number(movieToDelete.year);

    console.log('Final Deleting Attempt:', { mid, mTitle, mYear });

    setMovies(prev => {
      const filtered = prev.filter(m => {
        // 1. Strict ID Match
        if (mid && String(m.id) === mid) return false;
        
        // 2. Strict Identity Match (Title + Year)
        // We use trim() and Number() for maximum robustness
        if (m.title.trim() === mTitle.trim() && Number(m.year) === mYear) return false;
        
        return true;
      });
      
      console.log(`Original count: ${prev.length}, New count: ${filtered.length}`);
      return filtered;
    });

    // Close the detail view
    setSelectedMovie(null);
  };

  const handleImportBatch = (newMovies: Movie[]) => {
    if (!isAuthenticated) return;
    setMovies(prev => {
      // Filter out movies that already exist in the library by title + year OR ID
      const filtered = newMovies.filter(nm => 
        !prev.some(pm => (pm.title.trim() === nm.title.trim() && Number(pm.year) === Number(nm.year)) || pm.id === nm.id)
      );
      
      // Also ensure uniqueness within the new batch itself if it has internal duplicates
      const uniqueBatch: Movie[] = [];
      const seenTitles = new Set();
      for (const m of filtered) {
        const key = `${m.title.trim()}-${m.year}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          uniqueBatch.push(m);
        }
      }
      
      return [...uniqueBatch, ...prev];
    });
    setIsSyncOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_admin', 'true');
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('is_admin');
  };

  // Data Filtering Logic
  const watchedMovies = movies.filter(m => !m.isWatchlist);
  const watchlistMovies = movies.filter(m => m.isWatchlist);
  const homeMovies = watchedMovies.slice(0, 30);

  return (
    <div className={`min-h-screen bg-cinema-bg relative selection:bg-lavender selection:text-cinema-ink style-${layoutStyle}`}>
      <Navigation 
        currentView={viewMode} 
        setView={setViewMode} 
        onAdd={() => isAuthenticated ? setIsFormOpen(true) : setIsLoginOpen(true)} 
        onSync={() => isAuthenticated ? setIsSyncOpen(true) : setIsLoginOpen(true)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        layoutStyle={layoutStyle}
        setLayoutStyle={setLayoutStyle}
      />

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GridGallery movies={homeMovies} onSelect={setSelectedMovie} watchlistCount={watchlistMovies.length} layoutStyle={layoutStyle} />
            </motion.div>
          )}

          {viewMode === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArchiveParallaxView movies={watchedMovies} onSelect={setSelectedMovie} layoutStyle={layoutStyle} />
            </motion.div>
          )}

          {viewMode === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-20"
            >
              <WatchlistView movies={watchlistMovies} onSelect={setSelectedMovie} layoutStyle={layoutStyle} />
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Timeline movies={movies} onSelect={setSelectedMovie} />
            </motion.div>
          )}

          {viewMode === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SummaryParallaxView movies={watchedMovies} layoutStyle={layoutStyle} />
            </motion.div>
          )}

          {viewMode === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SettingsPanel layoutStyle={layoutStyle} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetail 
            key={`detail-overlay-${selectedMovie.id}`}
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
            onEdit={(m) => {
               setEditingMovie(m);
               setIsFormOpen(true);
            }}
            onDelete={handleDeleteMovie}
            isAdmin={isAuthenticated}
            layoutStyle={layoutStyle}
          />
        )}
        
        {isFormOpen && (
          <MovieForm 
            key={`form-overlay-${editingMovie?.id || 'new'}`}
            initialMovie={editingMovie || undefined}
            onSave={handleSaveMovie} 
            onClose={() => {
               setIsFormOpen(false);
               setEditingMovie(null);
            }} 
          />
        )}

        {isSyncOpen && (
          <DoubanSync 
            key="sync-overlay"
            onImport={handleImportBatch}
            onClose={() => setIsSyncOpen(false)}
            existingMovies={movies}
          />
        )}

        {isLoginOpen && (
          <LoginForm 
            key="login-overlay"
            onLogin={handleLoginSuccess}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Decorative background grid line for Swiss feel */}
      <div className={`fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-1000 ${
        layoutStyle === 'neo' ? 'opacity-0' : layoutStyle === 'brutalist' ? 'opacity-[0.05]' : 'opacity-[0.03]'
      }`}>
        <div className={`h-full w-full ${layoutStyle === 'brutalist' ? 'grid grid-cols-12 md:grid-cols-24 gap-px' : 'swiss-grid'}`}>
           {Array.from({ length: 48 }).map((_, i) => (
             <div key={`app-bg-grid-${i}-${layoutStyle}`} className={`border border-cinema-ink ${layoutStyle === 'brutalist' ? 'border-dashed' : ''}`} />
           ))}
        </div>
      </div>
      {/* Footer */}
      <Footer layoutStyle={layoutStyle} />

      {/* Floating Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-[100] w-12 h-12 flex items-center justify-center transition-all ${
              layoutStyle === 'neo' ? 'bg-white shadow-2xl rounded-2xl text-lavender' : 
              layoutStyle === 'brutalist' ? 'bg-cinema-ink text-white border-2 border-cinema-ink shadow-[4px_4px_0_white]' : 
              'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
            }`}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
