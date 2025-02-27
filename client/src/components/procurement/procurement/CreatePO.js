import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CButton, CForm, CFormInput, CSpinner } from '@coreui/react'
import axios from 'axios'

const CreatePO = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poData, setPoData] = useState({
    amount: '',
    vendor: '',
    procurementId: id,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {}, [id])

  const handleChange = (e) => {
    setPoData({ ...poData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/purchaseOrder`, poData)
      navigate(`/procurement/${id}`)
    } catch (err) {
      setError('Failed to create Purchase Order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>Create Purchase Order</CCardHeader>
      <CCardBody>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            label="Vendor ID"
            name="vendor"
            value={poData.vendor}
            onChange={handleChange}
            required
          />
          <CFormInput
            label="Amount"
            name="amount"
            type="number"
            value={poData.amount}
            onChange={handleChange}
            required
          />
          <CButton color="success" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Create Purchase Order'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default CreatePO
