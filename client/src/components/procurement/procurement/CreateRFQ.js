import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import axios from 'axios'

const CreateRFQ = () => {
  const { id } = useParams()
  const [rfqData, setRfqData] = useState({
    title: '',
    description: '',
    department: '',
    deadline: '',
    budget: '',
    evaluationCriteria: '',
    procurementId: id,
    products: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: '' })

  useEffect(() => {
    const fetchProcurement = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/procurement/${id}`)
        setRfqData((prev) => ({
          ...prev,
          title: `RFQ for ${response.data.title}`,
          department: response.data.department,
          products: response.data.products.map((product) => ({
            ...product,
            unitPrice: product.unitPrice || '',
          })),
        }))
      } catch (err) {
        setError('Failed to load procurement details.')
      }
    }
    fetchProcurement()
  }, [id])

  const handleChange = (e) => {
    setRfqData({ ...rfqData, [e.target.name]: e.target.value })
  }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    setRfqData((prev) => {
      const updatedProducts = prev.products.map((product, idx) =>
        idx === index ? { ...product, [name]: value } : product,
      )
      return { ...prev, products: updatedProducts }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...rfqData,
        budget: Number(rfqData.budget) || 0,
        products: rfqData.products.map((product) => ({
          ...product,
          unitPrice: Number(product.unitPrice) || 0,
        })),
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/rfq/create`, payload)
      setToast({ visible: true, message: 'RFQ successfully created!', type: 'success' })

      // Reset form after submission
      setTimeout(() => setToast({ visible: false, message: '', type: '' }), 3000)
    } catch (err) {
      setToast({ visible: true, message: 'Failed to create RFQ.', type: 'danger' })
      setTimeout(() => setToast({ visible: false, message: '', type: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      <CToaster>
        {toast.visible && (
          <CToast autohide={true} delay={3000} visible={toast.visible} color={toast.type}>
            <CToastHeader closeButton>
              {toast.type === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <CCard>
        <CCardHeader>Create RFQ</CCardHeader>
        <CCardBody>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              label="Title"
              name="title"
              value={rfqData.title}
              onChange={handleChange}
              required
            />
            <CFormTextarea
              label="Description"
              name="description"
              value={rfqData.description}
              onChange={handleChange}
            />
            <CFormInput label="Department" value={rfqData.department} disabled />
            <CFormInput
              type="date"
              label="Deadline"
              name="deadline"
              value={rfqData.deadline}
              onChange={handleChange}
              required
            />
            <CFormInput
              type="number"
              label="Budget"
              name="budget"
              value={rfqData.budget}
              onChange={handleChange}
            />
            <CFormSelect
              label="Evaluation Criteria"
              name="evaluationCriteria"
              value={rfqData.evaluationCriteria}
              onChange={handleChange}
            >
              <option value="">Select Criteria</option>
              <option value="Lowest Price">Lowest Price</option>
              <option value="Best Value">Best Value</option>
              <option value="Technical Compliance">Technical Compliance</option>
            </CFormSelect>

            {/* Product List */}
            {rfqData.products.length > 0 && (
              <>
                <h5>Products</h5>
                <CTable striped bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Product Name</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Unit</CTableHeaderCell>
                      <CTableHeaderCell>Unit Price</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {rfqData.products.map((product, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>{product.quantity}</CTableDataCell>
                        <CTableDataCell>{product.unit}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            name="unitPrice"
                            value={product.unitPrice}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </>
            )}

            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Create RFQ'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateRFQ
