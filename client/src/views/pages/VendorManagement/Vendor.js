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
  const [form, setForm] = useState({ price: '', details: '' })
  const [selectedRFQ, setSelectedRFQ] = useState(null)

  const showToast = (message, color = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 4000)
  }

  const fetchVendorRFQs = async () => {
    try {
      const response = await axios.get(`${RFQ_API_URL}/vendor/rfqs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setRfqs(response.data.rfqs || [])
      console.log('Fetched RFQs:', response.data.rfqs)
    } catch (err) {
      console.error('Failed to fetch RFQs:', err)
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
    setForm({ price: '', details: '' })
    setModalVisible(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitQuote = async (e) => {
    e.preventDefault()
    if (!selectedRFQ) return
    try {
      await axios.post(
        QUOTE_API_URL,
        {
          rfqId: selectedRFQ._id,
          price: form.price,
          details: form.details,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      setModalVisible(false)
      showToast('Quote submitted!')
    } catch (err) {
      console.error(err)
      showToast('Failed to submit quote', 'danger')
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
                  <CTableDataCell>
                    <Link to={`/vendor/rfqs/${rfq._id}`} className="btn btn-sm btn-primary me-2">
                      View Details
                    </Link>
                    <CButton color="success" size="sm" onClick={() => openQuoteModal(rfq)}>
                      Submit Quote
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>Submit Quote for {selectedRFQ?.procurementId?.title || 'RFQ'}</CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmitQuote}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Price</CFormLabel>
                <CFormInput
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Details</CFormLabel>
                <CFormTextarea name="details" value={form.details} onChange={handleChange} />
              </CCol>
            </CRow>
            <CRow className="text-center">
              <CCol>
                <CButton color="primary" type="submit">
                  Submit Quote
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
          <CToast key={toast.id} autohide={true} visible={true} color={toast.color}>
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
