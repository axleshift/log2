import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CContainer,
  CFormInput,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CButton,
} from '@coreui/react'

const NoticeToProceed = () => {
  const notices = [
    {
      id: 0,
      project: 'Road Construction Project',
      contractor: 'ABC Constructions',
      startDate: '2025-02-01',
      endDate: '2025-08-30',
    },
    {
      id: 1,
      project: 'IT Infrastructure Upgrade',
      contractor: 'XYZ Tech Solutions',
      startDate: '2025-03-15',
      endDate: '2025-10-20',
    },
    {
      id: 2,
      project: 'Building Renovation',
      contractor: 'LMN Builders',
      startDate: '2025-04-10',
      endDate: '2025-12-05',
    },
    {
      id: 3,
      project: 'Water Supply System',
      contractor: 'Aqua Engineering',
      startDate: '2025-05-01',
      endDate: '2025-11-30',
    },
  ]

  const [searchTerm, setSearchTerm] = useState('')

  // Filter notices based on search term
  const filteredNotices = notices.filter((notice) =>
    notice.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CContainer className="p-5">
      <h3 className="mb-4 text-center">Notice to Proceed</h3>

      <CRow className="mb-3">
        <CCol md={6} className="mx-auto">
          <CFormInput
            type="text"
            placeholder="Search project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {filteredNotices.length > 0 ? (
        <CListGroup>
          {filteredNotices.map((notice) => (
            <CListGroupItem
              key={notice.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{notice.project}</h5>
                <p>
                  <strong>Contractor:</strong> {notice.contractor}
                </p>
                <p>
                  <strong>Start Date:</strong> {notice.startDate} | <strong>End Date:</strong>{' '}
                  {notice.endDate}
                </p>
              </div>
              <Link to={`/notice-to-proceed/${notice.id}`}>
                <CButton color="primary">See Details</CButton>
              </Link>
            </CListGroupItem>
          ))}
        </CListGroup>
      ) : (
        <p className="text-center">No notices found.</p>
      )}
    </CContainer>
  )
}

export default NoticeToProceed
