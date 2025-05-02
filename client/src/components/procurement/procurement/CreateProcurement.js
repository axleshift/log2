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
  CModalFooter,
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
  const [filters, setFilters] = useState({ title: '', department: '', status: '' })

  const fetchProcurements = async () => {
    if (!accessToken) return

    try {
      const params = new URLSearchParams()
      if (filters.title) params.append('title', filters.title)
      if (filters.department) params.append('department', filters.department)
      if (filters.status) params.append('status', filters.status)

      const res = await axios.get(`${PROCUREMENT_API_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProcurements(res.data)
    } catch (err) {
      console.error('Error fetching procurements:', err)
    }
  }

  useEffect(() => {
    fetchProcurements()
  }, [accessToken, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
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

  const showToast = (message, color) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, color }])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 5000)
  }

  return (
    <>
      <CButton color="primary" onClick={() => setModalVisible(true)} className="mb-3">
        + Create Procurement
      </CButton>

      {/* FILTERS */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            placeholder="Filter by Title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Logistics">Logistics</option>
            <option value="IT">IT</option>
            <option value="Procurement">Procurement</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* PROCUREMENT LIST */}
      <CCard>
        <CCardBody>
          <h5>Procurement Requests</h5>
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
              {procurements.map((proc) => (
                <CTableRow key={proc._id}>
                  <CTableDataCell>{proc.title}</CTableDataCell>
                  <CTableDataCell>{proc.department}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={proc.status === 'Approved' ? 'success' : 'warning'}>
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
                    </CButton>
                    {proc.status === 'Approved' && (
                      <>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => navigate(`/rfq/create/${proc._id}`)}
                        >
                          Create RFQ
                        </CButton>
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() => navigate('/procurement/po-payments')}
                        >
                          Create PO
                        </CButton>
                      </>
                    )}
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
