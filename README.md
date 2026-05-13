# Cinema Archive

A high-aesthetic personal movie viewing archive with Swiss Modernism design. Track, rate, and visualize your film journey — with TMDB metadata, Douban history import, and Emby server integration.

一个高审美私人观影档案系统，瑞士现代主义设计风格。追踪、评分、可视化你的电影之旅 — 支持 TMDB 元数据、豆瓣历史导入、Emby 服务器对接。

---

## Features

- **Multiple View Modes** — Grid Gallery, Archive Parallax, Watchlist Filmstrip, Chronological Timeline, Statistical Summary
- **TMDB Integration** — Real-time movie search with auto-fill, poster/backdrop fetching, genre/cast/director metadata
- **Douban History Import** — One-click import from your Douban movie collection via server-side proxy
- **Emby Server Integration** — Display latest 5 imports from your Emby media server on homepage
- **AI-Free Metadata Engine** — Genre-based rule engine generates mood tags, emotional profiles (5-dimension radar chart), and aesthetic color palettes
- **Three Design Systems** — Swiss (modernist clean), Brutalist (raw/bold), Neo (soft/glassmorphism)
- **Movie Radar Charts** — 5-dimensional emotional analysis visualization per film
- **Viewing Persona** — Genre-based viewer archetype classification
- **Local-First** — All data stored in browser localStorage, no external database required
- **Admin Settings Panel** — TMDB API token, Emby server config, site name, account credentials all manageable in-app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.8, Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | Motion (Framer Motion) |
| Charts | Recharts (Radar charts) |
| Icons | Lucide React |
| Server | Express 4 (Node.js) |
| APIs | TMDB API, Emby API, Douban scraping proxy |

---

## Project Structure

```
moviefeel/
├── server.ts              # Express dev/prod server + proxy routes
├── vite.config.ts         # Vite build config
├── tsconfig.json          # TypeScript config
├── package.json           # Dependencies & scripts
├── index.html             # SPA entry point
├── dist/                  # Production build output
├── src/
│   ├── main.tsx           # React entry
│   ├── App.tsx            # Root component, state management, view routing
│   ├── types.ts           # Movie, EmotionalData, ViewMode types
│   ├── constants.ts       # Seed data
│   ├── index.css          # Global styles, Tailwind theme, font imports
│   ├── services/
│   │   ├── configService.ts    # Site name + Emby config (localStorage)
│   │   ├── authService.ts      # Credential management (localStorage)
│   │   ├── tmdbService.ts      # TMDB API (search, details, connection test)
│   │   ├── embyService.ts      # Emby API (recent items, connection test)
│   │   ├── metadataService.ts  # Genre-rule metadata engine (replaces AI)
│   │   └── doubanService.ts    # Douban HTML scraping + TMDB enrichment
│   └── components/
│       ├── Navigation.tsx       # Top nav bar, view switching, admin controls
│       ├── GridGallery.tsx      # Home: hero carousel, favorites, recent imports, movie grid
│       ├── RecentImports.tsx    # Emby latest imports section
│       ├── ArchiveParallaxView.tsx  # Parallax archive browsing
│       ├── Timeline.tsx         # Chronological timeline view
│       ├── WatchlistView.tsx    # Watchlist filmstrip view
│       ├── SummaryParallaxView.tsx  # Personal statistics dashboard
│       ├── GenreHeatmap.tsx     # Genre distribution + viewing persona
│       ├── MovieDetail.tsx      # Full-screen movie detail overlay + radar chart
│       ├── MovieForm.tsx        # Add/edit movie form with TMDB search
│       ├── DoubanSync.tsx       # Douban import workflow
│       ├── SettingsPanel.tsx    # Admin settings (TMDB, Emby, site name, account)
│       ├── LoginForm.tsx        # Admin authentication
│       └── Footer.tsx           # Site footer
└── docs/
    └── superpowers/
        ├── specs/               # Design specification documents
        └── plans/               # Implementation plans
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **TMDB API Read Access Token** — [Get one here](https://www.themoviedb.org/settings/api) (free)
- (Optional) Emby server with API key for "Recent Imports" feature

### Installation

```bash
git clone https://github.com/terrenceftz/moviefeel.git
cd moviefeel
npm install
```

### Development

```bash
npm run dev
```

Starts Express + Vite dev server at `http://localhost:3000`.

### Production Build

```bash
npm run build
NODE_ENV=production npm start
```

Serves optimized static files from `dist/` at `http://localhost:3000`.

---

## Configuration

All configuration is managed through the **Settings page** in-app (navigate to it via the gear icon after logging in).

### Admin Access

- Default credentials: `Terrence` / `admin123`
- Change username and password in Settings → Account Management

### TMDB API

1. Get a free API Read Access Token from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Open Settings → TMDB API Configuration
3. Paste your token and click Save
4. Use "Test Connection" to verify

Alternatively, set the environment variable:
```bash
VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
```
(If both are set, the in-app token takes priority.)

### Emby Server (Optional)

1. Open Settings → Emby Server
2. Enter your Emby server URL (e.g., `https://emby.yourdomain.com`)
3. Enter your Emby API Key (from Emby Dashboard → API Keys)
4. Click "Test Connection" to verify, then Save
5. The homepage will display the 5 most recently added movies/TV shows

### Site Name

- Open Settings → Site Settings
- Change the site name — updates navigation bar, footer, and browser tab title in real time

---

## Views

| View | Route | Description |
|------|-------|-------------|
| **Home** (Grid) | Default | Hero carousel, Emby recent imports, favorites, genre heatmap, full movie grid |
| **Archive** | Archive | Parallax-scrolling immersive archive with giant title text effects |
| **Watchlist** | Watchlist | Film-strip layout for planned-to-watch movies |
| **Timeline** | Timeline | Chronological viewing history with dot indicators |
| **Summary** | Summary | Personal statistics: total films, hours, top directors/genres/actors, hall of fame |
| **Settings** | Settings | Admin panel (requires login): TMDB, Emby, site name, account management |

---

## Douban Import

1. Login to admin (click the `+` button if not authenticated)
2. Click the sync button (refresh icon) in the navigation bar
3. Enter your Douban user ID or profile URL
4. Preview fetched movies, then sync to your archive
5. Movies are automatically enriched with TMDB metadata (posters, ratings, genres)

---

## API Proxy Routes

The Express server provides two proxy endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/douban-proxy?url=...` | Proxies Douban HTML pages (bypasses CORS) |
| `GET /api/emby-proxy?url=...` | Proxies Emby API requests (avoids CORS, token-safe) |
| `GET /api/health` | Health check |

---

## Design

Three visual themes, toggleable from the navigation bar:

- **Swiss** — Clean modernist, monochrome, sharp borders, subtle shadows
- **Brutalist** — Raw, bold, heavy borders, hard shadows, yellow/black contrast
- **Neo** — Soft, glassmorphism, large rounded corners, diffused shadows

---

## Data Storage

All data is stored in the browser:

| Key | Content |
|-----|---------|
| `cinema_archive_movies` | Full movie collection (JSON array) |
| `cinema_layout_style` | Current design theme |
| `cinema_tmdb_token` | TMDB API Read Access Token |
| `cinema_emby_config` | Emby server URL + API token |
| `cinema_admin_credentials` | Admin username + password |
| `cinema_site_name` | Custom site name |
| `is_admin` (sessionStorage) | Login session flag |

No server-side database required. Clear browser data to reset everything to defaults.
