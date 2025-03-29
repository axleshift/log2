import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import ProductForm from '../Forms/ProductForm'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product/create`

function ProductCreation() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    images: [],
    status: 'Available',
    sku: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    manufacturer: '',
    tags: '',
    color: '',
    size: '',
  })

  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('success')
  const [toastVisible, setToastVisible] = useState(false)

  const generateSKU = () => {
    const base = formData.name ? formData.name.slice(0, 3).toUpperCase() : 'XXX'
    const rand = Math.floor(1000 + Math.random() * 9000)
    return `${base}${rand}`
  }

  const generateTags = () => {
    const nameWords = formData.name?.split(' ') || []
    const categoryWords = formData.category?.split(' ') || []
    return [...new Set([...nameWords, ...categoryWords])].map((w) => w.toLowerCase()).join(', ')
  }

  useEffect(() => {
    if (formData.name && !formData.sku) {
      setFormData((prev) => ({ ...prev, sku: generateSKU() }))
    }
    if (formData.name || formData.category) {
      setFormData((prev) => ({ ...prev, tags: generateTags() }))
    }
  }, [formData.name, formData.category])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setFormData((prev) => ({ ...prev, images: files }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessToken) {
      return showToast('Authentication error. Please log in again.', 'danger')
    }

    setLoading(true)

    const payload = new FormData()

    // Append regular fields
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach((file) => payload.append('images', file))
      } else if (['length', 'width', 'height'].includes(key)) {
        continue // handle dimensions separately
      } else if (formData[key]) {
        payload.append(key, formData[key])
      }
    }

    // Append nested dimensions
    const dimensions = JSON.stringify({
      length: formData.length || 0,
      width: formData.width || 0,
      height: formData.height || 0,
    })
    payload.append('dimensions', dimensions)

    try {
      const headers = { Authorization: `Bearer ${accessToken}` }
      await axios.post(PRODUCT_API_URL, payload, { headers })

      showToast('✅ Product created successfully!', 'success')
      setTimeout(() => {
        navigate('/procurement/product-catalog')
      }, 2000)

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        images: [],
        status: 'Available',
        sku: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        manufacturer: '',
        tags: '',
        color: '',
        size: '',
      })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create product'
      showToast(`🚨 ${msg}`, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, color) => {
    setToastMessage(msg)
    setToastColor(color)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 5000)
  }

  return (
    <CContainer className="py-4">
      <CRow className="justify-content-center">
        <CCol md={10} lg={8}>
          <CCard>
            <CCardHeader className="fw-bold">Create New Product</CCardHeader>
            <CCardBody>
              <ProductForm
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                loading={loading}
              />
              {toastVisible && (
                <div className={`alert alert-${toastColor} mt-3`} role="alert">
                  {toastMessage}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductCreation
