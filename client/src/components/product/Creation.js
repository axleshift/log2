import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import ProductForm from '../Forms/ProductForm'
import { useAuth } from '../../context/AuthContext.js'
import axios from 'axios'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product/create`

function ProductCreation() {
  const { accessToken } = useAuth()
  const [formData, setFormData] = useState({
    itemName: '',
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
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('success')
  const [toastVisible, setToastVisible] = useState(false)
  const navigate = useNavigate()

  const generateSKU = () => {
    const skuBase = formData.itemName ? formData.itemName.substring(0, 3).toUpperCase() : 'XXX'
    const randomNum = Math.floor(Math.random() * 10000)
    return `${skuBase}${randomNum}`
  }

  const generateTags = () => {
    const itemWords = formData.itemName ? formData.itemName.split(' ') : []
    const categoryWords = formData.category ? formData.category.split(' ') : []
    const allWords = [...new Set([...itemWords, ...categoryWords])].map((word) =>
      word.toLowerCase(),
    )
    return allWords.join(', ')
  }

  useEffect(() => {
    if (formData.itemName && !formData.sku) {
      const newSKU = generateSKU()
      setFormData((prevData) => ({ ...prevData, sku: newSKU }))
    }
    if (formData.itemName || formData.category) {
      const newTags = generateTags()
      setFormData((prevData) => ({ ...prevData, tags: newTags }))
    }
  }, [formData.itemName, formData.category])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value !== undefined ? value : '' }))
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files ? Array.from(e.target.files) : [] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!accessToken) {
      setToastMessage('Authentication error. Please log in again.')
      setToastColor('danger')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)
      setLoading(false)
      return
    }

    const formDataToSend = new FormData()

    Object.keys(formData).forEach((key) => {
      if (key === 'images' && formData.images.length > 0) {
        formData.images.forEach((file) => formDataToSend.append('images', file))
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    })

    const dimensions = JSON.stringify({
      length: formData.length || 0,
      width: formData.width || 0,
      height: formData.height || 0,
    })
    formDataToSend.append('dimensions', dimensions)

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      }

      const response = await axios.post(PRODUCT_API_URL, formDataToSend, { headers })
      console.log(response.data)

      setFormData({
        itemName: '',
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

      setToastMessage('Product created successfully!')
      setToastColor('success')
      setToastVisible(true)

      setTimeout(() => {
        setToastVisible(false)
        navigate('/procurement/product-catalog')
      }, 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create product'
      console.error(errorMessage)
      setToastMessage(errorMessage)
      setToastColor('danger')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)
    } finally {
      setLoading(false)
    }
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
                error={error}
              />
              {toastVisible && (
                <div className={`alert alert-${toastColor}`} role="alert">
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
