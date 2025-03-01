import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import {
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'
import ProcurementInput from './ProcurementInput'

const API_URL = import.meta.env.VITE_API_URL
const PROCUREMENT_API_URL = `${API_URL}/api/v1/procurement`

const CreateProcurement = () => {
  const { accessToken } = useAuth()
  const [procurementData, setProcurementData] = useState({
    title: '',
    description: '',
    procurementDate: '',
    status: 'Pending',
    deliveryDate: '',
    department: '',
    products: [{ name: '', quantity: 0, unit: '', unitPrice: 0 }],
    estimatedCost: 0,
  })

  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState('PHP')

  const currencyOptions = ['PHP', 'USD', 'EUR', 'GBP', 'JPY']

  const handleChange = (e) => {
    const { name, value } = e.target
    setProcurementData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    const updatedProducts = [...procurementData.products]

    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]:
        name === 'quantity' || name === 'unitPrice'
          ? value === ''
            ? ''
            : parseFloat(value)
          : value,
    }

    const estimatedCost = updatedProducts.reduce(
      (total, product) => total + (product.unitPrice || 0) * (product.quantity || 0),
      0,
    )

    setProcurementData((prev) => ({
      ...prev,
      products: updatedProducts,
      estimatedCost: parseFloat(estimatedCost.toFixed(2)),
    }))
  }

  const addProduct = () => {
    setProcurementData((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 0, unit: '', unitPrice: 0 }],
    }))
  }

  const removeProduct = (index) => {
    const updatedProducts = procurementData.products.filter((_, i) => i !== index)
    setProcurementData((prev) => ({
      ...prev,
      products: updatedProducts,
      estimatedCost: updatedProducts.reduce(
        (total, product) => total + (product.unitPrice * product.quantity || 0),
        0,
      ),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      if (!accessToken) throw new Error('Authentication error. Please log in again.')
      const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }

      const procurementPayload = {
        ...procurementData,
        deliveryDate: procurementData.deliveryDate
          ? new Date(procurementData.deliveryDate).toISOString()
          : null,
      }

      await axios.post(PROCUREMENT_API_URL, procurementPayload, { headers })

      // Reset form
      setProcurementData({
        title: '',
        description: '',
        procurementDate: '',
        status: 'Pending',
        deliveryDate: '',
        department: '',
        products: [{ name: '', quantity: 0, unit: '', unitPrice: 0 }],
        estimatedCost: 0,
      })

      showToast('✅ Procurement Request created successfully! Wait for Approval', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || '🚨 Failed to create procurement.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, color) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 5000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CRow className="mb-3">
        <CCol md={6}>
          <ProcurementInput
            label="Title"
            name="title"
            value={procurementData.title}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={6}>
          <ProcurementInput
            label="Procurement Date"
            type="date"
            name="procurementDate"
            value={procurementData.procurementDate}
            onChange={handleChange}
            required
          />
        </CCol>
      </CRow>
      <ProcurementInput
        label="Description"
        type="textarea"
        name="description"
        value={procurementData.description}
        onChange={handleChange}
        required
        rows={3}
      />
      <CRow className="mb-3">
        <CCol md={6}>
          <ProcurementInput
            label="Expected Delivery Date"
            type="date"
            name="deliveryDate"
            value={procurementData.deliveryDate}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <ProcurementInput
            label="Department"
            type="select"
            name="department"
            value={procurementData.department}
            onChange={handleChange}
            options={['HR', 'Finance', 'Logistics', 'IT', 'Procurement', 'Operations']}
            required
          />
        </CCol>
      </CRow>

      <h5>Products</h5>
      {procurementData.products.map((product, index) => (
        <CRow key={index} className="mb-2">
          <CCol md={2}>
            <ProcurementInput
              label="Product Name"
              name="name"
              value={product.name}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
          </CCol>
          <CCol md={2}>
            <ProcurementInput
              label="Quantity"
              type="number"
              name="quantity"
              value={product.quantity}
              min="0"
              onChange={(e) => handleProductChange(index, e)}
              required
            />
          </CCol>
          <CCol md={2}>
            <ProcurementInput
              label="Unit"
              type="select"
              name="unit"
              value={product.unit}
              onChange={(e) => handleProductChange(index, e)}
              options={['KG', 'L', 'M', 'PCS', 'BOX', 'PACK']}
              required
            />
          </CCol>
          <CCol md={2}>
            <ProcurementInput
              label="Unit Price"
              type="number"
              name="unitPrice"
              value={product.unitPrice}
              min="0"
              onChange={(e) => handleProductChange(index, e)}
              required
            />
          </CCol>
          <CRow className="mt-3">
            <CCol md={6}>
              <label htmlFor="currency">Select Currency:</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-control"
              >
                {currencyOptions.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </CCol>
          </CRow>

          <CRow className="mt-3 text-end">
            <CCol>
              <h5>
                Estimated Cost: {currency} {procurementData.estimatedCost.toFixed(2)}
              </h5>
            </CCol>
          </CRow>
          <CCol md={2}>
            <CButton color="danger" onClick={() => removeProduct(index)}>
              Remove
            </CButton>
          </CCol>
        </CRow>
      ))}

      <CRow className="mt-3">
        <CCol md={6}>
          <CButton color="primary" onClick={addProduct}>
            Add Product
          </CButton>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol md={12} className="text-center">
          <CButton color="success" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Create Procurement'}
          </CButton>
        </CCol>
      </CRow>
      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} autohide={true} visible={true} color={toast.color}>
            <CToastHeader closeButton>
              {toast.color === 'success' ? '✅ Success' : '🚨 Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </form>
  )
}

export default CreateProcurement
