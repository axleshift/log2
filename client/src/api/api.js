import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Automatically send cookies with requests
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor (Handle 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.data?.message || error.message)

    if (error.response?.status === 401) {
      try {
        // Attempt to refresh token automatically
        await api.post('/auth/refresh-token')
        return api(error.config) // Retry the failed request
      } catch (refreshError) {
        console.error('Session expired, redirecting to login...')
        window.location.href = '/login' // Redirect to login page
      }
    }

    return Promise.reject(error)
  },
)

// Reusable API functions
export const apiService = {
  get: (url, params, headers = {}) => api.get(url, { params, headers }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
}

export default api
