import React, { createContext, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { fetchUserProfile, updateUserPreferences } from '../api/authService'

const UserContext = createContext()

const DEFAULT_PREFERENCES = { theme: 'light', language: 'en', notifications: true }

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userProfile = await fetchUserProfile()
          if (userProfile) {
            setUser(userProfile.user)
            setPreferences(userProfile.preferences)
            localStorage.setItem('user', JSON.stringify(userProfile.user)) // Sync with local storage
          }
        }
      } catch (error) {
        setErrorMessage('Failed to load user profile.')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const updatePreferences = async (newPreferences) => {
    try {
      const updatedPreferences = await updateUserPreferences(newPreferences)
      if (updatedPreferences) {
        setPreferences(updatedPreferences)
        localStorage.setItem('preferences', JSON.stringify(updatedPreferences)) // Sync with local storage
      }
    } catch (error) {
      setErrorMessage('Failed to update preferences.')
    }
  }

  const value = useMemo(
    () => ({
      user,
      preferences,
      updatePreferences,
      loading,
      errorMessage,
    }),
    [user, preferences, loading, errorMessage],
  )

  return (
    <UserContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useUserContext = () => {
  return React.useContext(UserContext)
}
