import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CSpinner, CAlert, CFormInput } from '@coreui/react'

const DeliveryTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [error, setError] = useState(null)

  const handleTrack = async () => {
    if (!trackingNumber) {
      alert('Please enter a tracking number')
      return
    }

    setIsLoading(true)
    setError(null)
    setDeliveryStatus(null)

    setTimeout(() => {
      const mockTrackingData = {
        status: 'In Transit',
        expectedDelivery: '2025-02-28',
        currentLocation: 'New York, NY',
      }

      if (trackingNumber === '12345') {
        setDeliveryStatus(mockTrackingData)
        setIsLoading(false)
      } else {
        setError('Tracking number not found.')
        setIsLoading(false)
      }
    }, 2000)
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Delivery Tracking</h4>
      </CCardHeader>
      <CCardBody>
        {/* Use standard HTML label instead of CLabel */}
        <label htmlFor="trackingNumber">Tracking Number</label>
        <CFormInput
          id="trackingNumber"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <CButton color="primary" onClick={handleTrack} disabled={isLoading}>
          {isLoading ? <CSpinner size="sm" /> : 'Track'}
        </CButton>

        {error && (
          <CAlert color="danger" className="mt-3">
            {error}
          </CAlert>
        )}

        {deliveryStatus && (
          <div className="mt-4">
            <h5>Status: {deliveryStatus.status}</h5>
            <p>
              <strong>Expected Delivery: </strong>
              {deliveryStatus.expectedDelivery}
            </p>
            <p>
              <strong>Current Location: </strong>
              {deliveryStatus.currentLocation}
            </p>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default DeliveryTracking
