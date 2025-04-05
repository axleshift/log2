import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CFormInput,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'
import { Link } from 'react-router-dom'

const NoticeOfAward = () => {
  const [notices, setNotices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch('https://backend-log2.axleshift.com/api/v1/awards')
        const data = await res.json()
        setNotices(data)
      } catch (err) {
        console.error('Failed to fetch award notices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CContainer className="p-5">
      <h3 className="mb-4 text-center">Notice of Award</h3>

      <CRow className="mb-3">
        <CCol md={6} className="mx-auto">
          <CFormInput
            type="text"
            placeholder="Search awards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : filteredNotices.length > 0 ? (
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredNotices.map((notice, index) => (
              <CTableRow key={notice._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{notice.title}</CTableDataCell>
                <CTableDataCell>PHP {parseFloat(notice.amount).toLocaleString()}</CTableDataCell>
                <CTableDataCell>{new Date(notice.date).toLocaleDateString()}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/notice-details/${notice._id}`} className="text-primary">
                    See Details
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p className="text-center">No notices found.</p>
      )}
    </CContainer>
  )
}

export default NoticeOfAward
