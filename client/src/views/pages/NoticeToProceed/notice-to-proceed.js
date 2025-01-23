import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'

// Sample data (this can be replaced with an API call)
const notices = [
  {
    id: '0',
    project: 'Road Construction Project',
    contractor: 'ABC Constructions',
    startDate: '2025-02-01',
    endDate: '2025-08-30',
    details: 'This project involves constructing a 10km highway with modern facilities.',
  },
  {
    id: '1',
    project: 'IT Infrastructure Upgrade',
    contractor: 'XYZ Tech Solutions',
    startDate: '2025-03-15',
    endDate: '2025-10-20',
    details: 'Upgrading the entire IT system including cloud migration and security enhancement.',
  },
  {
    id: '2',
    project: 'Building Renovation',
    contractor: 'LMN Builders',
    startDate: '2025-04-10',
    endDate: '2025-12-05',
    details:
      'Renovation of office spaces to improve work efficiency and modernize the infrastructure.',
  },
  {
    id: '3',
    project: 'Water Supply System',
    contractor: 'Aqua Engineering',
    startDate: '2025-05-01',
    endDate: '2025-11-30',
    details: 'Installation of a new water distribution system for better efficiency.',
  },
]

const NoticeToProceedDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find the selected notice based on ID
  const notice = notices.find((item) => item.id === id)

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
      <CCard>
        <CCardHeader className="bg-primary text-white">
          <h4>{notice.project}</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <p>
                <strong>Contractor:</strong> {notice.contractor}
              </p>
              <p>
                <strong>Start Date:</strong> {notice.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {notice.endDate}
              </p>
            </CCol>
            <CCol md={6}>
              <p>
                <strong>Project Details:</strong>
              </p>
              <p>{notice.details}</p>
            </CCol>
          </CRow>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Back to List
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default NoticeToProceedDetails
