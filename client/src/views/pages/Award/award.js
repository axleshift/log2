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
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const AWARD_API_URL = `${API_URL}/api/v1/awards`
const VENDOR_API_URL = `${API_URL}/api/v1/vendor`

const CreateAwardNotice = () => {
  const { accessToken } = useAuth()
  const [awardData, setAwardData] = useState({
    title: '',
    amount: '',
    date: '',
    details: '',
    vendorId: '',
  })

  const [vendors, setVendors] = useState([])
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)

  const showToast = (message, color = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 4000)
  }

  const fetchVendors = async () => {
    try {
      const res = await axios.get(VENDOR_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setVendors(res.data)
    } catch (err) {
      console.error('Failed to fetch vendors', err)
      showToast('Error loading vendors', 'danger')
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAwardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      const payload = {
        ...awardData,
        amount: parseFloat(awardData.amount),
        date: new Date(awardData.date).toISOString(),
      }

      await axios.post(AWARD_API_URL, payload, { headers })

      // Reset
      setAwardData({
        title: '',
        amount: '',
        date: '',
        details: '',
        vendorId: '',
      })

      showToast('✅ Award Notice created successfully!')
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to create award', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Title</CFormLabel>
          <CFormInput name="title" value={awardData.title} onChange={handleChange} required />
        </CCol>
        <CCol md={3}>
          <CFormLabel>Amount</CFormLabel>
          <CFormInput
            name="amount"
            type="number"
            value={awardData.amount}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={3}>
          <CFormLabel>Date</CFormLabel>
          <CFormInput
            name="date"
            type="date"
            value={awardData.date}
            onChange={handleChange}
            required
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={12}>
          <CFormLabel>Details</CFormLabel>
          <CFormTextarea
            name="details"
            rows={4}
            value={awardData.details}
            onChange={handleChange}
            required
          />
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={6}>
          <CFormLabel>Vendor</CFormLabel>
          <CFormSelect name="vendorId" value={awardData.vendorId} onChange={handleChange} required>
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.businessName} ({vendor.fullName})
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow className="text-center">
        <CCol>
          <CButton color="success" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Create Award Notice'}
          </CButton>
        </CCol>
      </CRow>

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
    </form>
  )
}

export default CreateAwardNotice
