// BiddingPage.js
import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'

// Mock Data for Bidding Requests
const mockBiddingRequests = [
  { id: 'REQ001', vendorName: 'Vendor A', deadline: '2025-02-15' },
  { id: 'REQ002', vendorName: 'Vendor B', deadline: '2025-02-18' },
  { id: 'REQ003', vendorName: 'Vendor C', deadline: '2025-02-20' },
]

const BiddingPage = () => {
  const [requests] = useState(mockBiddingRequests)

  return (
    <CCard>
      <CCardHeader>
        <h4>Bidding Requests</h4>
      </CCardHeader>
      <CCardBody>
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Request ID</CTableHeaderCell>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Deadline</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {requests.map((request, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{request.id}</CTableDataCell>
                <CTableDataCell>{request.vendorName}</CTableDataCell>
                <CTableDataCell>{new Date(request.deadline).toLocaleDateString()}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" size="sm">
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default BiddingPage
