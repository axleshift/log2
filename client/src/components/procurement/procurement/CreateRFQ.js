import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import axios from 'axios'
import InviteVendorModal from '../../Modal/InviteModal.js'
import { useAuth } from '../../../context/AuthContext'

const CreateRFQ = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()

  const [rfqData, setRfqData] = useState({
    title: '',
    description: '',
    department: '',
    deadline: '',
    procurementId: id,
    products: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: '' })
  const [invitedVendors, setInvitedVendors] = useState([])
  const [showVendorModal, setShowVendorModal] = useState(false)

  useEffect(() => {
    const fetchProcurement = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/procurement/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        setRfqData((prev) => ({
          ...prev,
          title: `RFQ for ${response.data.title}`,
          description: response.data.description || '',
          department: response.data.department,
          requestedBy: response.data.requestedBy?.email || 'Unknown',
          products: response.data.products.map((product) => ({
            ...product,
            unitPrice: product.unitPrice || '',
          })),
        }))
      } catch (err) {
        setError('Failed to load procurement details.')
      }
    }

    if (accessToken) {
      fetchProcurement()
    }
  }, [id, accessToken])

  const handleChange = (e) => {
    setRfqData({ ...rfqData, [e.target.name]: e.target.value })
  }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    setRfqData((prev) => {
      const updatedProducts = prev.products.map((product, idx) =>
        idx === index ? { ...product, [name]: value } : product,
      )
      return { ...prev, products: updatedProducts }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...rfqData,
        products: rfqData.products.map((product) => ({
          ...product,
          unitPrice: Number(product.unitPrice) || 0,
        })),
        invitedVendors: invitedVendors.map((vendor) => vendor._id),
      }

      console.log('RFQ Payload:', JSON.stringify(payload, null, 2))

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/rfq/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      console.log('Server Response:', response.data)

      setToast({ visible: true, message: 'RFQ successfully created!', type: 'success' })
    } catch (err) {
      console.error('Request Error:', err.response?.data || err.message)
      setToast({ visible: true, message: 'Failed to create RFQ.', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      <CToaster>
        {toast.visible && (
          <CToast autohide={true} delay={3000} visible={toast.visible} color={toast.type}>
            <CToastHeader closeButton>
              {toast.type === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

      {/* Invite Vendors Button */}
      <CButton color="info" onClick={() => setShowVendorModal(true)}>
        Invite Vendors
      </CButton>

      {/* Vendors Table */}
      {invitedVendors.length > 0 && (
        <>
          <h5>Invited Vendors</h5>
          <CTable striped bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Business Name</CTableHeaderCell>
                <CTableHeaderCell>Contact Person</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invitedVendors.map((vendor, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{vendor.businessName}</CTableDataCell>
                  <CTableDataCell>{vendor.fullName}</CTableDataCell>
                  <CTableDataCell>{vendor.email}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </>
      )}

      {/* Invite Vendors Modal */}
      <InviteVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onInvite={(vendors) => {
          setInvitedVendors(vendors)
          setShowVendorModal(false)
        }}
      />

      {/* RFQ Form */}
      <CCard>
        <CCardHeader>Create RFQ</CCardHeader>
        <CCardBody>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <CForm onSubmit={handleSubmit}>
            <CFormInput label="Title" name="title" value={rfqData.title} disabled />
            <CFormInput
              label="Description"
              name="description"
              value={rfqData.description}
              disabled
            />
            <CFormInput label="Department" value={rfqData.department} disabled />
            <CFormInput label="Requested By" value={rfqData.requestedBy} disabled />
            <CFormInput
              type="date"
              label="Deadline"
              name="deadline"
              value={rfqData.deadline}
              onChange={handleChange}
              required
            />

            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Create RFQ'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateRFQ
