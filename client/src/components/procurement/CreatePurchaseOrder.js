import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import {
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'

const PO_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/purchase-orders`
const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurements`
const VENDOR_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/vendor`

const CreatePurchaseOrder = () => {
  const { accessToken } = useAuth()

  const [poData, setPoData] = useState({
    procurementId: '',
    vendorId: '',
    products: [{ name: '', quantity: 0, price: 0 }],
    status: 'Issued',
  })

  const [procurements, setProcurements] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('')

  useEffect(() => {
    fetchProcurements()
    fetchVendors()
  }, [])

  const fetchProcurements = async () => {
    try {
      const { data } = await axios.get(PROCUREMENT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProcurements(data)
    } catch (error) {
      console.error('Error fetching procurements:', error)
    }
  }

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get(VENDOR_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setVendors(data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPoData({ ...poData, [name]: value })
  }

  const handleProductsChange = (e, index) => {
    const { name, value } = e.target
    const products = [...poData.products]
    products[index][name] = value
    setPoData({ ...poData, products })
  }

  const addProduct = () => {
    setPoData((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 0, price: 0 }],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!accessToken) {
      setToastMessage('Authentication error. Please log in again.')
      setToastColor('danger')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)
      setLoading(false)
      return
    }

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      await axios.post(PO_API_URL, poData, { headers })

      setToastMessage('Purchase Order created successfully!')
      setToastColor('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)

      setPoData({
        procurementId: '',
        vendorId: '',
        products: [{ name: '', quantity: 0, price: 0 }],
        status: 'Issued',
      })
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Error creating Purchase Order')
      setToastColor('danger')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormSelect
              name="procurementId"
              value={poData.procurementId}
              onChange={handleChange}
              label="Select Procurement"
              required
            >
              <option value="">Choose Procurement</option>
              {procurements.map((proc) => (
                <option key={proc._id} value={proc._id}>
                  {proc.title}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormSelect
              name="vendorId"
              value={poData.vendorId}
              onChange={handleChange}
              label="Select Vendor"
              required
            >
              <option value="">Choose Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <h5>Products</h5>
        {poData.products.map((product, index) => (
          <CRow className="mb-3" key={index}>
            <CCol md={4}>
              <CFormInput
                type="text"
                name="name"
                value={product.name}
                onChange={(e) => handleProductsChange(e, index)}
                placeholder="Product Name"
                label="Product Name"
                required
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleProductsChange(e, index)}
                placeholder="Quantity"
                label="Quantity"
                required
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleProductsChange(e, index)}
                placeholder="Price"
                label="Price"
                required
              />
            </CCol>
          </CRow>
        ))}
        <CButton color="secondary" onClick={addProduct} className="mb-3">
          + Add Product
        </CButton>

        <CButton color="success" type="submit" disabled={loading}>
          {loading ? <CSpinner size="sm" /> : 'Create Purchase Order'}
        </CButton>
      </CForm>
    </>
  )
}

export default CreatePurchaseOrder
