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

function PublishBid() {
  const [bidTitle, setBidTitle] = useState('')
  const [bidDescription, setBidDescription] = useState('')
  const [bidDeadline, setBidDeadline] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BID_API_URL}/publish`, { bidTitle, bidDescription, bidDeadline })
      alert('Bid published successfully')
    } catch (error) {
      console.error('Error publishing bid:', error)
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>Publish Bid</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Bid Title</CFormLabel>
            <CFormInput
              type="text"
              value={bidTitle}
              onChange={(e) => setBidTitle(e.target.value)}
            />
            <CFormLabel>Bid Description</CFormLabel>
            <CFormInput
              type="text"
              value={bidDescription}
              onChange={(e) => setBidDescription(e.target.value)}
            />
            <CFormLabel>Deadline</CFormLabel>
            <CFormInput
              type="datetime-local"
              value={bidDeadline}
              onChange={(e) => setBidDeadline(e.target.value)}
            />
            <CButton type="submit" color="primary" className="mt-3">
              Publish
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default PublishBid
