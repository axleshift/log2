import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilUser, cilX } from '@coreui/icons'
import defaultAvatar from './../../assets/images/avatars/boy.jpg'
import { useAuth } from '../../context/AuthContext.js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const NOTIFICATION_API_URL = `${API_URL}/api/v1/notifications`

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { user, logout, accessToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  const userName = user?.username || 'Anonymous'
  const userAvatar = user?.avatar || defaultAvatar

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(NOTIFICATION_API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setNotifications(res.data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchNotifications()
    }
  }, [accessToken])

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${NOTIFICATION_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setNotifications((prev) => prev.filter((n) => n._id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const recentNotifications = notifications.slice(0, 5)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
      alert('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClickProfile = () => navigate('/profile')
  const handleClickSettings = () => navigate('/settings')

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={userAvatar} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{ minWidth: '300px' }}>
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{userName}</CDropdownHeader>

        <CDropdownItem style={{ cursor: 'default' }}>
          <CIcon icon={cilBell} className="me-2" />
          Notifications
          <CBadge color="info" className="ms-2">
            {loadingNotifications ? <CSpinner size="sm" /> : unreadCount}
          </CBadge>
        </CDropdownItem>

        {loadingNotifications ? (
          <CDropdownItem disabled>Loading...</CDropdownItem>
        ) : recentNotifications.length === 0 ? (
          <CDropdownItem disabled>No notifications</CDropdownItem>
        ) : (
          recentNotifications.map((n) => (
            <CDropdownItem
              key={n._id}
              className="d-flex justify-content-between align-items-start text-wrap text-dark"
              style={{ whiteSpace: 'normal' }}
            >
              <div>
                <small>{n.message}</small>
                <br />
                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              <CButton
                size="sm"
                color="danger"
                variant="ghost"
                onClick={() => handleDeleteNotification(n._id)}
              >
                <CIcon icon={cilX} />
              </CButton>
            </CDropdownItem>
          ))
        )}

        <CDropdownDivider />

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleClickProfile} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleClickSettings} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem onClick={handleSignOut}>
          <CButton color="primary" role="button" disabled={loading}>
            {loading ? 'Signing Out...' : 'Sign Out'}
          </CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
