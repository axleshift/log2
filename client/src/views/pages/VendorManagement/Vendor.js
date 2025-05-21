import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

const API_URL = import.meta.env.VITE_API_URL
const RFQ_API_URL = `${API_URL}/api/v1/rfq`
const QUOTE_API_URL = `${API_URL}/api/v1/vendor-quotes`

const VendorRFQsWithQuotes = () => {
  const { accessToken } = useAuth()
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toasts, setToasts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [form, setForm] = useState({ price: '', details: '', status: 'Pending' })
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [quoteStatuses, setQuoteStatuses] = useState({})

  const showToast = (message, color = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, color }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const fetchQuoteStatus = async (rfqId) => {
    try {
      const response = await axios.get(`${QUOTE_API_URL}/status/${rfqId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      return response.data.status || 'Not Submitted'
    } catch {
      return 'Not Submitted'
    }
  }

  const fetchAllQuoteStatuses = async (rfqsList) => {
    const statuses = {}
    await Promise.all(
      rfqsList.map(async (rfq) => {
        const status = await fetchQuoteStatus(rfq._id)
        statuses[rfq._id] = status
      }),
    )
    setQuoteStatuses(statuses)
  }

  const fetchVendorRFQs = async () => {
    try {
      const response = await axios.get(`${RFQ_API_URL}/vendor/rfqs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const rfqList = response.data.rfqs || []
      setRfqs(rfqList)
      fetchAllQuoteStatuses(rfqList)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load RFQs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchVendorRFQs()
    }
  }, [accessToken])

  const openQuoteModal = (rfq) => {
    setSelectedRFQ(rfq)
    setForm({ price: '', details: '', leadTime: '', terms: '', status: 'Pending' })
    setModalVisible(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitQuote = async (e) => {
    e.preventDefault()
    if (!selectedRFQ) return

    setSubmitting(true)

    try {
      await axios.post(
        QUOTE_API_URL,
        {
          rfqId: selectedRFQ._id,
          price: form.price,
          details: form.details,
          leadTime: form.leadTime,
          terms: form.terms,
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      showToast('Quote submitted!', 'success')
      setModalVisible(false)
      setForm({ price: '', details: '', leadTime: '', terms: '', status: 'Pending' })
      fetchVendorRFQs()
    } catch (err) {
      console.error(err)
      showToast('Failed to submit quote', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRFQ = async (rfqId) => {
    try {
      await axios.delete(`${RFQ_API_URL}/${rfqId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      showToast('RFQ deleted!', 'success')
      fetchVendorRFQs()
    } catch (error) {
      console.error('Delete failed:', error)
      showToast('Failed to delete RFQ', 'danger')
    }
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">Your RFQs</CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        ) : rfqs.length === 0 ? (
          <CAlert color="warning" className="text-center">
            No RFQs available.
          </CAlert>
        ) : (
          <CTable striped hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Due Date</CTableHeaderCell>
                <CTableHeaderCell>Quote Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfqs.map((rfq, index) => (
                <CTableRow key={rfq._id}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{rfq.procurementId?.title || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{quoteStatuses[rfq._id] || 'Loading...'}</CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/vendor/rfqs/${rfq._id}`} className="btn btn-sm btn-primary me-2">
                      View Details
                    </Link>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => openQuoteModal(rfq)}
                      className="me-2"
                    >
                      Submit Quote
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteRFQ(rfq._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} scrollable>
        <CModalHeader>
          <strong>Submit Quote for</strong>&nbsp;{selectedRFQ?.procurementId?.title || 'RFQ'}
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmitQuote}>
            <CRow className="mb-3">
              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="price">Price</CFormLabel>
                <CFormInput
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Enter your quote price"
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="details">Details / Description</CFormLabel>
                <CFormTextarea
                  id="details"
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Provide additional details if any"
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="leadTime">Lead Time</CFormLabel>
                <CFormInput
                  id="leadTime"
                  name="leadTime"
                  value={form.leadTime}
                  onChange={handleChange}
                  placeholder="e.g. 2 weeks"
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="terms">Terms & Conditions</CFormLabel>
                <CFormTextarea
                  id="terms"
                  name="terms"
                  value={form.terms}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Specify payment or delivery terms"
                />
              </CCol>
            </CRow>

            <CRow className="text-center mb-2">
              <CCol>
                <CButton color="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Quote'}
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} autohide visible color={toast.color}>
            <CToastHeader closeButton>
              {toast.color === 'success' ? '✅ Success' : '🚨 Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CCard>
  )
}

export default VendorRFQsWithQuotes
