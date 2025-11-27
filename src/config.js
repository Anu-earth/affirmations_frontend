// API Configuration
// In Vite, environment variables must be prefixed with VITE_ to be exposed to the client
// Trim any whitespace from the environment variable
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:7777').trim()

export const config = {
  apiBaseUrl: API_BASE_URL,
  apiEndpoint: `${API_BASE_URL}/getsheetsdata`
}

// Debug logging - always log in production to help diagnose issues
console.log('API Configuration:', {
  apiBaseUrl: config.apiBaseUrl,
  apiEndpoint: config.apiEndpoint,
  envVar: import.meta.env.VITE_API_URL,
  isDev: import.meta.env.DEV
})

