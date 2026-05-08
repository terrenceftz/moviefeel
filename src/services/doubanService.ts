import { TMDBMovie, searchMovies, getMovieDetails } from './tmdbService';

export interface DoubanMovie {
  title: string;
  originalTitle?: string;
  doubanId: string;
  rating: number;
  viewingDate: string;
  comment?: string;
  year?: number;
  tmdbId?: number;
}

export async function fetchDoubanMovies(doubanId: string, page: number = 0): Promise<DoubanMovie[]> {
  try {
    // 1. Smart ID extraction: if user pasted a URL, extract the ID
    let id = doubanId.trim();
    if (id.includes('douban.com/people/')) {
      const match = id.match(/people\/([^/]+)/);
      if (match) id = match[1];
    }
    id = id.replace(/\/$/, ''); // Remove trailing slash

    const start = page * 15; // Douban grid mode usually shows 15 items per page
    const url = `https://movie.douban.com/people/${id}/collect?sort=time&start=${start}&filter=all&mode=grid`;
    const targetPath = `/api/douban-proxy?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(window.location.origin + targetPath);
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('用户不存在，请检查豆瓣ID是否正确');
      if (response.status === 403) throw new Error('豆瓣访问受限，请稍后再试或检查用户隐私设置');
      throw new Error(`Failed to fetch Douban data: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Check for common blocking/privacy issues
    if (html.includes('页面不存在') || html.includes('404 Not Found')) {
      throw new Error('豆瓣页面不存在，请确认 ID 是否正确');
    }
    
    if (html.includes('这个用户还没收集过电影') || html.includes('还没有人收藏过电影')) {
      return []; 
    }

    if (html.includes('由于相关法律法规和政策')) {
      throw new Error('由于法律法规，该用户的记录暂时无法访问');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try multiple selectors
    const items = doc.querySelectorAll('.grid-view .item, .list-view .item, .item');
    
    if (items.length === 0 && (html.includes('登录') || html.includes('验证码'))) {
      throw new Error('触发了豆瓣安全验证或需要登录才能查看，请检查该用户是否公开了观影记录');
    }
    const movies: DoubanMovie[] = [];

    items.forEach(item => {
      const titleLink = item.querySelector('.title a') || item.querySelector('.info .title a');
      const fullTitle = titleLink?.textContent?.trim() || '';
      
      if (!fullTitle) return;

      // Split "Chinese Title / Original Title"
      const titles = fullTitle.split('/').map(t => t.trim());
      const mainTitle = titles[0];
      const originalTitle = titles.length > 1 ? titles[1] : undefined;

      const link = titleLink?.getAttribute('href') || '';
      const doubanIdMatch = link.match(/subject\/(\d+)/);
      const doubanId = doubanIdMatch ? doubanIdMatch[1] : '';
      
      const ratingSpan = item.querySelector('.rating-stars') || item.querySelector('span[class*="rating"]');
      const ratingClass = ratingSpan?.className || '';
      const ratingMatch = ratingClass.match(/rating(\d+)-t/) || ratingClass.match(/allstar(\d+)/);
      const ratingValue = ratingMatch ? parseInt(ratingMatch[1]) : 0;
      
      let rating = 0;
      if (ratingValue >= 10) rating = ratingValue / 10;
      else rating = ratingValue;

      const date = item.querySelector('.date')?.textContent?.trim() || '';
      const comment = item.querySelector('.comment')?.textContent?.trim() || '';

      if (mainTitle && doubanId) {
        movies.push({ 
          title: mainTitle, 
          originalTitle,
          doubanId, 
          rating, 
          viewingDate: date,
          comment
        });
      }
    });

    return movies;
  } catch (error: any) {
    console.error('Douban Fetch Error:', error);
    throw error;
  }
}

export async function enrichWithTMDB(doubanMovie: DoubanMovie) {
  const cleanTitle = (t: string) => {
    return t.replace(/\(\d{4}\)$/, '').trim(); // Remove trailing (2024)
  };

  const trySearch = async (query: string) => {
    if (!query) return null;
    const sanitizedQuery = cleanTitle(query);
    const results = await searchMovies(sanitizedQuery);
    if (results.length > 0) {
      // Prioritize exact matches if possible
      const exactMatch = results.find(r => 
        (r.title?.toLowerCase() === sanitizedQuery.toLowerCase()) || 
        (r.name?.toLowerCase() === sanitizedQuery.toLowerCase()) ||
        (r.title?.toLowerCase() === query.toLowerCase()) || 
        (r.name?.toLowerCase() === query.toLowerCase())
      );
      const bestMatch = exactMatch || results[0];
      return await getMovieDetails(bestMatch.id, bestMatch.media_type as any);
    }
    return null;
  };

  try {
    // 1. Try with main title
    let details = await trySearch(doubanMovie.title);
    
    // 2. Try with original title if main title failed
    if (!details && doubanMovie.originalTitle) {
      details = await trySearch(doubanMovie.originalTitle);
    }
    
    // 3. Fallback: If still no match, try searching with only the first few words if it's very long
    if (!details && doubanMovie.title.length > 10) {
       const shortTitle = doubanMovie.title.split(' ')[0];
       if (shortTitle.length > 1) {
         details = await trySearch(shortTitle);
       }
    }
    
    return details;
  } catch (error) {
    console.error(`TMDB Enrichment failed for ${doubanMovie.title}:`, error);
  }
  return null;
}
