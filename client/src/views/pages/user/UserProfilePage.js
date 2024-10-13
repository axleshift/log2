import React from 'react'
import UserProfile from '../../../components/UserProfile/UserProfile.js'
import { useUserContext } from '../../../context/UserContext.js'

const UserProfilePage = () => {
  const { user, loading, errorMessage, updatePreferences } = useUserContext()

  const handleUpdatePreferences = async (newPreferences) => {
    await updatePreferences(newPreferences)
  }

  if (loading) {
    return <div>Loading user profile...</div>
  }

  if (errorMessage) {
    return <div className="error">{errorMessage}</div>
  }

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <UserProfile user={user} onUpdate={handleUpdatePreferences} />
      ) : (
        <div>No user data available.</div>
      )}
    </div>
  )
}

export default UserProfilePage
