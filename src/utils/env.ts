export const getApiBaseUrl = (): string => {
  const fromEnv = process.env.REACT_APP_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return '';
};

export const getChatServerUrl = (): string => {
  const fromEnv = process.env.REACT_APP_CHAT_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  // Default to same-origin if not configured
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return '';
};

export const buildApiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  if (!base) return path.startsWith('/') ? path : `/${path}`;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};


