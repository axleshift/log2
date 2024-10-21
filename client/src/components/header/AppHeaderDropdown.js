import React, { useState } from 'react'
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
import CIcon from '@coreui/icons-react'
import avatarboy from './../../assets/images/avatars/boy.jpg'
import Cookies from 'js-cookie'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const logoutUser = async () => {
    // Clear cookies
    Cookies.remove('token')
    Cookies.remove('refreshToken')

    // Clear session storage
    sessionStorage.clear()
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
        <CAvatar src={avatarboy} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
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
