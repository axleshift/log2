import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const NOTIFICATION_API_URL = `${API_URL}/api/v1/notifications`
const USERS_API_URL = `${API_URL}/api/v1/auth/users`

const CreateNotification = () => {
  const { accessToken } = useAuth()
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState([])
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)

  const showToast = (text, color = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setUsers(res.data.users)
    } catch (err) {
      showToast('Failed to fetch users', 'danger')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || !userId) return showToast('Please select a user', 'warning')
    setLoading(true)

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      const payload = {
        message,
        type,
        userId,
      }

      await axios.post(NOTIFICATION_API_URL, payload, { headers })

      setMessage('')
      setType('info')
      setUserId('')
      showToast('✅ Notification sent successfully!')
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to send notification', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CRow className="mb-3">
        <CCol md={4}>
          <CFormLabel>Recipient</CFormLabel>
          <CFormSelect
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormLabel>Type</CFormLabel>
          <CFormSelect name="type" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormLabel>Message</CFormLabel>
          <CFormTextarea
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </CCol>
      </CRow>

      <CRow className="text-center">
        <CCol>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Send Notification'}
          </CButton>
        </CCol>
      </CRow>

      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} autohide visible color={toast.color}>
            <CToastHeader closeButton>
              {toast.color === 'success' ? '✅ Success' : '🚨 Error'}
            </CToastHeader>
            <CToastBody>{toast.text}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </form>
  )
}

export default CreateNotification
