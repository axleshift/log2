import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const RFQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRFQ = async () => {
      if (!id) {
        setError('Invalid RFQ ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await axios.get(`${RFQ_API_URL}/${id}`)
        setRFQ(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load RFQ')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQ()
  }, [id])

  if (loading) return <CSpinner color="primary" />
  if (error) return <div>{error}</div>
  if (!rfq) return <div>No RFQ found.</div>

  // Ensure these are defined before accessing .length
  const products = rfq.products || []
  const invitedVendors = rfq.invitedVendors || []
  const quotes = rfq.quotes || []

  return (
    <CCard>
      <CCardHeader>
        <h5>RFQ Details</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>
          Back to RFQ List
        </CButton>
      </CCardHeader>
      <CCardBody>
        <h6>
          <strong>RFQ ID:</strong> {rfq._id}
        </h6>
        <h6>
          <strong>Title:</strong> {rfq.procurementId?.title || 'N/A'}
        </h6>
        <h6>
          <strong>Description:</strong>{' '}
          {rfq.procurementId?.description || 'No description available'}
        </h6>
        <h6>
          <strong>Status:</strong>
          <CBadge
            color={
              rfq.status === 'Open' ? 'success' : rfq.status === 'Closed' ? 'danger' : 'warning'
            }
          >
            {rfq.status}
          </CBadge>
        </h6>
        <h6>
          <strong>Created By:</strong> {rfq.createdBy?.email || 'Unknown'}
        </h6>
        <h6>
          <strong>Created At:</strong> {new Date(rfq.createdAt).toLocaleDateString()}
        </h6>

        <hr />

        {/* Products Table */}
        <h6>
          <strong>Items</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Specs</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{product.name || 'No name'}</CTableDataCell>
                  <CTableDataCell>{product.specs || 'No specs'}</CTableDataCell>
                  <CTableDataCell>{product.quantity || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="3">No products listed</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <hr />

        {/* Vendors Table */}
        <h6>
          <strong>Invited Vendors</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Business Name</CTableHeaderCell>
              <CTableHeaderCell>Contact Person</CTableHeaderCell>
              <CTableHeaderCell>Phone Number</CTableHeaderCell>
              <CTableHeaderCell>User Email</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {invitedVendors.length > 0 ? (
              invitedVendors.map((vendor, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{vendor.businessName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.contactNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.userId?.email || 'No Email'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No vendors added yet.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <hr />

        {/* Quotes Table */}
        <h6>
          <strong>Quotes</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Price Per Unit</CTableHeaderCell>
              <CTableHeaderCell>Delivery Time</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    {quote.vendorId?.businessName || 'Unknown Vendor'}
                  </CTableDataCell>
                  <CTableDataCell>{quote.quoteDetails[0]?.pricePerUnit || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{quote.quoteDetails[0]?.deliveryTime || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{quote.status}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No quotes submitted yet.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <hr />

        {/* Selected Vendor */}
        {rfq.selectedVendor ? (
          <h6>
            <strong>Selected Vendor:</strong>{' '}
            {rfq.selectedVendor.businessName || rfq.selectedVendor}
          </h6>
        ) : (
          <p>No vendor selected yet.</p>
        )}
      </CCardBody>
    </CCard>
  )
}

export default RFQDetails
