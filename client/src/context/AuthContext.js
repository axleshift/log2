import React, { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Check localStorage on initial load for persisted user and token
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('accessToken')

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser))
      setAccessToken(storedToken)
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
