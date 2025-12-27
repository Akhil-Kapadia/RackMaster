import axios, { AxiosInstance } from 'axios'

const DEFAULT_TIMEOUT = 30000

// Use Vite environment variable `API_BASE_URL` in development.
// Fallback to http://localhost:8000 if the env var is not set.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT,
})

export default api
