export interface EmotionalData {
  intensity: number; // 0-100
  label: string;
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  posterUrl: string;
  tmdbRating: number; // TMDB average rating 0-10
  overview: string; // TMDB synopsis
  viewingDate: string;
  genre: string[];
  cast?: string[];
  runtime?: number; // minutes
  isFavorite?: boolean;
  isWatchlist?: boolean;
  
  // User Personal Records
  userRating: number; // User's rating 0-10
  userComment: string; // User's review/comment
  
  // AI/Extra Visual metadata
  quote?: string;
  moodTags?: string[];
  emotionalProfile?: EmotionalData[];
  primaryColor?: string; 
  backdropUrl?: string; 
}

export type ViewMode = 'grid' | 'timeline' | 'gallery' | 'summary' | 'archive' | 'watchlist';
