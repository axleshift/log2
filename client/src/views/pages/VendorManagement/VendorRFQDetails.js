import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CButton,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const VendorRFQDetails = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRFQDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/rfq/vendor/rfqs/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )
        setRFQ(response.data)
      } catch (err) {
        setError('Failed to load RFQ details.')
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchRFQDetails()
    }
  }, [id, accessToken])

  const products = rfq?.products || []
  const vendors = rfq?.vendors || []
  const quotes = rfq?.quotes || []
  const requestedBy = rfq?.requestedBy?.email || rfq?.procurementId?.requestedBy?.email || 'Unknown'

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">RFQ Details</CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        ) : rfq ? (
          <div>
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
                    rfq.status === 'Open'
                      ? 'success'
                      : rfq.status === 'Closed'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {rfq.status}
                </CBadge>
              </div>
              <div className="col-md-6">
                <strong>Requested By:</strong> {requestedBy}
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

            <Link to="/vendor/rfqs">
              <CButton color="secondary" className="mt-3">
                Back to RFQs
              </CButton>
            </Link>
          </div>
        ) : (
          <CAlert color="warning" className="text-center">
            RFQ not found.
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  )
}

export default VendorRFQDetails
