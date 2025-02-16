import React from 'react'
import { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
} from '@coreui/react'

// Mock data for the form
const mockContract = {
  price: 1000,
  deliveryDate: '2025-03-01',
  terms: 'Payment upon delivery',
}

function CreateContract() {
  const [price, setPrice] = useState(mockContract.price)
  const [deliveryDate, setDeliveryDate] = useState(mockContract.deliveryDate)
  const [terms, setTerms] = useState(mockContract.terms)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCreateContract = () => {
    // Mock contract creation
    setLoading(true)
    setError(null)
    setTimeout(() => {
      alert('Contract created successfully')
      setLoading(false)
    }, 1000) // Simulate a delay
  }

  return (
    <div className="p-4">
      <CCard>
        <CCardHeader>
          <h2>Create Contract</h2>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          <CForm>
            <CRow className="mb-3">
              <CCol xs="12" md="6">
                <label>Price</label>
                <CFormInput
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </CCol>
              <CCol xs="12" md="6">
                <label>Delivery Date</label>
                <CFormInput
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs="12">
                <label>Terms</label>
                <CFormTextarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows="3"
                  placeholder="Enter terms"
                  required
                />
              </CCol>
            </CRow>

            <CButton color="primary" onClick={handleCreateContract} disabled={loading}>
              {loading ? 'Creating...' : 'Create Contract'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CreateContract
