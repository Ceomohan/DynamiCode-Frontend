import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

const normalizeApiBaseUrl = (value) => {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.includes('||')) {
    console.error(
      `Invalid VITE_API_URL: "${trimmed}". Environment variables must be a single URL (do not use "||").`
    );
    return '';
  }

  try {
    // Ensure it's an absolute URL. axios will throw a cryptic error if this is invalid.
    // eslint-disable-next-line no-new
    new URL(trimmed);
    return trimmed;
  } catch {
    console.error(`Invalid VITE_API_URL: "${trimmed}". Expected a full URL like "http://localhost:7000".`);
    return '';
  }
};

const normalizedApiUrl = normalizeApiBaseUrl(rawApiUrl);

// Keep localhost as a dev-only fallback so production builds do not silently
// point at the user's machine when VITE_API_URL is missing.
const apiBaseUrl = normalizedApiUrl || (isDev ? 'http://localhost:7000' : '');

if (!normalizedApiUrl && !isDev) {
  console.warn(
    'VITE_API_URL is not set. API requests will use a relative path in production, which usually means the backend is misconfigured.'
  );
}

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;

export default axios;
