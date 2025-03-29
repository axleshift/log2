import React, { useState } from 'react'
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
  CFormInput,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const ANNOUNCEMENT_API_URL = `${API_URL}/api/v1/announcements`

const CreateAnnouncement = () => {
  const { accessToken } = useAuth()
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)

  const showToast = (text, color = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      const payload = {
        message,
        date: new Date(date).toISOString(),
      }

      await axios.post(ANNOUNCEMENT_API_URL, payload, { headers })

      setMessage('')
      setDate('')
      showToast('✅ Announcement created successfully!')
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to create announcement', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Event Date</CFormLabel>
          <CFormInput
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
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
            {loading ? <CSpinner size="sm" /> : 'Create Announcement'}
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

export default CreateAnnouncement
