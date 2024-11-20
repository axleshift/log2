import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const IncomingDetails = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [detailsVisible, setDetailsVisible] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>
              <h1>Incoming Shipment Details</h1>
            </CCardHeader>
            <CCardBody>
              <CForm>
                {/* Display Shipment Details */}
                <div className="mb-3">
                  <CFormLabel htmlFor="trackingId">Tracking ID</CFormLabel>
                  <CFormInput type="text" id="trackingId" value={trackingId} readOnly />
                </div>
                <div className="mb-3">
                  <CFormLabel>Currently At</CFormLabel>
                  <CFormInput type="text" value="Warehouse 1" readOnly />
                </div>
                <div className="mb-3">
                  <CFormLabel>Estimated Arrival</CFormLabel>
                  <CFormInput type="text" value="2 hours from now" readOnly />
                </div>
                <div className="mb-3">
                  <CFormLabel>Courier</CFormLabel>
                  <CFormInput type="text" value="FedEx" readOnly />
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <CButton color="info" onClick={() => setDetailsVisible(!detailsVisible)}>
                    {detailsVisible ? 'Hide Additional Info' : 'Show Additional Info'}
                  </CButton>
                  <CButton
                    color="primary"
                    onClick={() =>
                      window.open(`https://tracking.example.com/${trackingId}`, '_blank')
                    }
                  >
                    Track Shipment
                  </CButton>
                </div>

                {/* Back Button */}
                <div className="mt-4">
                  <CButton color="secondary" onClick={handleBack}>
                    Back to Logistics
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default IncomingDetails
