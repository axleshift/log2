import React from 'react'
import { useNavigate } from 'react-router-dom' // useNavigate hook for navigation
import { CCard, CCardBody, CCardHeader, CCardTitle, CRow, CCol, CButton } from '@coreui/react'

const DocumentDetails = () => {
  const navigate = useNavigate() // Initialize useNavigate hook

  const handleBackClick = () => {
    navigate(-1) // Navigate back to the previous page
  }

  return (
    <>
      {/* Back Button outside the card */}
      <CButton color="secondary" onClick={handleBackClick} className="mb-3">
        Back
      </CButton>

      <CCard className="bg-dark text-white">
        <CCardHeader>
          <CCardTitle>Document Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Order ID:
            </CCol>
            <CCol>ORD124</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Date:
            </CCol>
            <CCol>2025-01-20</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Description:
            </CCol>
            <CCol>Printer Ink</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Unit:
            </CCol>
            <CCol>Piece</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Quantity:
            </CCol>
            <CCol>5</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Unit Price:
            </CCol>
            <CCol>$30</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Requester:
            </CCol>
            <CCol>Jane Smith</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Supplier Name:
            </CCol>
            <CCol>XYZ Printers</CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="3" className="fw-bold">
              Another Details:
            </CCol>
            <CCol>XYZ Printers</CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DocumentDetails
