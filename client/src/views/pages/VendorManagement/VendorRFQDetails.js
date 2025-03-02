import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
import QuoteModal from '../../../components/Modal/QuoteModal'
import { useToast } from '../../../components/Toast/Toast.js'

const VendorRFQDetails = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [quote, setQuote] = useState({
    totalPrice: '',
    quantity: '',
    leadTime: '',
    terms: '',
    validUntil: '',
    status: 'Pending',
  })

  useEffect(() => {
    const fetchRFQDetails = async () => {
      setLoading(true)
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

  const handleQuoteChange = (e) => {
    setQuote({ ...quote, [e.target.name]: e.target.value })
  }

  const handleSubmitQuote = async () => {
    if (!quote.totalPrice || !quote.quantity || !quote.leadTime) {
      showToast('Please fill in all required fields.', 'warning')
      return
    }

    try {
      setQuoteLoading(true)
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/rfq/vendor/rfqs/${id}/submit-quote`,
        { ...quote, quoteDate: new Date() },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      setShowModal(false)
      setQuoteLoading(false)
      showToast('Quote submitted successfully!', 'success')
    } catch (err) {
      setQuoteLoading(false)
      showToast('Failed to submit quote.', 'error')
    }
  }

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
          <>
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
                <strong>Requested By:</strong>{' '}
                {rfq?.requestedBy?.email || rfq?.procurementId?.requestedBy?.email || 'Unknown'}
              </div>
              <div className="col-md-6">
                <strong>Created At:</strong> {new Date(rfq.createdAt).toLocaleDateString()}
              </div>
            </div>
            <hr />
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
                {rfq.products?.length > 0 ? (
                  rfq.products.map((product, index) => (
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

            {/* Quotes Table */}
            <h6>
              <strong>Submitted Quotes</strong>
            </h6>
            <CTable hover responsive className="text-center">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Total Price</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Lead Time</CTableHeaderCell>
                  <CTableHeaderCell>Terms</CTableHeaderCell>
                  <CTableHeaderCell>Valid Until</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rfq.quotes.length > 0 ? (
                  rfq.quotes.map((q, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{q.totalPrice}</CTableDataCell>
                      <CTableDataCell>{q.quantity}</CTableDataCell>
                      <CTableDataCell>{q.leadTime}</CTableDataCell>
                      <CTableDataCell>{q.terms || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            q.status === 'Approved'
                              ? 'success'
                              : q.status === 'Rejected'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {q.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6">No quotes submitted yet.</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            <CButton
              color="primary"
              className="mt-3"
              onClick={() => setShowModal(true)}
              disabled={quoteLoading}
            >
              {quoteLoading ? <CSpinner size="sm" /> : 'Submit Quote'}
            </CButton>
            <QuoteModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              quote={quote}
              onChange={handleQuoteChange}
              onSubmit={handleSubmitQuote}
            />
          </>
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
