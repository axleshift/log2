import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CButton,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const PurchaseOrderList = () => {
  const [poList, setPoList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock data for purchase orders
  const mockPOData = [
    {
      _id: 'PO12345',
      vendor: { name: 'Vendor A' },
      totalPrice: '$5000',
      status: 'Pending',
      createdAt: '2025-03-01T08:30:00Z',
    },
    {
      _id: 'PO12346',
      vendor: { name: 'Vendor B' },
      totalPrice: '$3000',
      status: 'Approved',
      createdAt: '2025-02-28T10:00:00Z',
    },
    {
      _id: 'PO12347',
      vendor: { name: 'Vendor C' },
      totalPrice: '$4500',
      status: 'Rejected',
      createdAt: '2025-02-27T12:00:00Z',
    },
  ]

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      setLoading(true)
      try {
        // Simulating a delay like fetching from an API
        setTimeout(() => {
          setPoList(mockPOData)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError('Failed to load Purchase Orders.')
        setLoading(false)
      }
    }

    fetchPurchaseOrders()
  }, [])

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">Purchase Orders</CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        ) : poList.length > 0 ? (
          <>
            <CTable hover responsive className="text-center">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>PO ID</CTableHeaderCell>
                  <CTableHeaderCell>Vendor</CTableHeaderCell>
                  <CTableHeaderCell>Total Price</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {poList.map((po, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{po._id}</CTableDataCell>
                    <CTableDataCell>{po.vendor?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{po.totalPrice}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={
                          po.status === 'Pending'
                            ? 'warning'
                            : po.status === 'Approved'
                              ? 'success'
                              : 'danger'
                        }
                      >
                        {po.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{new Date(po.createdAt).toLocaleDateString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        ) : (
          <CAlert color="warning" className="text-center">
            No Purchase Orders found.
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  )
}

export default PurchaseOrderList
