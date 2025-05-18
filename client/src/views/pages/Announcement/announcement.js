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
  CFormInput,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const API_URL = import.meta.env.VITE_API_URL
const ANNOUNCEMENT_API_URL = `${API_URL}/api/v1/announcements`

const CreateAnnouncement = () => {
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const showToast = (text, color = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const response = await axios.get(ANNOUNCEMENT_API_URL)
      setAnnouncements(response.data)
    } catch (error) {
      showToast('🚨 Failed to fetch announcements', 'danger')
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const payload = {
        message,
        date: new Date(date).toISOString(),
      }

      await axios.post(ANNOUNCEMENT_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      setMessage('')
      setDate('')
      showToast('✅ Announcement created successfully!')

      await fetchAnnouncements()
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to create announcement', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (deletingId) return
    setDeletingId(id)
    try {
      await axios.delete(`${ANNOUNCEMENT_API_URL}/${id}`)
      showToast('🗑️ Announcement deleted')
      await fetchAnnouncements()
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to delete announcement', 'danger')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
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

      <hr />

      <h4>Announcements</h4>

      {loadingAnnouncements ? (
        <CSpinner />
      ) : announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <CListGroup>
          {announcements.map(({ _id, message, date }) => (
            <CListGroupItem key={_id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{new Date(date).toLocaleDateString()}</strong>: {message}
              </div>
              <CButton
                color="danger"
                size="sm"
                disabled={deletingId === _id}
                onClick={() => handleDelete(_id)}
              >
                {deletingId === _id ? <CSpinner size="sm" /> : 'Delete'}
              </CButton>
            </CListGroupItem>
          ))}
        </CListGroup>
      )}
    </>
  )
}

export default CreateAnnouncement
