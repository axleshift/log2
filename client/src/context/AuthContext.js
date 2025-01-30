import React, { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [profile, setProfile] = useState(null)

  // Check localStorage on initial load for persisted user and token
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('accessToken')
    const storedProfile = localStorage.getItem('profile')

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser))
      setAccessToken(storedToken)
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      }
    }
  }, [])

  const login = (userData, token, profileData = null) => {
    setUser(userData)
    setAccessToken(token)
    setProfile(profileData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', token)
    if (profileData) {
      localStorage.setItem('profile', JSON.stringify(profileData))
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setProfile(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profile')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, profile, setProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
