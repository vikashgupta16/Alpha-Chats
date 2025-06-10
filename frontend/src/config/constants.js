// Server configuration with proper URL handling
const getServerUrl = () => {
  // Get the environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    // Ensure no double slashes and proper format
    return envUrl.replace(/\/+$/, ''); // Remove trailing slashes
  }
  
  // Development fallback
  if (!import.meta.env.PROD) {
    return "http://localhost:4000";
  }
  
  // Production fallback (same origin)
  return window.location.origin;
};

export const serverUrl = getServerUrl();

// Debug logging for development
if (!import.meta.env.PROD) {
  console.log('🔧 Server URL configured:', serverUrl);
  console.log('🔧 Environment:', import.meta.env.PROD ? 'Production' : 'Development');
  console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);
}
