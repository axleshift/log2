import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import {
  CButton,
  CForm,
  CFormTextarea,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
  CFormInput,
} from '@coreui/react'
import CustomSwitch from '../../Forms/FormSwitch'
import RFQForms from './RFQForm'

const API_URL = import.meta.env.VITE_API_URL
const PROCUREMENT_API_URL = `${API_URL}/api/v1/procurement`
const RFQ_API_URL = `${API_URL}/api/v1/rfq`
const VENDOR_API_URL = `${API_URL}/api/v1/vendor`

const CreateProcurement = () => {
  const { accessToken } = useAuth()
  const [procurementData, setProcurementData] = useState({
    title: '',
    description: '',
    procurementDate: '',
    deliveryDate: '',
    status: 'Pending',
    rfqRequired: false,
    selectedVendorId: '',
  })

  const [rfqData, setRfqData] = useState({ products: [], invitedVendors: [] })
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(VENDOR_API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      } catch (error) {
        console.error('❌ Error fetching vendors:', error)
        showToast('🚨 Failed to load vendors.', 'danger')
      }
    }
    if (accessToken) fetchVendors()
  }, [accessToken])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProcurementData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleRFQ = () => {
    setProcurementData((prev) => ({
      ...prev,
      rfqRequired: !prev.rfqRequired,
    }))
    if (!procurementData.rfqRequired) setRfqData({ products: [], invitedVendors: [] })
  }

  const showToast = (message, color) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      if (!accessToken) throw new Error('Authentication error. Please log in again.')
      const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }

      // Create Procurement
      const procurementPayload = {
        ...procurementData,
        products: procurementData.rfqRequired ? rfqData.products : [],
        invitedVendors: procurementData.rfqRequired ? rfqData.invitedVendors : [],
      }

      console.log('🔍 Submitting Procurement:', procurementPayload)
      const procurementResponse = await axios.post(PROCUREMENT_API_URL, procurementPayload, {
        headers,
      })

      console.log('✅ Procurement Created:', procurementResponse.data)

      const rfqId = procurementResponse.data.rfqId

      // If RFQ is required, send invites to vendors
      if (procurementData.rfqRequired && rfqData.invitedVendors.length > 0) {
        const invitePayload = { vendors: rfqData.invitedVendors }
        console.log('🔍 Inviting Vendors to RFQ:', invitePayload)
        await axios.post(`${RFQ_API_URL}/${rfqId}/invite`, invitePayload, { headers })
        console.log('✅ Vendors Invited to RFQ')
      }

      // Reset form state
      setProcurementData({
        title: '',
        description: '',
        procurementDate: '',
        deliveryDate: '',
        status: 'Pending',
        rfqRequired: false,
        selectedVendorId: '',
      })
      setRfqData({ products: [], invitedVendors: [] })

      showToast('🎉 Procurement successfully created and vendors invited!', 'success')
    } catch (error) {
      console.error('❌ Error creating procurement:', error.response || error)
      showToast(error.response?.data?.message || '🚨 Failed to create procurement.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      {/* Procurement form fields */}
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormInput
            type="text"
            name="title"
            value={procurementData.title}
            onChange={handleChange}
            placeholder="Title"
            label="Title"
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="date"
            name="procurementDate"
            value={procurementData.procurementDate}
            onChange={handleChange}
            label="Procurement Date"
            required
          />
        </CCol>
      </CRow>

      {/* Description and dates */}
      <CFormTextarea
        name="description"
        value={procurementData.description}
        onChange={handleChange}
        placeholder="Description"
        label="Description"
        required
        rows={3}
      />

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormInput
            type="date"
            name="deliveryDate"
            value={procurementData.deliveryDate}
            onChange={handleChange}
            label="Expected Delivery Date"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput type="text" name="status" value="Pending" label="Status" disabled />
        </CCol>
      </CRow>

      {/* RFQ toggle */}
      <CustomSwitch
        id="rfqRequired"
        label="Require RFQ (Bidding Process)"
        checked={procurementData.rfqRequired}
        onChange={toggleRFQ}
        description="Enable this option to require a Request for Quotation (RFQ) before proceeding with procurement."
      />

      {procurementData.rfqRequired && <RFQForms rfqData={rfqData} setRfqData={setRfqData} />}

      <CButton color="success" type="submit" disabled={loading}>
        {loading ? <CSpinner size="sm" /> : 'Create Procurement'}
      </CButton>

      <CToaster placement="top-end">
        {toasts.map(({ id, message, color }) => (
          <CToast key={id} color={color} autohide visible>
            <CToastHeader closeButton>Notification</CToastHeader>
            <CToastBody>{message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CForm>
  )
}

export default CreateProcurement
