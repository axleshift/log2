import axios from 'axios'

const USER_API_URL = 'http://localhost:3001/auth'

const userAxiosInstance = axios.create({
  baseURL: USER_API_URL,
  timeout: 10000,
})

const handleError = (error) => {
  const message = error.response?.data?.message || 'Something went wrong'
  console.error('API Error:', message, error)
  throw new Error(message)
}

export const loginUser = async (credentials) => {
  try {
    const response = await userAxiosInstance.post('/login', credentials)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await userAxiosInstance.post('/register', userData)
    return response.data
  } catch (error) {
    handleError(error)
  }
}
