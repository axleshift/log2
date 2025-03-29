import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const QUOTE_API_URL = `${API_URL}/api/v1/vendor-quotes`

const VendorQuotes = () => {
  const { accessToken } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [form, setForm] = useState({ vendorName: '', price: '', details: '', status: 'Pending' })
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const showToast = (message, color = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 4000)
  }

  const fetchQuotes = async () => {
    try {
      const res = await axios.get(QUOTE_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setQuotes(res.data)
    } catch (err) {
      showToast('Error fetching vendor quotes', 'danger')
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(QUOTE_API_URL, form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setForm({ vendorName: '', price: '', details: '', status: 'Pending' })
      fetchQuotes()
      showToast('Vendor quote created!')
    } catch (err) {
      showToast('Failed to create quote', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormLabel>Vendor Name</CFormLabel>
            <CFormInput
              name="vendorName"
              value={form.vendorName}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Price</CFormLabel>
            <CFormInput
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Status</CFormLabel>
            <CFormSelect name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CFormLabel>Details</CFormLabel>
            <CFormTextarea name="details" value={form.details} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="text-center">
          <CCol>
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Submit Quote'}
            </CButton>
          </CCol>
        </CRow>
      </form>

      <CTable striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {quotes.map((q) => (
            <CTableRow key={q._id}>
              <CTableDataCell>{q.vendorName}</CTableDataCell>
              <CTableDataCell>${q.price}</CTableDataCell>
              <CTableDataCell>{q.details}</CTableDataCell>
              <CTableDataCell>{q.status}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

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
    </div>
  )
}

export default VendorQuotes
