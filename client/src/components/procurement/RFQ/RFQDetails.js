import React from 'react'
import { useState, useEffect } from 'react'
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
} from '@coreui/react'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const RFQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRFQ = async () => {
      try {
        const response = await axios.get(`${RFQ_API_URL}/${id}`)
        setRFQ(response.data)
      } catch (error) {
        console.error(
          'Error fetching RFQ details:',
          error.response ? error.response.data : error.message,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRFQ()
  }, [id])

  if (loading) return <p>Loading RFQ details...</p>
  if (!rfq) return <p>RFQ not found</p>

  return (
    <CCard>
      <CCardHeader>
        <h5>RFQ Details</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>
          Back
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
          <strong>Description:</strong> {rfq.description}
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
          <strong>Created By:</strong> {rfq.createdBy ? rfq.createdBy.name : 'Unknown'}
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
            {rfq.items.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.quantity}</CTableDataCell>
                <CTableDataCell>{item.unit}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <hr />

        {/* Vendors Table  */}
        <h6>
          <strong>Vendors</strong>
        </h6>
        {rfq.vendors.length > 0 ? (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Business Name</CTableHeaderCell>
                <CTableHeaderCell>Contact Person</CTableHeaderCell>
                <CTableHeaderCell>Phone Number</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfq.vendors.map((vendor, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{vendor.businessName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.contactNumber || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>No vendors added yet.</p>
        )}

        <hr />

        {/* Quotes Table  */}
        <h6>
          <strong>Quotes</strong>
        </h6>
        {rfq.quotes.length > 0 ? (
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
              {rfq.quotes.map((quote, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{quote.vendor?.businessName || 'Unknown Vendor'}</CTableDataCell>
                  <CTableDataCell>${quote.price}</CTableDataCell>
                  <CTableDataCell>{quote.deliveryTime}</CTableDataCell>
                  <CTableDataCell>{quote.additionalNotes || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>No quotes submitted yet.</p>
        )}

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
