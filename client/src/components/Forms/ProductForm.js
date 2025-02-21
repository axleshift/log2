import React from 'react'
import PropTypes from 'prop-types'
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CSpinner,
  CForm,
  CAlert,
} from '@coreui/react'

function ProductForm({ formData, handleChange, handleFileChange, handleSubmit, loading, error }) {
  return (
    <CForm onSubmit={handleSubmit}>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CRow>
        <CCol md={6}>
          <CFormInput
            name="itemName"
            label="Item Name"
            value={formData.itemName || ''}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            name="sku"
            label="SKU"
            value={formData.sku || ''}
            onChange={handleChange}
            disabled
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <CFormInput
            name="price"
            type="number"
            label="Price"
            value={formData.price || ''}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            name="category"
            label="Category"
            value={formData.category || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Logistics">Logistics</option>
            <option value="Office Supplies">Office Supplies</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CFormTextarea
        name="description"
        label="Description"
        value={formData.description || ''}
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
  )
}

ProductForm.propTypes = {
  formData: PropTypes.shape({
    itemName: PropTypes.string,
    sku: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    stockQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    manufacturer: PropTypes.string,
    tags: PropTypes.string,
    size: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

ProductForm.defaultProps = {
  error: '',
}

export default ProductForm
