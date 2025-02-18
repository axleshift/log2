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
  const [quoteModal, setQuoteModal] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [vendors, setVendors] = useState([])

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
        setVendors(response.data.vendors) // Vendors will be fetched here
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
          <strong>RFQ Number:</strong> {rfq.rfqNumber}
        </h6>
        <h6>
          <strong>Title:</strong> {rfq.title}
        </h6>
        <h6>
          <strong>Description:</strong> {rfq.description || 'No description available'}
        </h6>
        <h6>
          <strong>Status:</strong>
          <CBadge
            color={
              rfq.status === 'Open' ? 'success' : rfq.status === 'Awarded' ? 'warning' : 'danger'
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

        {/* Items Table */}
        <h6>
          <strong>Items</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Unit</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfq.items.length > 0 ? (
              rfq.items.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.name || 'No name'}</CTableDataCell>
                  <CTableDataCell>{item.quantity || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.unit || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="3">No items listed</CTableDataCell>
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
            {rfq.vendors.length > 0 ? (
              rfq.vendors.map((vendor, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{vendor.businessName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.contactNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.userId?.email || 'N/A'}</CTableDataCell>
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
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Delivery Time</CTableHeaderCell>
              <CTableHeaderCell>Additional Notes</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfq.quotes.length > 0 ? (
              rfq.quotes.map((quote, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{quote.vendor?.businessName || 'Unknown Vendor'}</CTableDataCell>
                  <CTableDataCell>${quote.price || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{quote.deliveryTime || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{quote.additionalNotes || 'No additional notes'}</CTableDataCell>
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

        {/* Awarded Vendor */}
        {rfq.awardedVendor ? (
          <h6>
            <strong>Awarded Vendor:</strong> {rfq.awardedVendor.businessName || rfq.awardedVendor}
          </h6>
        ) : (
          <p>No vendor awarded yet.</p>
        )}
      </CCardBody>
    </CCard>
  )
}

export default RFQDetails
