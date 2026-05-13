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
