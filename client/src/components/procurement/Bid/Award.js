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

function AwardBid() {
  const [bidId, setBidId] = useState('')

  const handleAward = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BID_API_URL}/award`, { bidId })
      alert('Bid awarded successfully')
    } catch (error) {
      console.error('Error awarding bid:', error)
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>Award Bid</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAward}>
            <CFormLabel htmlFor="bidId">Bid ID</CFormLabel>
            <CFormInput
              type="text"
              id="bidId"
              value={bidId}
              onChange={(e) => setBidId(e.target.value)}
              placeholder="Enter Bid ID to award"
            />
            <CButton type="submit" color="warning" className="mt-3">
              Award Bid
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default AwardBid
