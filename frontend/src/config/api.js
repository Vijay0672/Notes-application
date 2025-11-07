// API Configuration
// In production (Vercel), API is on the same domain, so we use relative URLs
// In development, use the full localhost URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3000')

export default API_BASE_URL

