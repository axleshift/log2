import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useUserContext } from '../../context/UserContext.js'
import { CSpinner } from '@coreui/react'

const UserProfile = ({ user, onUpdate }) => {
  const { preferences, loading, setPreferences } = useUserContext()
  const [updating, setUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    const success = await onUpdate(preferences)
    setUpdating(false)
    setUpdateMessage(
      success ? 'Preferences updated successfully!' : 'Failed to update preferences.',
    )
  }

  if (loading) {
    return <div>Loading user profile...</div>
  }

  return (
    <div>
      <h1>{user.name}&apos;s Profile</h1>
      <img src={user.profilePicture} alt={`${user.name}&apos;s profile`} />
      <p>Email: {user.email}</p>
      <p>Theme: {preferences.theme}</p>
      <p>Notifications: {preferences.notifications ? 'Enabled' : 'Disabled'}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Language:
          <select name="language" value={preferences.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fil">Filipino</option>
          </select>
        </label>
        <label>
          Theme:
          <select name="theme" value={preferences.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        {updating ? (
          <CSpinner color="primary" />
        ) : (
          <button type="submit">Update Preferences</button>
        )}
      </form>
      {updateMessage && <div>{updateMessage}</div>}
    </div>
  )
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
}

export default UserProfile
