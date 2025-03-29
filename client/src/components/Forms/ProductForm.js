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

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormInput
            name="name"
            label="Product Name"
            value={formData.name || ''}
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

      <CRow className="mb-3">
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
          <CFormInput
            name="stockQuantity"
            type="number"
            label="Stock Quantity"
            value={formData.stockQuantity || ''}
            onChange={handleChange}
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
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
        <CCol md={6}>
          <CFormSelect
            name="status"
            label="Status"
            value={formData.status || ''}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CFormTextarea
        name="description"
        label="Description"
        rows={3}
        value={formData.description || ''}
        onChange={handleChange}
        className="mb-3"
        required
      />

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            name="length"
            label="Length (cm)"
            value={formData.length || ''}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="width"
            label="Width (cm)"
            value={formData.width || ''}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="height"
            label="Height (cm)"
            value={formData.height || ''}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="weight"
            label="Weight (kg)"
            value={formData.weight || ''}
            onChange={handleChange}
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormInput
            name="manufacturer"
            label="Manufacturer"
            value={formData.manufacturer || ''}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="color"
            label="Color"
            value={formData.color || ''}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="size"
            label="Size"
            value={formData.size || ''}
            onChange={handleChange}
          />
        </CCol>
      </CRow>

      <CFormInput
        name="tags"
        label="Tags (comma-separated)"
        value={formData.tags || ''}
        onChange={handleChange}
        className="mb-3"
      />

      <CFormInput
        name="images"
        type="file"
        label="Product Images"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      <CButton color="success" type="submit" disabled={loading}>
        {loading ? <CSpinner size="sm" /> : 'Create Product'}
      </CButton>
    </CForm>
  )
}

ProductForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
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
