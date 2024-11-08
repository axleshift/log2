import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CCollapse,
  CSpinner,
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
    <CRow className="justify-content-center">
      <CButton color="secondary" onClick={handleBack} className="mb-3">
        Back to Logistics
      </CButton>

      <CCol xs="12" md="8">
        <CCard>
          <CCardHeader>
            <h2>Outgoing Shipment Details</h2>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Tracking ID:</strong> {shipmentData.trackingId}
            </p>
            <p>
              <strong>Next Destination:</strong> {shipmentData.nextDestination}
            </p>
            <p>
              <strong>Estimated Delivery Time:</strong> {shipmentData.estimatedDeliveryTime}
            </p>
            <p>
              <strong>Courier:</strong> {shipmentData.courier}
            </p>

            <CButton
              color="info"
              onClick={() => setDetailsVisible(!detailsVisible)}
              className="mt-3"
            >
              {detailsVisible ? 'Hide Additional Info' : 'Show Additional Info'}
            </CButton>

            <CCollapse show={detailsVisible}>
              <div className="mt-3">
                <p>
                  <strong>Additional Information:</strong>
                </p>
                <p>{shipmentData.additionalInfo}</p>
              </div>
            </CCollapse>

            <div className="mt-4 d-flex justify-content-between">
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

export default OutgoingDetails
