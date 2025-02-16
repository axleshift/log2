// BidManagementPage.js
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'

// Mock Data for Bids
const mockBids = [
  {
    _id: '1',
    vendorName: 'Vendor A',
    bidAmount: 5000,
    estimatedDeliveryDate: '2025-02-15',
    bidStatus: 'Pending',
  },
  {
    _id: '2',
    vendorName: 'Vendor B',
    bidAmount: 4500,
    estimatedDeliveryDate: '2025-02-18',
    bidStatus: 'Pending',
  },
  {
    _id: '3',
    vendorName: 'Vendor C',
    bidAmount: 5200,
    estimatedDeliveryDate: '2025-02-20',
    bidStatus: 'Accepted',
  },
]

const BidManagementPage = () => {
  const { requestId } = useParams()
  const [bids, setBids] = useState(mockBids)

  const handleAcceptBid = (bidId) => {
    setBids(bids.map((bid) => (bid._id === bidId ? { ...bid, bidStatus: 'Accepted' } : bid)))
  }

  const handleRejectBid = (bidId) => {
    setBids(bids.map((bid) => (bid._id === bidId ? { ...bid, bidStatus: 'Rejected' } : bid)))
  }

  return (
    <div>
      <h1>Manage Bids for Request {requestId}</h1>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Bid Amount</CTableHeaderCell>
            <CTableHeaderCell>Delivery Date</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {bids.map((bid) => (
            <CTableRow key={bid._id}>
              <CTableDataCell>{bid.vendorName}</CTableDataCell>
              <CTableDataCell>${bid.bidAmount}</CTableDataCell>
              <CTableDataCell>
                {new Date(bid.estimatedDeliveryDate).toLocaleDateString()}
              </CTableDataCell>
              <CTableDataCell>{bid.bidStatus}</CTableDataCell>
              <CTableDataCell>
                <CButton color="success" size="sm" onClick={() => handleAcceptBid(bid._id)}>
                  Accept
                </CButton>
                <CButton color="danger" size="sm" onClick={() => handleRejectBid(bid._id)}>
                  Reject
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default BidManagementPage
