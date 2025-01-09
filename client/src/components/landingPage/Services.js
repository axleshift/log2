import React from 'react'
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
} from '@coreui/react'

const Announcements = () => {
  // Sample announcements data
  const announcements = [
    {
      title:
        'Conduct of the Annual Planning, Performance Evaluation, and Accomplishment Review (APPEAR) 2024',
      date: '11 March 2024',
    },
    { title: 'Reactivation of PhilGEPS Landline Number', date: '06 March 2024' },
    {
      title:
        'Call for Merchants to Join Procurement Activities in mPhilGEPS During the Pioneer Implementation of e-Bidding Facility for Fiscal Year 2023',
      date: '07 November 2023',
    },
    {
      title: 'ADVISORY: Documentary Stamp Tax (DST) Payment for PhilGEPS Platinum Registration',
      date: '02 October 2023',
    },
    {
      title: 'PS-DBM Invites You to Join One PS-DBM Fun Run in October 2023',
      date: '06 September 2023',
    },
    { title: 'System Slowdown Advisory', date: '06 September 2023' },
  ]

  return (
    <CContainer className="py-5">
      <h1 className="text-center mb-4">ANNOUNCEMENTS</h1>
      <CTable bordered hover responsive className="text-start">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Title</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {announcements.map((announcement, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{announcement.title}</CTableDataCell>
              <CTableDataCell>{announcement.date}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default Announcements
