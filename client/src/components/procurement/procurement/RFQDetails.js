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
        const { data } = await axios.get(`${RFQ_API_URL}/${id}`)
        setRFQ(data.rfq)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load RFQ')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQ()
  }, [id])

  if (loading) return <CSpinner color="primary" />
  if (error) return <div className="text-danger">{error}</div>
  if (!rfq) return <div>No RFQ found.</div>

  const products = rfq.products || []
  const vendors = rfq.vendors || []
  const quotes = rfq.quotes || []
  const selectedVendor = rfq.selectedVendor || null
  const requestedBy = rfq.requestedBy?.email || rfq.procurementId?.requestedBy?.email || 'Unknown'

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>RFQ Details</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>
          Back to RFQ List
        </CButton>
      </CCardHeader>
      <CCardBody>
        {/* RFQ General Info */}
        <div className="row mb-3">
          <div className="col-md-6">
            <strong>RFQ ID:</strong> {rfq._id}
          </div>
          <div className="col-md-6">
            <strong>Title:</strong> {rfq.procurementId?.title || 'N/A'}
          </div>
          <div className="col-md-6">
            <strong>Description:</strong>{' '}
            {rfq.procurementId?.description || 'No description available'}
          </div>
          <div className="col-md-6">
            <strong>Status:</strong>
            <CBadge
              color={
                rfq.status === 'Open' ? 'success' : rfq.status === 'Closed' ? 'danger' : 'warning'
              }
            >
              {rfq.status}
            </CBadge>
          </div>
          <div className="col-md-6">
            <strong>Created By:</strong> {requestedBy}
          </div>
          <div className="col-md-6">
            <strong>Created At:</strong> {new Date(rfq.createdAt).toLocaleDateString()}
          </div>
        </div>

        <hr />

        {/* Products Table */}
        <h6>
          <strong>Items</strong>
        </h6>
        <CTable hover responsive className="text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Unit</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{product.name || 'No name'}</CTableDataCell>
                  <CTableDataCell>{product.quantity || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{product.unit || 'No Unit'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="3" className="text-center">
                  No products listed
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <hr />

        {/* Vendors Table */}
        <h6>
          <strong>Invited Vendors</strong>
        </h6>
        <CTable hover responsive className="text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Business Name</CTableHeaderCell>
              <CTableHeaderCell>Contact Person</CTableHeaderCell>
              <CTableHeaderCell>Phone Number</CTableHeaderCell>
              <CTableHeaderCell>User Email</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {vendors.length > 0 ? (
              vendors.map((vendor, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{vendor.businessName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.fullName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.contactNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{vendor.userId?.email || 'No Email'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4" className="text-center">
                  No vendors added yet.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <hr />

        {/* Selected Vendor */}
        <h6>
          <strong>Selected Vendor:</strong>{' '}
          {selectedVendor?.businessName || (
            <span className="text-muted">No vendor selected yet.</span>
          )}
        </h6>
      </CCardBody>
    </CCard>
  )
}

export default RFQDetails
