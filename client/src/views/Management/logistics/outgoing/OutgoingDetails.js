import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CCollapse,
  CSpinner,
  CContainer,
} from '@coreui/react'

const OutgoingDetails = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [shipmentData, setShipmentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)

  useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        const data = {
          trackingId: trackingId,
          nextDestination: 'Warehouse 2',
          estimatedDeliveryTime: '1 day',
          courier: 'DHL',
          additionalInfo: 'This shipment contains fragile items.',
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setShipmentData(data)
      } catch (err) {
        setError('Failed to load shipment data.')
      } finally {
        setLoading(false)
      }
    }

    fetchShipmentData()
  }, [trackingId])

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-danger">{error}</p>
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol xs="12" md="8">
          <CCard>
            <CCardHeader>
              <h2>Outgoing Shipment Details</h2>
            </CCardHeader>
            <CCardBody>
              <CForm>
                {/* Display Shipment Details */}
                <div className="mb-3">
                  <CFormLabel htmlFor="trackingId">Tracking ID</CFormLabel>
                  <CFormInput
                    type="text"
                    id="trackingId"
                    value={shipmentData.trackingId}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Next Destination</CFormLabel>
                  <CFormInput type="text" value={shipmentData.nextDestination} readOnly />
                </div>
                <div className="mb-3">
                  <CFormLabel>Estimated Delivery Time</CFormLabel>
                  <CFormInput type="text" value={shipmentData.estimatedDeliveryTime} readOnly />
                </div>
                <div className="mb-3">
                  <CFormLabel>Courier</CFormLabel>
                  <CFormInput type="text" value={shipmentData.courier} readOnly />
                </div>

                {/* Show/Hide Additional Info */}
                <CButton
                  color="info"
                  onClick={() => setDetailsVisible(!detailsVisible)}
                  className="mt-3"
                >
                  {detailsVisible ? 'Hide Additional Info' : 'Show Additional Info'}
                </CButton>

                <CCollapse show={detailsVisible ? 'true' : undefined}>
                  <div className="mt-3">
                    <p>
                      <strong>Additional Information:</strong>
                    </p>
                    <p>{shipmentData.additionalInfo}</p>
                  </div>
                </CCollapse>

                {/* Action Buttons */}
                <div className="mt-4 d-flex justify-content-between">
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

export default OutgoingDetails
