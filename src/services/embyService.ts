import { getEmbyConfig, EmbyConfig } from './configService';

export interface EmbyItem {
  id: string;
  name: string;
  type: 'Movie' | 'Series';
  year?: number;
  imageUrl?: string;
  backdropUrl?: string;
  dateCreated: string;
  overview?: string;
}

function buildImageUrl(config: EmbyConfig, itemId: string, imageTag: string, type: 'Primary' | 'Backdrop'): string {
  return `${config.serverUrl}/emby/Items/${itemId}/Images/${type}?maxHeight=400&tag=${imageTag}&api_key=${config.apiToken}`;
}

export async function fetchRecentItems(): Promise<EmbyItem[]> {
  const config = getEmbyConfig();
  if (!config) return [];

  const embyUrl = `${config.serverUrl}/emby/Items?SortBy=DateCreated&SortOrder=Descending&IncludeItemTypes=Movie,Series&Recursive=true&Limit=5&api_key=${config.apiToken}`;

  try {
    const resp = await fetch(`/api/emby-proxy?url=${encodeURIComponent(embyUrl)}`);
    if (!resp.ok) return [];

    const data = await resp.json();
    const items = data.Items || [];

    return items.map((item: any) => ({
      id: item.Id,
      name: item.Name,
      type: item.Type === 'Series' ? 'Series' : 'Movie',
      year: item.ProductionYear || undefined,
      imageUrl: item.ImageTags?.Primary
        ? buildImageUrl(config, item.Id, item.ImageTags.Primary, 'Primary')
        : undefined,
      backdropUrl: item.ImageTags?.Backdrop
        ? buildImageUrl(config, item.Id, item.ImageTags.Backdrop, 'Backdrop')
        : undefined,
      dateCreated: item.DateCreated,
      overview: item.Overview || undefined,
    }));
  } catch {
    return [];
  }
}

export async function testEmbyConnection(serverUrl: string, apiToken: string): Promise<boolean> {
  const url = `${serverUrl.replace(/\/+$/, '')}/emby/System/Info?api_key=${apiToken}`;
  try {
    const resp = await fetch(`/api/emby-proxy?url=${encodeURIComponent(url)}`);
    return resp.ok;
  } catch {
    return false;
  }
}
