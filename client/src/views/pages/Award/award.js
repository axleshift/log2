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
  CListGroup,
  CListGroupItem,
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
  const [awards, setAwards] = useState([])
  const [loadingAwards, setLoadingAwards] = useState(false)

  const showToast = (message, color = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, color }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  // Fetch Vendors
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

  const fetchAwards = async () => {
    setLoadingAwards(true)
    try {
      const res = await axios.get(AWARD_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setAwards(res.data)
    } catch (err) {
      console.error('Failed to fetch awards', err)
      showToast('Error loading awards', 'danger')
    } finally {
      setLoadingAwards(false)
    }
  }

  useEffect(() => {
    fetchVendors()
    fetchAwards()
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

      setAwardData({
        title: '',
        amount: '',
        date: '',
        details: '',
        vendorId: '',
      })

      showToast('✅ Award Notice created successfully!')
      fetchAwards()
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to create award', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${AWARD_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      showToast('🗑️ Award notice deleted successfully')
      fetchAwards()
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to delete award', 'danger')
    }
  }

  return (
    <>
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
            <CFormSelect
              name="vendorId"
              value={awardData.vendorId}
              onChange={handleChange}
              required
            >
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
            <CToast key={toast.id} autohide visible color={toast.color}>
              <CToastHeader closeButton>
                {toast.color === 'success' ? '✅ Success' : '🚨 Error'}
              </CToastHeader>
              <CToastBody>{toast.message}</CToastBody>
            </CToast>
          ))}
        </CToaster>
      </form>

      <hr />

      <h4>Recent Award Notices</h4>

      {loadingAwards ? (
        <CSpinner />
      ) : awards.length === 0 ? (
        <p>No award notices found.</p>
      ) : (
        <CListGroup>
          {awards.map(({ _id, title, amount, date, details, vendorId }) => (
            <CListGroupItem key={_id} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{title}</strong> - {amount.toFixed(2)} <br />
                <small>{new Date(date).toLocaleDateString()}</small> <br />
                <em>{details}</em> <br />
                <small>
                  Vendor: {vendorId?.businessName} ({vendorId?.fullName})
                </small>
              </div>
              <CButton color="danger" size="sm" onClick={() => handleDelete(_id)}>
                Delete
              </CButton>
            </CListGroupItem>
          ))}
        </CListGroup>
      )}
    </>
  )
}

export default CreateAwardNotice
