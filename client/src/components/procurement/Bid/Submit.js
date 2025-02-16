import React, { useState } from 'react'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react'

const BID_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/bid`

function SubmitBid() {
  const [bidId, setBidId] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [bidAmount, setBidAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BID_API_URL}/submit`, { bidId, vendorName, bidAmount })
      alert('Bid submitted successfully')
    } catch (error) {
      console.error('Error submitting bid:', error)
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>Submit Bid</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Bid ID</CFormLabel>
            <CFormInput type="text" value={bidId} onChange={(e) => setBidId(e.target.value)} />
            <CFormLabel>Vendor Name</CFormLabel>
            <CFormInput
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
            <CFormLabel>Bid Amount</CFormLabel>
            <CFormInput
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <CButton type="submit" color="success" className="mt-3">
              Submit Bid
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default SubmitBid
