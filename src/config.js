// API Configuration
// In Vite, environment variables must be prefixed with VITE_ to be exposed to the client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777'

export const config = {
  apiBaseUrl: API_BASE_URL,
  apiEndpoint: `${API_BASE_URL}/getsheetsdata`
}

