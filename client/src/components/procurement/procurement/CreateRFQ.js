import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CSpinner,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'

const VENDOR_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/vendor`

const CreateRFQ = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()

  const [rfqData, setRfqData] = useState({
    title: '',
    description: '',
    department: '',
    deadline: '',
    procurementId: id,
    requestedBy: '',
    products: [],
    vendors: [],
  })

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: '' })

  useEffect(() => {
    const fetchProcurement = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/procurement/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        )
        const data = response.data
        setRfqData((prev) => ({
          ...prev,
          title: `RFQ for ${data.title || ''}`,
          description: data.description || '',
          department: data.department || '',
          requestedBy: data.requestedBy?.email || 'Unknown',
          products:
            data.products?.map((product) => ({
              ...product,
              unitPrice: product.unitPrice || '',
            })) || [],
        }))
      } catch (err) {
        setError('Failed to load procurement details.')
      }
    }

    const fetchVendors = async () => {
      try {
        const response = await axios.get(VENDOR_API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setVendors(response.data)
      } catch (err) {
        console.error('Failed to load vendors:', err)
      }
    }

    if (accessToken) {
      fetchProcurement()
      fetchVendors()
    }
  }, [id, accessToken])

  const handleChange = (e) => {
    setRfqData({ ...rfqData, [e.target.name]: e.target.value || '' })
  }

  const handleVendorSelection = (selectedOptions) => {
    setRfqData((prev) => ({
      ...prev,
      vendors: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }))
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
      }

      console.log('RFQ Payload:', JSON.stringify(payload, null, 2))

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/rfq/create`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      setToast({ visible: true, message: 'RFQ And Invites successfully created!', type: 'success' })

      // Reset form after successful submission
      setRfqData({
        title: '',
        description: '',
        department: '',
        deadline: '',
        procurementId: id,
        requestedBy: '',
        products: [],
        vendors: [],
      })
    } catch (err) {
      console.error('Request Error:', err.response?.data || err.message)
      setToast({ visible: true, message: 'Failed to create RFQ.', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CToaster>
        {toast.visible && (
          <CToast autohide delay={3000} visible color={toast.type}>
            <CToastHeader closeButton>
              {toast.type === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

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

            <h5>Invite Vendors</h5>
            <Select
              isMulti
              options={vendors.map((vendor) => ({
                value: vendor._id,
                label: `${vendor.businessName} (${vendor.userId?.email})`,
              }))}
              onChange={handleVendorSelection}
              value={rfqData.vendors.map((vendorId) => {
                const vendor = vendors.find((v) => v._id === vendorId)
                return vendor
                  ? { value: vendor._id, label: `${vendor.businessName} (${vendor.userId?.email})` }
                  : null
              })}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#f8f9fa',
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#80bdff' },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                  border: '1px solid #ced4da',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#007bff' : isFocused ? '#e9ecef' : 'white',
                  color: isSelected ? 'white' : 'black',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#007bff',
                  color: 'white',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  '&:hover': { backgroundColor: '#0056b3', color: 'white' },
                }),
              }}
            />

            <CButton color="primary" type="submit" disabled={loading} className="mt-3">
              {loading ? <CSpinner size="sm" /> : 'Create RFQ'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateRFQ
