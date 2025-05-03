import React, { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Safe JSON parse
  const parseJSON = (value, key) => {
    try {
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error(`Error parsing JSON for ${key}:`, e)
      localStorage.removeItem(key)
      return null
    }
  }

  // Basic JWT format validation
  const isValidJWT = (token) => {
    return typeof token === 'string' && token.split('.').length === 3
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = parseJSON(localStorage.getItem('user'), 'user')

    if (!token || !isValidJWT(token)) {
      console.warn('Invalid or malformed token. Clearing.')
      localStorage.removeItem('accessToken')
      setAccessToken(null)
      setUser(null)
      return
    }

    if (token && userData) {
      setAccessToken(token)
      setUser(userData)
    }
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setAccessToken(token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', token)
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
