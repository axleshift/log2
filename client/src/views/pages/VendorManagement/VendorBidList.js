import React from 'react'
import { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react'
import axios from 'axios'

// Mock data
const mockBids = [
  {
    _id: '1',
    rfqTitle: 'Office Supplies',
    price: 200,
    deliveryTime: '5 days',
    status: 'Pending',
  },
  {
    _id: '2',
    rfqTitle: 'Laptop Procurement',
    price: 1200,
    deliveryTime: '10 days',
    status: 'Accepted',
  },
  {
    _id: '3',
    rfqTitle: 'Logistics Service',
    price: 400,
    deliveryTime: '3 days',
    status: 'Pending',
  },
]

const BidList = () => {
  const [bids, setBids] = useState([])

  useEffect(() => {
    setBids(mockBids)
  }, [])

  return (
    <div className="container">
      <h2 className="my-4">My Bids</h2>
      <div className="row">
        {bids.map((bid) => (
          <div key={bid._id} className="col-md-4 mb-4">
            <CCard className="shadow-sm">
              <CCardBody>
                <CCardTitle>{bid.rfqTitle}</CCardTitle>
                <CCardText>
                  <strong>Price:</strong> ${bid.price}
                </CCardText>
                <CCardText>
                  <strong>Delivery Time:</strong> {bid.deliveryTime}
                </CCardText>
                <CCardText>
                  <strong>Status:</strong> {bid.status}
                </CCardText>
                <CButton color="info" disabled={bid.status === 'Accepted'}>
                  Track Bid Status
                </CButton>
              </CCardBody>
            </CCard>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BidList
