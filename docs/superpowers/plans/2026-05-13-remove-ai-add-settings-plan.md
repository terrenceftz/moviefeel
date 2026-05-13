# Remove AI + Add Settings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Gemini AI metadata generation with local rule-based logic from TMDB data, and add an admin settings page for TMDB API token management.

**Architecture:** New `metadataService.ts` computes moodTags/emotionalProfile/primaryColor from genre+rating using lookup tables. New `SettingsPanel.tsx` is a full-screen view (like SummaryParallaxView) for managing TMDB token via localStorage. `tmdbService.ts` is refactored to read token from localStorage first, falling back to env var.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 4, motion (framer-motion), lucide-react

---

### Task 1: Create metadataService.ts

**Files:**
- Create: `src/services/metadataService.ts`

- [ ] **Step 1: Write the metadata service**

```typescript
import { Movie, EmotionalData } from "../types";

// Genre → mood tag mapping
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

// Genre → emotional dimension weights
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

// Genre → primary color
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

function findGenreMatch(genres: string[], map: Record<string, string>): string | undefined {
  for (const genre of genres) {
    // Try case-insensitive match
    const key = Object.keys(map).find(k => k.toLowerCase() === genre.toLowerCase());
    if (key) return map[key];
  }
  return undefined;
}

function normalizeGenre(genre: string): string {
  const lower = genre.trim().toLowerCase();
  // Map common variants back to canonical keys
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
```

- [ ] **Step 2: Commit**

```bash
git add src/services/metadataService.ts
git commit -m "feat: add local rule-based metadata service to replace Gemini AI"
```

---

### Task 2: Delete geminiService.ts

**Files:**
- Delete: `src/services/geminiService.ts`

- [ ] **Step 1: Delete the file**

```bash
rm src/services/geminiService.ts
```

- [ ] **Step 2: Commit**

```bash
git add -u src/services/geminiService.ts
git commit -m "feat: remove Gemini AI service, replaced by metadataService"
```

---

### Task 3: Update types.ts — add 'settings' to ViewMode

**Files:**
- Modify: `src/types.ts:33`

- [ ] **Step 1: Edit ViewMode type**

```typescript
export type ViewMode = 'grid' | 'timeline' | 'gallery' | 'summary' | 'archive' | 'watchlist' | 'settings';
```

Replace line 33 of `src/types.ts`:
```
export type ViewMode = 'grid' | 'timeline' | 'gallery' | 'summary' | 'archive' | 'watchlist';
```
With:
```
export type ViewMode = 'grid' | 'timeline' | 'gallery' | 'summary' | 'archive' | 'watchlist' | 'settings';
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add 'settings' to ViewMode type"
```

---

### Task 4: Refactor tmdbService.ts — localStorage token support

**Files:**
- Modify: `src/services/tmdbService.ts`

- [ ] **Step 1: Add getAccessToken and refactor getHeaders**

Replace the entire file content with:

```typescript
function getAccessToken(): string | undefined {
  const localToken = localStorage.getItem('cinema_tmdb_token');
  if (localToken) return localToken;
  return import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
}

const getHeaders = () => {
  const token = getAccessToken();
  return {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'person';
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  const token = getAccessToken();

  if (!token || token === 'YOUR_TMDB_READ_ACCESS_TOKEN') {
    console.warn('TMDB API 令牌未配置。请在设置页面中填写 TMDB Read Access Token');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=zh-CN`,
      { method: 'GET', headers: getHeaders() }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error('TMDB API 响应错误:', response.status, errData);
      return [];
    }

    const data = await response.json();
    return data.results?.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv') || [];
  } catch (error) {
    console.error('TMDB 搜索请求异常:', error);
    return [];
  }
}

export async function getMovieDetails(tmdbId: number, type: 'movie' | 'tv' = 'movie') {
  const token = getAccessToken();
  if (!token || token === 'YOUR_TMDB_READ_ACCESS_TOKEN') return null;

  try {
    const [detailResp, creditsResp] = await Promise.all([
      fetch(`${BASE_URL}/${type}/${tmdbId}?language=zh-CN`, { method: 'GET', headers: getHeaders() }),
      fetch(`${BASE_URL}/${type}/${tmdbId}/credits`, { method: 'GET', headers: getHeaders() })
    ]);

    if (!detailResp.ok) return null;

    const details = await detailResp.json();
    const creditsData = await creditsResp.json();

    const director = type === 'movie'
      ? (creditsData.crew?.find((c: any) => c.job === 'Director')?.name || '未知导演')
      : (details.created_by?.[0]?.name || '未知创作');

    const year = type === 'movie'
      ? (details.release_date ? new Date(details.release_date).getFullYear() : 0)
      : (details.first_air_date ? new Date(details.first_air_date).getFullYear() : 0);

    const cast = creditsData.cast?.slice(0, 5).map((c: any) => c.name) || [];

    return {
      title: details.title || details.name,
      director: director,
      cast: cast,
      year: year,
      runtime: details.runtime || (details.episode_run_time ? details.episode_run_time[0] : undefined),
      posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
      backdropUrl: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : '',
      overview: details.overview,
      tmdbRating: details.vote_average,
      genre: details.genres?.map((g: any) => g.name) || []
    };
  } catch (error) {
    console.error('TMDB 详情获取异常:', error);
    return null;
  }
}

export async function testTmdbConnection(token: string): Promise<boolean> {
  try {
    const resp = await fetch(`${BASE_URL}/authentication`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return resp.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/tmdbService.ts
git commit -m "feat: add localStorage-based TMDB token support with connection test"
```

---

### Task 5: Create SettingsPanel.tsx

**Files:**
- Create: `src/components/SettingsPanel.tsx`

- [ ] **Step 1: Write the settings panel component**

```typescript
import React, { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle, XCircle, Loader2, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { testTmdbConnection } from '../services/tmdbService';

interface SettingsPanelProps {
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ layoutStyle }) => {
  const [token, setToken] = useState(() => localStorage.getItem('cinema_tmdb_token') || '');
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);

  const heroClasses = {
    swiss: "bg-cinema-ink text-white",
    brutalist: "bg-cinema-ink text-white border-b-8 border-lavender",
    neo: "bg-gradient-to-br from-cinema-ink to-lavender-dark text-white rounded-b-[3rem]"
  };

  const cardClasses = {
    swiss: "bg-white border border-cinema-ink/10 shadow-sm",
    brutalist: "bg-white border-2 border-cinema-ink shadow-[6px_6px_0_#1a1a1a]",
    neo: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"
  };

  const handleSave = () => {
    if (token.trim()) {
      localStorage.setItem('cinema_tmdb_token', token.trim());
    } else {
      localStorage.removeItem('cinema_tmdb_token');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setConnectionStatus('testing');
    const ok = await testTmdbConnection(token.trim());
    setConnectionStatus(ok ? 'success' : 'error');
    setTesting(false);
  };

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`px-6 md:px-12 py-16 md:py-24 ${heroClasses[layoutStyle]}`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 flex items-center justify-center ${
              layoutStyle === 'neo' ? 'bg-white/20 rounded-full' : 'bg-lavender'
            }`}>
              <Key size={24} className={layoutStyle === 'neo' ? 'text-white' : 'text-cinema-ink'} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Admin Panel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">设置</h1>
          <p className={`text-lg md:text-xl opacity-70 max-w-xl ${layoutStyle === 'brutalist' ? 'font-mono' : 'font-serif italic'}`}>
            管理 TMDB API 连接与系统配置
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 md:p-10 ${cardClasses[layoutStyle]}`}
        >
          <h2 className="text-xl font-black uppercase tracking-wider mb-8 flex items-center space-x-2">
            <span className="w-2 h-6 bg-lavender block" />
            <span>TMDB API 配置</span>
          </h2>

          <div className="space-y-6">
            {/* Token Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/60">
                API Read Access Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={e => {
                    setToken(e.target.value);
                    setConnectionStatus('idle');
                  }}
                  placeholder="eyJhbGciOiJIUzI1NiJ9..."
                  className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none p-4 pr-12 text-sm font-mono transition-colors ${
                    layoutStyle === 'neo' ? 'rounded-xl' : ''
                  }`}
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-ink/40 hover:text-cinema-ink transition-colors"
                  type="button"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-cinema-ink/40 leading-relaxed">
                在 <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-cinema-ink">themoviedb.org/settings/api</a> 获取你的 API Read Access Token。Token 将安全存储在浏览器本地。
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-black uppercase tracking-widest text-sm transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
                } ${layoutStyle === 'neo' ? 'rounded-full' : ''}`}
              >
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                <span>{saved ? '已保存' : '保存配置'}</span>
              </button>

              <button
                onClick={handleTest}
                disabled={!token.trim() || testing}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-black uppercase tracking-widest text-sm border-2 border-cinema-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  connectionStatus === 'success'
                    ? 'bg-green-50 text-green-700 border-green-500'
                    : connectionStatus === 'error'
                    ? 'bg-red-50 text-red-700 border-red-500'
                    : 'hover:bg-zinc-50 text-cinema-ink'
                } ${layoutStyle === 'neo' ? 'rounded-full' : ''}`}
              >
                {connectionStatus === 'testing' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : connectionStatus === 'success' ? (
                  <CheckCircle size={18} />
                ) : connectionStatus === 'error' ? (
                  <XCircle size={18} />
                ) : (
                  <span className="text-lg">⚡</span>
                )}
                <span>
                  {connectionStatus === 'testing' ? '测试中...' :
                   connectionStatus === 'success' ? '连接成功' :
                   connectionStatus === 'error' ? '连接失败' : '测试连接'}
                </span>
              </button>
            </div>

            {/* Status Info */}
            <div className={`p-4 text-xs font-mono space-y-2 ${
              layoutStyle === 'neo' ? 'bg-zinc-50 rounded-2xl' : 'bg-zinc-50'
            }`}>
              <div className="flex justify-between">
                <span className="opacity-50">Token 状态:</span>
                <span className={token.trim() ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {token.trim() ? '已配置' : '未配置'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">环境变量 (VITE_TMDB_READ_ACCESS_TOKEN):</span>
                <span className={import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ? '已设置' : '未设置'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">读取优先级:</span>
                <span className="font-bold">本地配置 → 环境变量</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attributions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cinema-ink/30">
            Powered by TMDB · Data provided by The Movie Database
          </p>
        </motion.div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SettingsPanel.tsx
git commit -m "feat: add admin settings panel with TMDB token management"
```

---

### Task 6: Update MovieForm.tsx — replace AI import

**Files:**
- Modify: `src/components/MovieForm.tsx`

- [ ] **Step 1: Change the import**

Change line 4:
```typescript
import { enhanceMovieMetadata } from '../services/geminiService';
```
To:
```typescript
import { enhanceMovieMetadata } from '../services/metadataService';
```

- [ ] **Step 2: Update the submit button loading text**

Change line 299:
```typescript
{loading ? <><Loader2 className="animate-spin" /> <span>AI 正在捕捉电影质感...</span></> : <span>保存记录</span>}
```
To:
```typescript
{loading ? <><Loader2 className="animate-spin" /> <span>正在生成电影元数据...</span></> : <span>保存记录</span>}
```

- [ ] **Step 3: Update the quote field label**

Change line 215:
```typescript
<label className="text-[10px] font-bold uppercase tracking-widest">经典金句台词 (AI 自动捕捉或手动输入)</label>
```
To:
```typescript
<label className="text-[10px] font-bold uppercase tracking-widest">经典金句台词 (手动输入)</label>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MovieForm.tsx
git commit -m "feat: switch MovieForm from Gemini AI to local metadata service"
```

---

### Task 7: Update Navigation.tsx — add settings entry for admin

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Add Settings icon import**

Change line 3:
```typescript
import { Film, Calendar, LayoutGrid, ListFilter, Plus, LogOut, User, RefreshCw, BarChart3, Menu, X } from 'lucide-react';
```
To:
```typescript
import { Film, Calendar, LayoutGrid, ListFilter, Plus, LogOut, User, RefreshCw, BarChart3, Menu, X, Settings } from 'lucide-react';
```

- [ ] **Step 2: Add settings button in desktop actions section**

After the sync button (line 122 `</button>`), insert:
```typescript
                <button 
                  onClick={() => setView('settings')}
                  className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 border border-cinema-ink items-center justify-center hover:bg-lavender transition-colors ${btnClasses[layoutStyle]}`}
                  title="设置"
                >
                  <Settings size={14} />
                </button>
```

- [ ] **Step 3: Add settings button in mobile management section**

In the mobile menu's Management section, after the logout button (line 228 `</button>`), insert a new button before the closing `</div>`:
```typescript
                    <button 
                      onClick={() => {
                        setView('settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 flex items-center justify-center space-x-2 p-3 bg-zinc-200 border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <Settings size={14} />
                      <span className="text-xs font-bold">系统设置</span>
                    </button>
```

Wait — the mobile management section has two buttons in a flex row. Adding a third would make it three. Let me restructure the mobile management buttons into a grid with 2 columns:

Replace the mobile management section (lines 204-229) with:
```typescript
              {isAuthenticated && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/40 ml-2">Management 管理</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        onSync();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-lavender border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <RefreshCw size={14} />
                      <span className="text-xs font-bold">同步豆瓣</span>
                    </button>
                    <button 
                      onClick={() => {
                        setView('settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-zinc-200 border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <Settings size={14} />
                      <span className="text-xs font-bold">系统设置</span>
                    </button>
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 p-3 bg-zinc-200 border border-cinema-ink text-cinema-ink transition-colors ${btnClasses[layoutStyle]}`}
                    >
                      <LogOut size={14} />
                      <span className="text-xs font-bold">退出登录</span>
                    </button>
                  </div>
                </div>
              )}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat: add settings gear icon to navigation for admin users"
```

---

### Task 8: Update App.tsx — add settings view

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add SettingsPanel import**

After line 14 (`import { DoubanSync } from './components/DoubanSync';`), add:
```typescript
import { SettingsPanel } from './components/SettingsPanel';
```

- [ ] **Step 2: Add settings view in AnimatePresence**

After the summary view block (line 279 `)}` ), add:
```typescript

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
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add settings view routing in App"
```

---

### Task 9: Update Footer.tsx — remove AI branding

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Change the footer tagline**

Change line 83:
```typescript
<span>Built with Antigravity AI Engine</span>
```
To:
```typescript
<span>Powered by TMDB & Cinema Archive</span>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "chore: update footer branding, remove AI engine reference"
```

---

### Task 10: Clean up config files

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `index.html`
- Modify: `metadata.json`

- [ ] **Step 1: Remove @google/genai from package.json**

Delete the line `"@google/genai": "^1.29.0",` from `package.json` dependencies.

- [ ] **Step 2: Remove GEMINI_API_KEY from vite.config.ts**

Change vite.config.ts:
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
```

(Removes `loadEnv`, the `define` block with `process.env.GEMINI_API_KEY`, and the function wrapper.)

- [ ] **Step 3: Update index.html title**

Change line 4:
```html
<title>My Google AI Studio App</title>
```
To:
```html
<title>Cinema Archive</title>
```

- [ ] **Step 4: Update metadata.json**

```json
{
  "name": "Cinema Archive",
  "description": "A high-aesthetic movie viewing record system with Swiss Modernism design and TMDB integration.",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "CINEMATIC_DATA_VISUALIZATION",
    "TMDB_METADATA_ENRICHMENT"
  ]
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts index.html metadata.json
git commit -m "chore: remove Google GenAI dependency, update config files and branding"
```

---

### Task 11: Install, build, and verify

**Files:** None (verification only)

- [ ] **Step 1: Install dependencies (remove unused packages)**

```bash
cd C:/Users/HUAWEI/moviefeel && npm install
```
Expected: No errors, no `@google/genai` in node_modules.

- [ ] **Step 2: TypeScript type check**

```bash
cd C:/Users/HUAWEI/moviefeel && npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Build**

```bash
cd C:/Users/HUAWEI/moviefeel && npm run build
```
Expected: Build succeeds, generates dist/ with index.html, CSS, JS.

- [ ] **Step 4: Verify settings page renders**

Start the server:
```bash
cd C:/Users/HUAWEI/moviefeel && NODE_ENV=production npm start &
```
Visit `http://localhost:3000` and verify:
- Navigation shows settings gear icon after login
- Settings page renders with token input, save, and test buttons
- TMDB search still works in MovieForm
- Movie save generates metadata via local rules (no Gemini call)

- [ ] **Step 5: Final commit (if any fixes)**

```bash
git add -A
git commit -m "chore: final verification fixes"
```
