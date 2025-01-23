import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from '@coreui/react'

const noticeData = [
  {
    id: 0,
    title: 'Supply of Office Equipment',
    amount: '1,500,000.00',
    date: '2025-01-15',
    details:
      'Procurement of various office equipment including printers, computers, and furniture.',
  },
  {
    id: 1,
    title: 'Construction of New Facility',
    amount: '10,750,000.00',
    date: '2025-02-01',
    details: 'Construction of a new corporate building with modern amenities.',
  },
  {
    id: 2,
    title: 'IT System Upgrade',
    amount: '5,200,000.00',
    date: '2025-03-10',
    details: 'Upgrading IT infrastructure to enhance cybersecurity and system performance.',
  },
  {
    id: 3,
    title: 'Consultancy Services',
    amount: '3,000,000.00',
    date: '2025-04-05',
    details: 'Consultancy services for strategic business planning and process optimization.',
  },
]

const NoticeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const notice = noticeData.find((item) => item.id.toString() === id)

  if (!notice) {
    return (
      <CContainer className="text-center mt-5">
        <h3>Notice not found</h3>
        <CButton color="primary" onClick={() => navigate(-1)}>
          Go Back
        </CButton>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardBody>
              <CCardTitle className="mb-3">
                <h4>{notice.title}</h4>
              </CCardTitle>
              <CCardText>
                <strong>Amount:</strong> PHP {notice.amount}
              </CCardText>
              <CCardText>
                <strong>Date:</strong> {notice.date}
              </CCardText>
              <CCardText>
                <strong>Details:</strong> {notice.details}
              </CCardText>
              <CButton color="primary" onClick={() => navigate(-1)}>
                Go Back
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default NoticeDetails
