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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilTask, cilUser } from '@coreui/icons'
import defaultAvatar from './../../assets/images/avatars/boy.jpg'
import { useAuth } from '../../context/AuthContext.js'

const AppHeaderDropdown = () => {
  const [loading, setLoading] = useState(false)
  const [updatesModalVisible, setUpdatesModalVisible] = useState(false)
  const [messagesModalVisible, setMessagesModalVisible] = useState(false)
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const { user, logout } = useAuth()

  useEffect(() => {
    console.log('User object from AuthContext:', user)
  }, [user])

  const userName = user?.username || 'Anonymous'
  const userAvatar = user?.avatar || defaultAvatar

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed', error)
      alert('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Sample notifications and messages
  const notifications = [
    { id: 1, message: 'New user registered', time: '10 mins ago' },
    { id: 2, message: 'New order placed', time: '30 mins ago' },
    { id: 3, message: 'System maintenance scheduled', time: '1 hour ago' },
  ]

  const messages = [
    { id: 1, sender: 'John Doe', content: 'Hey, can we reschedule?', time: '5 mins ago' },
    { id: 2, sender: 'Jane Smith', content: 'Your order has been shipped.', time: '1 hour ago' },
    { id: 3, sender: 'Support', content: 'Your ticket has been updated.', time: '2 hours ago' },
  ]

  const handleReply = (message) => {
    setSelectedMessage(message)
    setReplyModalVisible(true)
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={userAvatar} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
            {userName}
          </CDropdownHeader>

          <CDropdownItem onClick={() => setUpdatesModalVisible(true)} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilBell} className="me-2" />
            Updates
            <CBadge color="info" className="ms-2">
              {notifications.length}
            </CBadge>
          </CDropdownItem>

          <CDropdownItem
            onClick={() => setMessagesModalVisible(true)}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
            <CBadge color="success" className="ms-2">
              {messages.length}
            </CBadge>
          </CDropdownItem>

          <CDropdownItem>
            <CIcon icon={cilTask} className="me-2" />
            Tasks
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>

          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem style={{ cursor: 'pointer' }}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>

          <CDropdownDivider />
          <CDropdownItem onClick={handleSignOut}>
            <CButton color="primary" role="button" disabled={loading}>
              {loading ? 'Signing Out...' : 'Sign Out'}
            </CButton>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Updates Modal */}
      <CModal
        visible={updatesModalVisible}
        onClose={() => setUpdatesModalVisible(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Updates</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {notifications.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CCard className="shadow">
                <CCardBody>
                  {notifications.map((update, index) => (
                    <div key={index} className="mb-3">
                      <p className="mb-1">
                        <strong>{update.message}</strong>
                      </p>
                      <small className="text-muted">{update.time}</small>
                      <hr />
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            </div>
          ) : (
            <p className="text-center text-muted">No new updates</p>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdatesModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Messages Modal */}
      <CModal
        visible={messagesModalVisible}
        onClose={() => setMessagesModalVisible(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Messages</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {messages.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CCard className="shadow">
                <CCardBody>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="mb-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleReply(msg)}
                    >
                      <p className="mb-1">
                        <strong>{msg.sender}</strong>
                      </p>
                      <p className="mb-1">{msg.content}</p>
                      <small className="text-muted">{msg.time}</small>
                      <hr />
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            </div>
          ) : (
            <p className="text-center text-muted">No new messages</p>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setMessagesModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reply Modal */}
      <CModal
        visible={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Reply to {selectedMessage?.sender}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormTextarea placeholder="Type your reply..." rows={4} required />
          </CForm>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setReplyModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => alert('Reply sent!')}>
            Send Reply
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown
