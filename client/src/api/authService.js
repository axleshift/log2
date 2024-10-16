import axios from 'axios'

const USER_API_URL = `${import.meta.env.VITE_API_URL}/auth`

const userAxiosInstance = axios.create({
  baseURL: USER_API_URL,
  timeout: 10000,
})

// Request interceptor to attach the token from localStorage
userAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // Attach the token to the Authorization header
    }
    return config
  },
  (error) => Promise.reject(error),
)

const handleError = (error) => {
  const message = error.response?.data?.message || 'Something went wrong'
  console.error('API Error:', message, error)
  return null
}

export const loginUser = async (credentials) => {
  try {
    const response = await userAxiosInstance.post('/login', credentials)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await userAxiosInstance.post('/register', userData)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const fetchUserProfile = async () => {
  try {
    const response = await userAxiosInstance.get('/profile')
    return response.data // No need for withCredentials
  } catch (error) {
    return handleError(error)
  }
}

export const updateUserPreferences = async (newPreferences) => {
  try {
    const response = await userAxiosInstance.put('/preferences', { preferences: newPreferences })
    return response.data.preferences
  } catch (error) {
    return handleError(error)
  }
}

// Logout Function
export const logoutUser = async () => {
  try {
    const response = await userAxiosInstance.post('/logout')
    localStorage.removeItem('token') // Remove the token from localStorage
    return response.data // Handle the response from the logout request
  } catch (error) {
    return handleError(error)
  }
}
