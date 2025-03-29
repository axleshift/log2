import React, { useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'

const BASE_URL = import.meta.env.VITE_API_URL
const SHIPMENT_API_URL = `${BASE_URL}/api/v1/shipment`

const DeliveryTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [error, setError] = useState(null)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setIsLoading(true)
    setError(null)
    setDeliveryStatus(null)

    try {
      // Get all shipments
      const res = await axios.get(SHIPMENT_API_URL)
      const allShipments = res.data.shipments || []

      // Find by tracking_id
      const shipment = allShipments.find((s) => s.tracking_id === trackingNumber)

      if (!shipment) {
        setError('Tracking number not found.')
      } else {
        const deliveryData = {
          status: shipment.delivery?.status || 'N/A',
          expectedDelivery: shipment.delivery?.deliveryDate
            ? new Date(shipment.delivery.deliveryDate).toLocaleDateString()
            : 'Not provided',
          currentLocation: shipment.shipping?.shipping_details?.land?.destination_address || '—',
        }
        setDeliveryStatus(deliveryData)
      }
    } catch (err) {
      console.error(err)
      setError('Error fetching shipment data.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white">
        <h5 className="mb-0">📦 Delivery Tracking</h5>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol md={8}>
            <CFormInput
              id="trackingNumber"
              placeholder="Enter tracking number (e.g. 12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </CCol>
          <CCol md={4}>
            <CButton color="primary" className="w-100" onClick={handleTrack} disabled={isLoading}>
              {isLoading ? <CSpinner size="sm" /> : 'Track'}
            </CButton>
          </CCol>
        </CRow>

        {error && (
          <CAlert color="danger" className="mt-2">
            {error}
          </CAlert>
        )}

        {deliveryStatus && (
          <div className="mt-4 border-top pt-3">
            <h6 className="mb-3 text-success">✅ Delivery Details</h6>
            <p>
              <strong>Status:</strong> {deliveryStatus.status}
            </p>
            <p>
              <strong>Expected Delivery:</strong> {deliveryStatus.expectedDelivery}
            </p>
            <p>
              <strong>Current Location:</strong> {deliveryStatus.currentLocation}
            </p>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default DeliveryTracking
