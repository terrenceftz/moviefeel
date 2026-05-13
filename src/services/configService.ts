const SITE_NAME_KEY = 'cinema_site_name';
const EMBY_CONFIG_KEY = 'cinema_emby_config';
const DEFAULT_SITE_NAME = 'Cinema.Archive';

export interface EmbyConfig {
  serverUrl: string;
  apiToken: string;
}

export function getSiteName(): string {
  return localStorage.getItem(SITE_NAME_KEY) || DEFAULT_SITE_NAME;
}

export function setSiteName(name: string): void {
  localStorage.setItem(SITE_NAME_KEY, name.trim() || DEFAULT_SITE_NAME);
  window.dispatchEvent(new CustomEvent('site-name-changed', { detail: name.trim() || DEFAULT_SITE_NAME }));
}

export function getEmbyConfig(): EmbyConfig | null {
  const stored = localStorage.getItem(EMBY_CONFIG_KEY);
  if (!stored) return null;
  try {
    const config = JSON.parse(stored);
    if (config.serverUrl && config.apiToken) return config;
  } catch {
    // corrupted data
  }
  return null;
}

export function setEmbyConfig(serverUrl: string, apiToken: string): void {
  localStorage.setItem(EMBY_CONFIG_KEY, JSON.stringify({
    serverUrl: serverUrl.replace(/\/+$/, ''),
    apiToken,
  }));
  window.dispatchEvent(new CustomEvent('emby-config-changed'));
}

export function clearEmbyConfig(): void {
  localStorage.removeItem(EMBY_CONFIG_KEY);
}
