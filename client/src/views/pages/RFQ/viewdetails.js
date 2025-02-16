import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useParams } from 'react-router-dom'

const RFQDetailsPage = () => {
  // Accessing the route parameter with useParams
  const { id } = useParams()

  // Mock data for RFQ details
  const rfqDetails = {
    id: id || 'RFQ 001', // Default to 'RFQ 001' if no ID is found
    title: 'RFQ 001',
    vendors: [
      { name: 'Vendor A', status: 'Submitted' },
      { name: 'Vendor B', status: 'Not Submitted' },
    ],
    productDetails: 'Product XYZ, 100 units',
    deadline: '2025-02-20',
    responses: [
      { vendor: 'Vendor A', response: 'Price: $100' },
      { vendor: 'Vendor B', response: 'Not yet submitted' },
    ],
  }

  return (
    <CCard>
      <CCardHeader>{rfqDetails.title} - Details</CCardHeader>
      <CCardBody>
        <h5>Product Details:</h5>
        <p>{rfqDetails.productDetails}</p>

        <h5>Vendors Invited:</h5>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfqDetails.vendors.map((vendor, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{vendor.name}</CTableDataCell>
                <CTableDataCell>{vendor.status}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <h5>Submitted Responses:</h5>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Response</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfqDetails.responses.map((response, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{response.vendor}</CTableDataCell>
                <CTableDataCell>{response.response}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CButton color="primary" href="/rfq-list" className="mt-3">
          Back to List
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default RFQDetailsPage
