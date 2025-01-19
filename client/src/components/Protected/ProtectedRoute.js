import React from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { useAuth } from '../../context/AuthContext.js'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const isDevMode = import.meta.env.VITE_APP_NODE_ENV === 'production'

  const isUserLogin = user || Boolean(Cookies.get('token')) || isDevMode

  if (isUserLogin) {
    return children
  } else {
    return <Navigate to="/login" replace />
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
