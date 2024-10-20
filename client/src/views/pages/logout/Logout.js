// src/Logout.js
import React from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      //clear cookies
      Cookies.remove('token')
      Cookies.remove('refreshToken')

      // Clear session storage
      sessionStorage.clear()

      alert('Logged out successfully!')
      navigate('/login') // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return <button onClick={handleLogout}>Logout</button>
}

export default Logout
