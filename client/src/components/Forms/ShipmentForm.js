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

const MOCK_SHIPMENTS = [
  { _id: '1', name: 'Shipment A' },
  { _id: '2', name: 'Shipment B' },
  { _id: '3', name: 'Shipment C' },
]

const MOCK_DELIVERY_API_RESPONSE = {
  message: 'Shipment delivery successfully created!',
}

const ShipmentDeliveryForm = () => {
  const [shipmentData, setShipmentData] = useState({
    shipmentId: '',
    deliveryAddress: '',
    deliveryDate: '',
    recipientName: '',
    phone: '',
    status: 'Pending',
  })

  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('')

  // Fetch shipments when the component mounts (using mock data)
  useEffect(() => {
    setShipments(MOCK_SHIPMENTS)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setShipmentData({ ...shipmentData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate an API call to create a delivery (using mock response)
      const response = MOCK_DELIVERY_API_RESPONSE

      // Mock success response
      setToastMessage(response.message)
      setToastColor('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)

      // Reset form
      setShipmentData({
        shipmentId: '',
        deliveryAddress: '',
        deliveryDate: '',
        recipientName: '',
        phone: '',
        status: 'Pending',
      })
    } catch (error) {
      setToastMessage('Error creating delivery')
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
              name="shipmentId"
              value={shipmentData.shipmentId}
              onChange={handleChange}
              label="Select Shipment"
              required
            >
              <option value="">Choose Shipment</option>
              {shipments.map((shipment) => (
                <option key={shipment._id} value={shipment._id}>
                  {shipment.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              name="recipientName"
              value={shipmentData.recipientName}
              onChange={handleChange}
              label="Recipient Name"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="deliveryAddress"
              value={shipmentData.deliveryAddress}
              onChange={handleChange}
              label="Delivery Address"
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="date"
              name="deliveryDate"
              value={shipmentData.deliveryDate}
              onChange={handleChange}
              label="Delivery Date"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              type="text"
              name="phone"
              value={shipmentData.phone}
              onChange={handleChange}
              label="Phone"
              required
            />
          </CCol>
        </CRow>

        <CButton color="primary" type="submit" disabled={loading}>
          {loading ? <CSpinner size="sm" /> : 'Submit Delivery'}
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

export default ShipmentDeliveryForm
