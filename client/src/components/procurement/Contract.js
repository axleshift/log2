import React from 'react'
import { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CAlert,
  CSpinner,
  CFormInput,
} from '@coreui/react'

// Mock data for contracts
const mockContracts = [
  {
    _id: '1',
    product: { name: 'Product A' },
    vendor: { name: 'Vendor X' },
    status: 'Pending',
    price: 1000,
    deliveryDate: '2025-03-01',
    terms: 'Payment upon delivery',
  },
  {
    _id: '2',
    product: { name: 'Product B' },
    vendor: { name: 'Vendor Y' },
    status: 'Active',
    price: 1500,
    deliveryDate: '2025-02-20',
    terms: '30 days payment',
  },
  {
    _id: '3',
    product: { name: 'Product C' },
    vendor: { name: 'Vendor Z' },
    status: 'Completed',
    price: 2000,
    deliveryDate: '2025-02-15',
    terms: 'Cash on delivery',
  },
]

function ViewContracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // Simulate an API call by using mock data
    setTimeout(() => {
      setContracts(mockContracts)
      setLoading(false)
    }, 1000) // Simulate a delay
  }, [])

  const handleUpdateStatus = (contractId, status) => {
    setContracts(
      contracts.map((contract) =>
        contract._id === contractId ? { ...contract, status } : contract,
      ),
    )
    alert('Contract status updated successfully')
  }

  const filteredContracts = contracts
    .filter((contract) => {
      return (
        contract.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .filter((contract) => {
      if (filterStatus) {
        return contract.status === filterStatus
      }
      return true
    })

  if (loading) {
    return (
      <div className="p-4 text-center">
        <CSpinner color="primary" size="sm" />
        <p>Loading contracts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <CAlert color="danger" className="p-4">
        {error}
      </CAlert>
    )
  }

  return (
    <div className="p-4">
      <h2>All Contracts</h2>
      <CRow className="mb-4">
        <CCol xs="12" md="6">
          <CFormInput
            type="text"
            placeholder="Search by Product or Vendor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CCol>
        <CCol xs="12" md="6">
          <CFormInput
            type="text"
            placeholder="Filter by Status (Pending, Active, Completed)"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </CCol>
      </CRow>
      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map((contract) => (
          <CCard key={contract._id} className="mb-4">
            <CCardHeader>
              <h4>
                {contract.product.name} - {contract.vendor.name}
              </h4>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Status:</strong> {contract.status}
              </p>
              <p>
                <strong>Price:</strong> ${contract.price}
              </p>
              <p>
                <strong>Delivery Date:</strong> {contract.deliveryDate}
              </p>
              <p>
                <strong>Terms:</strong> {contract.terms}
              </p>

              <CRow className="mt-3">
                <CCol xs="12" md="6">
                  <CButton
                    color="primary"
                    onClick={() => handleUpdateStatus(contract._id, 'Active')}
                    disabled={contract.status === 'Active'}
                    block="true"
                  >
                    Mark as Active
                  </CButton>
                </CCol>
                <CCol xs="12" md="6">
                  <CButton
                    color="success"
                    onClick={() => handleUpdateStatus(contract._id, 'Completed')}
                    disabled={contract.status === 'Completed'}
                    block="true"
                  >
                    Mark as Completed
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        ))}
      </div>
    </div>
  )
}

export default ViewContracts
