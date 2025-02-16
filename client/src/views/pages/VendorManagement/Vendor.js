import React from 'react'
import { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'

// Mock RFQ Data
const mockRFQs = [
  {
    _id: '1',
    title: 'Office Supplies',
    description: 'Need 500 units of A4 paper reams',
    quantity: 500,
    budget: 1000,
  },
  {
    _id: '2',
    title: 'Laptop Procurement',
    description: 'Seeking 10 high-performance laptops',
    quantity: 10,
    budget: 15000,
  },
  {
    _id: '3',
    title: 'Logistics Service',
    description: 'Require transportation for 200kg shipment',
    quantity: 1,
    budget: 5000,
  },
]

const VendorDashboard = () => {
  const [rfqs] = useState(mockRFQs)
  const [bidModal, setBidModal] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [bidDetails, setBidDetails] = useState({
    price: '',
    deliveryTime: '',
  })

  const openBidModal = (rfq) => {
    setSelectedRFQ(rfq)
    setBidModal(true)
  }

  const handleBidSubmit = () => {
    if (!bidDetails.price || !bidDetails.deliveryTime) {
      alert('Please fill in all fields.')
      return
    }

    // Mock bid submission
    console.log('Bid Submitted:', {
      rfqId: selectedRFQ._id,
      vendorId: 'VENDOR_ID_HERE', // Replace with real vendor ID
      price: bidDetails.price,
      deliveryTime: bidDetails.deliveryTime,
    })

    alert('Bid submitted successfully!')
    setBidModal(false)
    setBidDetails({ price: '', deliveryTime: '' })
  }

  return (
    <div className="container">
      <h2 className="my-4">Vendor Dashboard</h2>
      <div className="row">
        {rfqs.map((rfq) => (
          <div key={rfq._id} className="col-md-4 mb-4">
            <CCard className="shadow-sm">
              <CCardBody>
                <CCardTitle>{rfq.title}</CCardTitle>
                <CCardText>{rfq.description}</CCardText>
                <CCardText>
                  <strong>Quantity:</strong> {rfq.quantity}
                </CCardText>
                <CCardText>
                  <strong>Budget:</strong> ${rfq.budget}
                </CCardText>
                <CButton color="primary" onClick={() => openBidModal(rfq)}>
                  Submit Bid
                </CButton>
              </CCardBody>
            </CCard>
          </div>
        ))}
      </div>

      {/* Bid Submission Modal */}
      <CModal visible={bidModal} onClose={() => setBidModal(false)}>
        <CModalHeader>
          <CModalTitle>Submit a Bid</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            <strong>RFQ:</strong> {selectedRFQ?.title}
          </p>
          <CFormInput
            type="number"
            placeholder="Enter bid price"
            value={bidDetails.price}
            onChange={(e) => setBidDetails({ ...bidDetails, price: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            type="text"
            placeholder="Estimated delivery time"
            value={bidDetails.deliveryTime}
            onChange={(e) => setBidDetails({ ...bidDetails, deliveryTime: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBidModal(false)}>
            Cancel
          </CButton>
          <CButton color="success" onClick={handleBidSubmit}>
            Submit Bid
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default VendorDashboard
