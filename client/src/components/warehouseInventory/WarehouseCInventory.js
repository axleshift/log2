import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'

const WarehouseCInventory = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>
              <h1>Warehouse C Inventory</h1>
            </CCardHeader>
            <CCardBody>
              {/* Field for Adding Tracking ID */}
              <div className="mt-4 mb-3">
                <CFormLabel htmlFor="addTrackingId">Add Tracking ID</CFormLabel>
                <CFormInput type="text" id="addTrackingId" placeholder="Enter New Tracking ID" />
              </div>
              <CButton color="success" style={{ marginRight: '1rem' }}>
                Add
              </CButton>
              <CButton color="secondary" onClick={handleBack}>
                Back
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default WarehouseCInventory
