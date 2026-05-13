import { Movie, EmotionalData } from "../types";

// Genre -> mood tag mapping
const GENRE_MOOD_MAP: Record<string, string> = {
  "Drama": "#深刻",
  "Sci-Fi": "#未来",
  "Science Fiction": "#未来",
  "Action": "#激烈",
  "Romance": "#浪漫",
  "Thriller": "#紧张",
  "Mystery": "#悬疑",
  "Comedy": "#轻松",
  "Horror": "#惊悚",
  "Fantasy": "#奇幻",
  "Documentary": "#真实",
  "Animation": "#梦幻",
  "History": "#史诗",
  "War": "#沉重",
  "Crime": "#黑暗",
  "Adventure": "#探索",
  "Music": "#韵律",
};

// Genre -> emotional dimension weights
// Dimensions: 情感深度, 视觉冲击, 叙事张力, 人文关怀, 想象力
const GENRE_EMOTIONAL_WEIGHTS: Record<string, [number, number, number, number, number]> = {
  "Drama": [40, 10, 15, 25, 5],
  "Sci-Fi": [10, 40, 10, 5, 40],
  "Science Fiction": [10, 40, 10, 5, 40],
  "Action": [5, 40, 30, 5, 10],
  "Romance": [30, 15, 10, 15, 5],
  "Thriller": [10, 20, 40, 5, 10],
  "Mystery": [10, 15, 35, 10, 20],
  "Comedy": [15, 10, 10, 20, 15],
  "Horror": [10, 30, 30, 5, 15],
  "Fantasy": [10, 30, 15, 10, 40],
  "Documentary": [15, 5, 5, 40, 5],
  "Animation": [20, 25, 10, 10, 35],
  "History": [20, 15, 15, 35, 5],
  "War": [25, 25, 20, 30, 5],
  "Crime": [15, 15, 35, 10, 10],
  "Adventure": [10, 30, 20, 10, 25],
  "Music": [25, 15, 10, 20, 15],
};

// Genre -> primary color
const GENRE_COLOR_MAP: Record<string, string> = {
  "Drama": "#4A4A6A",
  "Sci-Fi": "#00B4D8",
  "Science Fiction": "#00B4D8",
  "Action": "#E63946",
  "Romance": "#E07A9E",
  "Thriller": "#2D2D3F",
  "Mystery": "#3D405B",
  "Comedy": "#F4A261",
  "Horror": "#1A1A1A",
  "Fantasy": "#9B5DE5",
  "Documentary": "#606C38",
  "Animation": "#F77F00",
  "History": "#8B6914",
  "War": "#5C4033",
  "Crime": "#1C1C1C",
  "Adventure": "#2A9D8F",
  "Music": "#E76F51",
};

const DEFAULT_COLOR = "#6C63FF";

const EMOTIONAL_DIMENSION_LABELS = ["情感深度", "视觉冲击", "叙事张力", "人文关怀", "想象力"];

function normalizeGenre(genre: string): string {
  const lower = genre.trim().toLowerCase();
  const aliases: Record<string, string> = {
    "drama": "Drama",
    "sci-fi": "Sci-Fi",
    "science fiction": "Science Fiction",
    "action": "Action",
    "romance": "Romance",
    "thriller": "Thriller",
    "mystery": "Mystery",
    "comedy": "Comedy",
    "horror": "Horror",
    "fantasy": "Fantasy",
    "documentary": "Documentary",
    "animation": "Animation",
    "history": "History",
    "war": "War",
    "crime": "Crime",
    "adventure": "Adventure",
    "music": "Music",
  };
  return aliases[lower] || genre;
}

export function computeMoodTags(genres: string[]): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const genre of genres) {
    const canonical = normalizeGenre(genre);
    const tag = GENRE_MOOD_MAP[canonical];
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
    if (tags.length >= 3) break;
  }
  return tags;
}

export function computeEmotionalProfile(genres: string[], voteAverage: number): EmotionalData[] {
  const scores = [15, 15, 15, 15, 15]; // base for each dimension
  const ratingFactor = Math.max(0.8, Math.min(1.2, voteAverage / 10)); // 0.8x-1.2x based on rating

  for (const genre of genres) {
    const canonical = normalizeGenre(genre);
    const weights = GENRE_EMOTIONAL_WEIGHTS[canonical];
    if (weights) {
      for (let i = 0; i < 5; i++) {
        scores[i] = Math.max(scores[i], weights[i]);
      }
    }
  }

  return EMOTIONAL_DIMENSION_LABELS.map((label, i) => ({
    label,
    intensity: Math.min(100, Math.round(scores[i] * ratingFactor)),
  }));
}

export function computePrimaryColor(genres: string[]): string {
  for (const genre of genres) {
    const canonical = normalizeGenre(genre);
    const color = GENRE_COLOR_MAP[canonical];
    if (color) return color;
  }
  return DEFAULT_COLOR;
}

export function enhanceMovieMetadata(movie: Partial<Movie>): Partial<Movie> {
  const genres = movie.genre || [];

  return {
    ...movie,
    moodTags: movie.moodTags && movie.moodTags.length > 0 ? movie.moodTags : computeMoodTags(genres),
    emotionalProfile: movie.emotionalProfile && movie.emotionalProfile.length > 0
      ? movie.emotionalProfile
      : computeEmotionalProfile(genres, movie.tmdbRating || movie.userRating || 7),
    primaryColor: movie.primaryColor || computePrimaryColor(genres),
    // quote is never auto-generated; only user-provided
  };
}
