import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableBody,
  CSpinner,
} from '@coreui/react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const ANNOUNCEMENT_API_URL = `${API_URL}/api/v1/announcements`

const Announcements = () => {
  const { accessToken } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(ANNOUNCEMENT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setAnnouncements(res.data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <CContainer className="py-5">
      <h1 className="text-center mb-4">ANNOUNCEMENTS</h1>

      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CTable bordered hover responsive className="text-start">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Message</CTableHeaderCell>
              <CTableHeaderCell>Event Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {announcements.map((a) => (
              <CTableRow key={a._id}>
                <CTableDataCell>{a.message}</CTableDataCell>
                <CTableDataCell>{formatDate(a.date)}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </CContainer>
  )
}

export default Announcements
