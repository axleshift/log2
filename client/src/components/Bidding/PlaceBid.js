// PlaceBidPage.js
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CForm, CFormInput, CFormTextarea, CButton, CAlert } from '@coreui/react'

const PlaceBidPage = () => {
  const { requestId } = useParams()
  const [bidAmount, setBidAmount] = useState('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!bidAmount || !estimatedDeliveryDate) {
      setError('Please fill all required fields.')
      return
    }

    const bidData = {
      requestId,
      bidAmount,
      estimatedDeliveryDate,
      additionalNotes,
    }

    console.log('Mock Bid Submitted:', bidData)
    setSuccessMessage('Bid submitted successfully!')
    setBidAmount('')
    setEstimatedDeliveryDate('')
    setAdditionalNotes('')
    setError('')
  }

  return (
    <div>
      <h1>Place Your Bid for Request {requestId}</h1>
      <CForm onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="bidAmount">Bid Amount</label>
          <CFormInput
            id="bidAmount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</label>
          <CFormInput
            id="estimatedDeliveryDate"
            type="date"
            value={estimatedDeliveryDate}
            onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <CFormTextarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
        <CButton type="submit" color="primary">
          Submit Bid
        </CButton>
      </CForm>

      {error && <CAlert color="danger">{error}</CAlert>}
      {successMessage && <CAlert color="success">{successMessage}</CAlert>}
    </div>
  )
}

export default PlaceBidPage
