import React, { useState, useEffect } from 'react'
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

const MOCK_VENDORS = [
  { _id: '1', companyName: 'Vendor A' },
  { _id: '2', companyName: 'Vendor B' },
  { _id: '3', companyName: 'Vendor C' },
]

const MOCK_PRODUCTS = [
  { _id: '1', description: 'Product A', unitPrice: 10 },
  { _id: '2', description: 'Product B', unitPrice: 20 },
  { _id: '3', description: 'Product C', unitPrice: 30 },
]

const MOCK_PO_API_RESPONSE = {
  message: 'Purchase order successfully created!',
}

const PurchaseOrder = () => {
  const [poData, setPoData] = useState({
    poNumber: '',
    orderDate: '',
    receiveDate: '',
    carrier: '',
    vendorId: '',
    shipTo: {
      companyName: '',
      receiver: '',
      address: '',
      phone: '',
    },
    vendor: {
      companyName: '',
      address: '',
      phone: '',
    },
    details: [{ productId: '', quantity: '', subTotal: 0 }],
  })

  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('')

  // Fetch vendors and products when the component mounts (using mock data)
  useEffect(() => {
    setVendors(MOCK_VENDORS)
    setProducts(MOCK_PRODUCTS)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('shipTo') || name.includes('vendor')) {
      const [prefix, field] = name.split('.')
      setPoData({
        ...poData,
        [prefix]: {
          ...poData[prefix],
          [field]: value,
        },
      })
    } else if (name.includes('details')) {
      const [prefix, index, field] = name.split('.')
      const updatedDetails = [...poData.details]
      updatedDetails[index][field] = value
      if (field === 'quantity') {
        updatedDetails[index].subTotal =
          updatedDetails[index].quantity *
            products.find((p) => p._id === poData.details[index].productId)?.unitPrice || 0
      }
      setPoData({ ...poData, details: updatedDetails })
    } else {
      setPoData({ ...poData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate an API call to create a purchase order (using mock response)
      const response = MOCK_PO_API_RESPONSE

      // Mock success response
      setToastMessage(response.message)
      setToastColor('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)

      // Reset form
      setPoData({
        poNumber: '',
        orderDate: '',
        receiveDate: '',
        carrier: '',
        vendorId: '',
        shipTo: {
          companyName: '',
          receiver: '',
          address: '',
          phone: '',
        },
        vendor: {
          companyName: '',
          address: '',
          phone: '',
        },
        details: [{ productId: '', quantity: '', subTotal: 0 }],
      })
    } catch (error) {
      setToastMessage('Error creating purchase order')
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
            <CFormInput
              type="text"
              name="poNumber"
              value={poData.poNumber}
              onChange={handleChange}
              label="PO Number"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="date"
              name="orderDate"
              value={poData.orderDate}
              onChange={handleChange}
              label="Order Date"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="date"
              name="receiveDate"
              value={poData.receiveDate}
              onChange={handleChange}
              label="Receive Date"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              name="carrier"
              value={poData.carrier}
              onChange={handleChange}
              label="Carrier"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
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
                  {vendor.companyName}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="vendor.address"
              value={poData.vendor.address}
              onChange={handleChange}
              label="Vendor Address"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              name="vendor.phone"
              value={poData.vendor.phone}
              onChange={handleChange}
              label="Vendor Phone"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="shipTo.companyName"
              value={poData.shipTo.companyName}
              onChange={handleChange}
              label="Ship To Company"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              name="shipTo.receiver"
              value={poData.shipTo.receiver}
              onChange={handleChange}
              label="Receiver"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="shipTo.address"
              value={poData.shipTo.address}
              onChange={handleChange}
              label="Ship To Address"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              name="shipTo.phone"
              value={poData.shipTo.phone}
              onChange={handleChange}
              label="Receiver Phone"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormSelect
              name="details.0.productId"
              value={poData.details[0].productId}
              onChange={handleChange}
              label="Select Product"
              required
            >
              <option value="">Choose Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.description}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="number"
              name="details.0.quantity"
              value={poData.details[0].quantity}
              onChange={handleChange}
              label="Quantity"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="details.0.subTotal"
              value={poData.details[0].subTotal}
              disabled
              label="Sub Total"
            />
          </CCol>
        </CRow>

        <CButton color="primary" type="submit" disabled={loading}>
          {loading ? <CSpinner size="sm" /> : 'Submit PO'}
        </CButton>
      </CForm>

      <CToaster position="top-center" visible={toastVisible ? 'true' : undefined}>
        <CToast color={toastColor}>
          <CToastHeader closeButton>{toastColor === 'success' ? 'Success' : 'Error'}</CToastHeader>
          <CToastBody>{toastMessage}</CToastBody>
        </CToast>
      </CToaster>
    </>
  )
}

export default PurchaseOrder
