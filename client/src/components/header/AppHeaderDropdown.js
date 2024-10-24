import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import defaultAvatar from './../../assets/images/avatars/boy.jpg' // Default avatar image
import Cookies from 'js-cookie'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('Anonymous') // Fallback to 'Anonymous'
  const [userAvatar, setUserAvatar] = useState(defaultAvatar) // Default avatar if none is provided

  useEffect(() => {
    // Retrieve user data from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('User Info:', userInfo) // Debugging line

    if (userInfo && userInfo.name) {
      setUserName(userInfo.name)
    } else {
      setUserName('Anonymous') // Fallback user name
    }

    if (userInfo && userInfo.avatar) {
      setUserAvatar(userInfo.avatar)
    } else {
      setUserAvatar(defaultAvatar) // Fallback to default avatar
    }
  }, [])

  const logoutUser = async () => {
    // Clear cookies
    Cookies.remove('token')
    Cookies.remove('refreshToken')

    // Clear session storage
    sessionStorage.clear()

    // Clear localStorage (optional)
    localStorage.removeItem('user')
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
      alert('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={userAvatar} size="lg" /> {/* Use dynamic avatar */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {userName} {/* Display dynamic user name */}
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilBell} className="me-2" />
          Updates{' '}
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages{' '}
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilTask} className="me-2" />
          Tasks{' '}
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments{' '}
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments{' '}
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilFile} className="me-2" />
          Projects{' '}
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
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
