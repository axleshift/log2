import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'

const API_URL = 'https://backend-finance.axleshift.com/api/budgetRequest'

const BudgetRequestPage = () => {
  const [requests, setRequests] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', color: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [formData, setFormData] = useState({
    department: '',
    typeOfRequest: '',
    category: '',
    reason: '',
    totalRequest: '',
    documents: '',
    status: 'Pending',
    comment: '',
  })

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL)
      setRequests(res.data || [])
    } catch (err) {
      console.error('Failed to fetch budget requests', err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      department: '',
      typeOfRequest: '',
      category: '',
      reason: '',
      totalRequest: '',
      documents: '',
      status: 'Pending',
      comment: '',
    })
  }

  const showToast = (message, color) => {
    setToast({ show: true, message, color })
    setTimeout(() => setToast({ show: false, message: '', color: '' }), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(API_URL, {
        ...formData,
        totalRequest: parseFloat(formData.totalRequest),
      })
      showToast('Budget request submitted!', 'success')
      resetForm()
      setModalVisible(false)
      fetchRequests()
    } catch (err) {
      console.error('Error creating budget request:', err)
      showToast('Error submitting request', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(requests.length / itemsPerPage)
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Budget Requests</h4>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          + New Budget Request
        </CButton>
      </div>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Request ID</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentRequests.map((req, index) => (
            <CTableRow key={req._id}>
              <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
              <CTableDataCell>{req.requestId || '—'}</CTableDataCell>
              <CTableDataCell>{req.department}</CTableDataCell>
              <CTableDataCell>{req.category}</CTableDataCell>
              <CTableDataCell>${req.totalRequest}</CTableDataCell>
              <CTableDataCell>{req.status}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {Math.ceil(requests.length / itemsPerPage)}
        </span>
        <div>
          <CButton
            color="secondary"
            className="me-2"
            size="sm"
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            ← Prev
          </CButton>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => handlePageChange('next')}
            disabled={currentPage >= Math.ceil(requests.length / itemsPerPage)}
          >
            Next →
          </CButton>
        </div>
      </div>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>New Budget Request</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Type of Request"
                  name="typeOfRequest"
                  value={formData.typeOfRequest}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Total Request Amount"
                  name="totalRequest"
                  value={formData.totalRequest}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormTextarea
                  label="Reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Document Name"
                  name="documents"
                  value={formData.documents}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <div className="text-end">
              <CButton type="submit" color="success" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Submit'}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      <CToaster placement="top-end">
        {toast.show && (
          <CToast color={toast.color} visible={true}>
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </>
  )
}

export default BudgetRequestPage
