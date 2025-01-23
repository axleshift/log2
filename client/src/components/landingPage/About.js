import React, { useState } from 'react'
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
} from '@coreui/react'

const NoticeOfAward = () => {
  const notices = [
    { title: 'Supply of Office Equipment', amount: '1,500,000.00', date: '2025-01-15' },
    { title: 'Construction of New Facility', amount: '10,750,000.00', date: '2025-02-01' },
    { title: 'IT System Upgrade', amount: '5,200,000.00', date: '2025-03-10' },
    { title: 'Consultancy Services', amount: '3,000,000.00', date: '2025-04-05' },
  ]

  const [searchTerm, setSearchTerm] = useState('')

  // Filter notices based on search term
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

      {filteredNotices.length > 0 ? (
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
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{notice.title}</CTableDataCell>
                <CTableDataCell>PHP {notice.amount}</CTableDataCell>
                <CTableDataCell>{notice.date}</CTableDataCell>
                <CTableDataCell>
                  <a href={`/notice-details/${index}`} className="text-primary">
                    See Details
                  </a>
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
