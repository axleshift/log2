import React from 'react'
import { useNavigate } from 'react-router-dom' // Use useNavigate instead of useHistory
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const DocumentTracking = () => {
  const navigate = useNavigate() // Use navigate for navigation

  const handleRowClick = (orderId) => {
    // Navigate to DocumentDetails page with the order ID as a parameter
    navigate(`/DocumentDetails/${orderId}`)
  }

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Document Tracking</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <p>Track your documents and shipments here.</p>

        <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'scroll' }}>
          <CTable bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Order ID</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Unit</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Unit Price</CTableHeaderCell>
                <CTableHeaderCell>Requester</CTableHeaderCell>
                <CTableHeaderCell>Supplier Name</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.from({ length: 15 }).map((_, index) => {
                const orderId = `ORD${124 + index}`
                return (
                  <CTableRow
                    key={index}
                    onClick={() => handleRowClick(orderId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CTableDataCell>{orderId}</CTableDataCell>
                    <CTableDataCell>2025-01-20</CTableDataCell>
                    <CTableDataCell>Printer Ink</CTableDataCell>
                    <CTableDataCell>Piece</CTableDataCell>
                    <CTableDataCell>5</CTableDataCell>
                    <CTableDataCell>$30</CTableDataCell>
                    <CTableDataCell>Jane Smith</CTableDataCell>
                    <CTableDataCell>XYZ Printers</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default DocumentTracking
