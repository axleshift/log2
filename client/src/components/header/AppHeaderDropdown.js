import React, { useState, useEffect } from 'react'
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
import { cilBell, cilEnvelopeOpen, cilSettings, cilTask, cilUser } from '@coreui/icons'
import defaultAvatar from './../../assets/images/avatars/boy.jpg'
import { useAuth } from '../../context/AuthContext.js'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { user, logout } = useAuth()

  useEffect(() => {
    console.log('User object from AuthContext:', user)
  }, [user])

  const userName = user && user.username ? user.username : 'Anonymous'
  const userAvatar = user && user.avatar ? user.avatar : defaultAvatar

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

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={userAvatar} size="lg" /> {/* Dynamic avatar */}
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

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        {/* Sign Out */}
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
