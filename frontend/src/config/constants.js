// Server configuration
export const serverUrl = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? window.location.origin : "http://localhost:4000")
