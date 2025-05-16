import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Request Interceptor: sets Content-Type properly
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

// Response Interceptor: handle 401 errors by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh-token')

        return api(originalRequest)
      } catch (refreshError) {
        console.error('Session expired, redirecting to login...')

        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Reusable API functions with params and headers flexibility
export const apiService = {
  get: (url, params = {}, headers = {}) => api.get(url, { params, headers }),
  post: (url, data, headers = {}) => api.post(url, data, { headers }),
  put: (url, data, headers = {}) => api.put(url, data, { headers }),
  delete: (url, headers = {}) => api.delete(url, { headers }),
}

export default api

/**import axios from 'axios'

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
**/
