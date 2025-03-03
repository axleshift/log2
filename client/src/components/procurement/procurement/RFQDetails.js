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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const RFQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

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

  const handleAcceptQuote = (quote) => {
    setSelectedQuote(quote)
    setModalVisible(true)
  }

  const confirmAcceptQuote = async () => {
    if (!selectedQuote) return
    try {
      const { data } = await axios.put(`${RFQ_API_URL}/${id}/accept-quote`, {
        quoteId: selectedQuote._id,
      })

      setRFQ(data.rfq)
      setModalVisible(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept quote')
    }
  }

  if (loading) return <CSpinner color="primary" />
  if (error) return <div className="text-danger">{error}</div>
  if (!rfq) return <div>No RFQ found.</div>

  const requestedBy = rfq.requestedBy?.email || rfq.procurementId?.requestedBy?.email || 'Unknown'

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>RFQ Details</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>
          Back
        </CButton>
      </CCardHeader>
      <CCardBody>
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
            {' '}
            <strong>Requested By:</strong> {requestedBy}
          </div>
          <div className="col-md-6">
            <strong>Status:</strong>{' '}
            <CBadge color={rfq.status === 'Open' ? 'success' : 'danger'}>{rfq.status}</CBadge>
          </div>
        </div>

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
            {rfq.products.length ? (
              rfq.products.map((p, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>{p.name}</CTableDataCell>
                  <CTableDataCell>{p.quantity}</CTableDataCell>
                  <CTableDataCell>{p.unit}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="3">No products listed</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <h6>
          <strong>Submitted Quotes</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Lead Time</CTableHeaderCell>
              <CTableHeaderCell>Terms</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfq.quotes.length ? (
              rfq.quotes.map((q) => (
                <CTableRow key={q._id}>
                  <CTableDataCell>{q.vendorId?.businessName || 'No Vendor'}</CTableDataCell>
                  <CTableDataCell>{q.totalPrice}</CTableDataCell>
                  <CTableDataCell>{q.leadTime}</CTableDataCell>
                  <CTableDataCell>{q.terms}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={q.status === 'Accepted' ? 'success' : 'warning'}>
                      {q.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {rfq.status !== 'Closed' && (
                      <CButton color="primary" onClick={() => handleAcceptQuote(q)}>
                        Accept
                      </CButton>
                    )}
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

        <h6>
          <strong>Selected Vendor:</strong>{' '}
          {rfq.selectedVendor?.businessName || 'No vendor selected'}
        </h6>
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Confirm Quote Selection</CModalHeader>
        <CModalBody>
          Accept quote from <strong>{selectedQuote?.vendorId?.businessName}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmAcceptQuote}>
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default RFQDetails
