import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { CButton, CCol, CFormInput, CFormTextarea, CRow } from '@coreui/react'

const VENDOR_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/vendor`

const RFQForms = ({ rfqData, setRfqData }) => {
  const [loading, setLoading] = useState(true)

  const handleProductChange = (index, field, value) => {
    if (field === 'quantity') {
      value = parseFloat(value) || 0
    }

    setRfqData((prevData) => ({
      ...prevData,
      products: prevData.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    }))
  }

  const addProduct = () => {
    if (rfqData.products.length >= 10) return
    setRfqData((prevData) => ({
      ...prevData,
      products: [...prevData.products, { name: '', quantity: 1, specs: '' }],
    }))
  }

  const removeProduct = (index) => {
    setRfqData((prevData) => ({
      ...prevData,
      products: prevData.products.filter((_, i) => i !== index),
    }))
  }

  return (
    <>
      <h5 className="mt-3">RFQ Details</h5>

      {/* Products List */}
      {rfqData.products.map((product, index) => (
        <CRow key={index} className="mb-3">
          <CCol md={4}>
            <CFormInput
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              label="Product Name"
              required
            />
          </CCol>
          <CCol md={4}>
            <CFormTextarea
              placeholder="Enter specifications..."
              value={product.specs}
              onChange={(e) => handleProductChange(index, 'specs', e.target.value)}
              label="Specifications"
              rows={3}
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="number"
              placeholder="Quantity"
              value={product.quantity || ''}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              label="Quantity"
              required
            />
          </CCol>
          <CCol md={1} className="d-flex align-items-end">
            <CButton color="danger" size="sm" onClick={() => removeProduct(index)}>
              ✕
            </CButton>
          </CCol>
        </CRow>
      ))}

      <CButton
        color="primary"
        variant="outline"
        size="sm"
        onClick={addProduct}
        disabled={rfqData.products.length >= 10}
      >
        + Add Product
      </CButton>
    </>
  )
}

RFQForms.propTypes = {
  rfqData: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        specs: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  setRfqData: PropTypes.func.isRequired,
}

export default RFQForms
