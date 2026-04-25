import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const isDev = import.meta.env.DEV;

// Keep localhost as a dev-only fallback so production builds do not silently
// point at the user's machine when VITE_API_URL is missing.
const apiBaseUrl = rawApiUrl || (isDev ? 'http://localhost:5000' : '');

if (!rawApiUrl && !isDev) {
  console.warn(
    'VITE_API_URL is not set. API requests will use a relative path in production, which usually means the backend is misconfigured.'
  );
}

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;

export default axios;
