import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const generateRFQNumber = () => {
  return `RFQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

const CreateRFQ = () => {
  const { accessToken } = useAuth()

  const [rfqData, setRfqData] = useState({
    rfqNumber: generateRFQNumber(),
    title: '',
    description: '',
    items: [{ name: '', quantity: 0, unit: '' }],
    vendors: [],
    budget: 0,
    deadline: '',
  })

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setRfqData({ ...rfqData, [name]: value })
  }

  const handleItemsChange = (e, index) => {
    const { name, value } = e.target
    const items = [...rfqData.items]
    items[index][name] = value
    setRfqData({ ...rfqData, items })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!accessToken) {
        console.error('No authentication token found.')
        setToastMessage('Authentication error. Please log in again.')
        setToastColor('danger')
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 5000)
        setLoading(false)
        return
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      console.log('Sending request with headers:', headers)

      await axios.post(RFQ_API_URL, rfqData, { headers })

      setToastMessage('RFQ created successfully!')
      setToastColor('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 5000)

      setRfqData({
        rfqNumber: '',
        title: '',
        description: '',
        items: [{ name: '', quantity: 0, unit: '' }],
        vendors: [],
        budget: 0,
        deadline: '',
      })
    } catch (error) {
      console.error('Error creating RFQ:', error.response?.data || error.message)
      setToastMessage(error.response?.data?.message || 'Error creating RFQ')
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
              name="rfqNumber"
              value={rfqData.rfqNumber}
              onChange={handleChange}
              placeholder="RFQ Number"
              label="RFQ Number"
              required
            />
          </CCol>

          <CCol md={6}>
            <CFormInput
              type="text"
              name="title"
              value={rfqData.title}
              onChange={handleChange}
              placeholder="Title"
              label="Title"
              required
            />
          </CCol>
        </CRow>

        <CFormTextarea
          name="description"
          value={rfqData.description}
          onChange={handleChange}
          placeholder="Description"
          label="Description"
          required
          rows={3}
        />

        {rfqData.items.map((item, index) => (
          <CRow key={index} className="mb-3">
            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>Item Name</CInputGroupText>
                <CFormInput
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleItemsChange(e, index)}
                  placeholder="Item Name"
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>Quantity</CInputGroupText>
                <CFormInput
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemsChange(e, index)}
                  placeholder="Quantity"
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>Unit</CInputGroupText>
                <CFormInput
                  type="text"
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleItemsChange(e, index)}
                  placeholder="Unit"
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>
        ))}

        <CButton
          color="primary"
          type="button"
          onClick={() =>
            setRfqData({
              ...rfqData,
              items: [...rfqData.items, { name: '', quantity: 0, unit: '' }],
            })
          }
          className="mb-3"
        >
          Add Item
        </CButton>

        <CRow className="mb-3">
          <CCol md={6}>
            <CInputGroup>
              <CInputGroupText>Budget</CInputGroupText>
              <CFormInput
                type="number"
                name="budget"
                value={rfqData.budget}
                onChange={handleChange}
                placeholder="Budget"
                required
              />
            </CInputGroup>
          </CCol>

          <CCol md={6}>
            <CInputGroup>
              <CInputGroupText>Deadline</CInputGroupText>
              <CFormInput
                type="date"
                name="deadline"
                value={rfqData.deadline}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
        </CRow>

        <CButton color="success" type="submit" disabled={loading}>
          {loading ? <CSpinner size="sm" /> : 'Create RFQ'}
        </CButton>
      </CForm>

      {toastVisible && (
        <CToaster
          position="top-center"
          className="position-fixed top-0 start-50 translate-middle-x zindex-9999"
        >
          <CToast color={toastColor} visible={toastVisible}>
            <CToastHeader>
              {toastColor === 'success' ? 'Success' : 'Error'}
              <CButton color="close" onClick={() => setToastVisible(false)} className="ms-auto" />
            </CToastHeader>
            <CToastBody>{toastMessage}</CToastBody>
          </CToast>
        </CToaster>
      )}
    </>
  )
}

export default CreateRFQ
