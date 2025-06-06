import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import ProcurementInput from './ProcurementInput'

const API_URL = import.meta.env.VITE_API_URL
const PROCUREMENT_API_URL = `${API_URL}/api/v1/procurement`

const CreateProcurement = () => {
  const { accessToken, user } = useAuth()
  const navigate = useNavigate()

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

  const [modalVisible, setModalVisible] = useState(false)

  const [procurements, setProcurements] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredProcurements = procurements.filter((proc) => {
    const matchesSearch =
      proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || proc.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Fetch existing procurements
  useEffect(() => {
    const fetchProcurements = async () => {
      if (!accessToken) return

      try {
        const res = await axios.get(PROCUREMENT_API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setProcurements(res.data)
      } catch (err) {
        console.error('Error fetching procurements:', err)
      }
    }

    fetchProcurements()
  }, [accessToken])

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

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      const procurementPayload = {
        ...procurementData,
        deliveryDate: procurementData.deliveryDate
          ? new Date(procurementData.deliveryDate).toISOString()
          : null,
      }

      const res = await axios.post(PROCUREMENT_API_URL, procurementPayload, { headers })

      setProcurements((prev) => [...prev, res.data])

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

      setModalVisible(false)
      showToast('✅ Procurement Request created successfully!', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || '🚨 Failed to create procurement.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id || !accessToken) return

    try {
      await axios.delete(`${PROCUREMENT_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProcurements((prev) => prev.filter((p) => p._id !== id))

      setToasts((prev) => [
        ...prev,
        { id: Date.now(), color: 'success', message: 'Procurement deleted successfully' },
      ])
    } catch (err) {
      console.error('Error deleting procurement:', err)

      setToasts((prev) => [
        ...prev,
        { id: Date.now(), color: 'danger', message: 'Failed to delete procurement' },
      ])
    }
  }

  const showToast = (message, color) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 5000)
  }

  return (
    <>
      <CButton color="primary" onClick={() => setModalVisible(true)} className="mb-3">
        + Create Procurement
      </CButton>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>Create Procurement Request</CModalHeader>
        <CModalBody>
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
                  options={['HR', 'Finance', 'Logistics', 'IT', 'Procurement']}
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

            <CRow className="mt-3 text-end">
              <CCol>
                <h5>Estimated Cost: {procurementData.estimatedCost.toFixed(2)}</h5>
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol md={12} className="text-center">
                <CButton color="success" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CModalBody>
      </CModal>

      {/** PROCUREMENT LIST  */}

      <CCard>
        <CCardBody>
          <h5>Procurement Requests</h5>

          {/* Filter Inputs */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="Search by title, department or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CTable responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredProcurements.map((proc) => (
                <CTableRow key={proc._id}>
                  <CTableDataCell>{proc.title}</CTableDataCell>
                  <CTableDataCell>{proc.department}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        proc.status === 'Approved'
                          ? 'success'
                          : proc.status === 'Rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {proc.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => navigate(`/procurement/${proc._id}`)}
                    >
                      View
                    </CButton>{' '}
                    {proc.status === 'Approved' && (
                      <>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => navigate(`/rfq/create/${proc._id}`)}
                        >
                          Create RFQ
                        </CButton>{' '}
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() => navigate('/procurement/po-payments')}
                        >
                          Create PO
                        </CButton>
                      </>
                    )}
                    <CButton color="danger" size="sm" onClick={() => handleDelete(proc._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

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
    </>
  )
}

export default CreateProcurement
