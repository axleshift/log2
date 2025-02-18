import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product`

function ProductCreation() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    images: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData.images.forEach((file) => formDataToSend.append('images', file))
      } else {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      const response = await fetch(PRODUCT_API_URL, {
        method: 'POST',
        body: formDataToSend,
      })
      if (!response.ok) throw new Error('Failed to create product')
      navigate('/procurement/products')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="py-4">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader className="fw-bold">Create New Product</CCardHeader>
            <CCardBody>
              {error && <CAlert color="danger">{error}</CAlert>}
              <CForm onSubmit={handleSubmit}>
                <CFormInput
                  name="itemName"
                  label="Item Name"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
                <CFormTextarea
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <CFormInput
                  name="price"
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <CFormSelect
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                </CFormSelect>
                <CFormInput
                  name="stockQuantity"
                  type="number"
                  label="Stock Quantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                />
                <CFormInput
                  name="images"
                  type="file"
                  label="Product Images"
                  multiple
                  onChange={handleFileChange}
                />
                <CButton color="success" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Create Product'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductCreation
