import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'

const IncomingDetails = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [detailsVisible, setDetailsVisible] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <CRow className="justify-content-center">
      <CButton color="secondary" onClick={handleBack} className="mb-3">
        Back to Logistics
      </CButton>

      <CCol xs="12" md="8">
        <CCard className="mt-3">
          <CCardHeader>
            <h2>Incoming Shipment Details</h2>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Tracking ID:</strong> {trackingId}
            </p>
            <p>
              <strong>Currently At:</strong> Warehouse 1
            </p>
            <p>
              <strong>Estimated Arrival:</strong> 2 hours from now
            </p>
            <p>
              <strong>Courier:</strong> FedEx
            </p>

            <div className="mt-4 d-flex justify-content-between">
              <CButton color="info" onClick={() => setDetailsVisible(!detailsVisible)}>
                {detailsVisible ? 'Hide Additional Info' : 'Show Additional Info'}
              </CButton>

              <CButton
                color="primary"
                onClick={() => window.open(`https://tracking.example.com/${trackingId}`, '_blank')}
              >
                Track Shipment
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default IncomingDetails
