import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'

const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurement`

const ProcurementDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [procurement, setProcurement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchProcurement = async () => {
      if (!id) {
        setError('Invalid Procurement ID')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const response = await axios.get(`${PROCUREMENT_API_URL}/${id}`)
        setProcurement(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load Procurement')
      } finally {
        setLoading(false)
      }
    }
    fetchProcurement()
  }, [id])

  const handleApprove = async () => {
    try {
      setUpdating(true)
      await axios.patch(`${PROCUREMENT_API_URL}/${id}/approve`)
      setProcurement((prev) => ({ ...prev, status: 'Approved' }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve procurement')
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason.')
      return
    }
    try {
      setUpdating(true)
      await axios.patch(`${PROCUREMENT_API_URL}/${id}/reject`, { reason: rejectReason })
      setProcurement((prev) => ({ ...prev, status: 'Rejected' }))
      setRejectModal(false)
      setRejectReason('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject procurement')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <CSpinner color="primary" />
  if (error) return <div>{error}</div>
  if (!procurement) return <div>No Procurement found.</div>

  const isApprover = user?.role === 'super admin' || user?.role === 'admin'

  return (
    <CCard>
      <CCardHeader>
        <h5>Procurement Details</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>
          Back to Procurement List
        </CButton>
      </CCardHeader>
      <CCardBody>
        <h6>
          <strong>Procurement ID:</strong> {procurement._id}
        </h6>
        <h6>
          <strong>Title:</strong> {procurement.title}
        </h6>
        <h6>
          <strong>Department:</strong> {procurement.department}
        </h6>
        <h6>
          <strong>Status:</strong>{' '}
          <CBadge
            color={
              procurement.status === 'Pending'
                ? 'warning'
                : procurement.status === 'Approved'
                  ? 'success'
                  : 'danger'
            }
          >
            {procurement.status}
          </CBadge>
        </h6>
        <h6>
          <strong>Requested By:</strong> {procurement.requestedBy?.email || 'Unknown'}
        </h6>
        <h6>
          <strong>Procurement Date:</strong>{' '}
          {new Date(procurement.procurementDate).toLocaleDateString()}
        </h6>
        <h6>
          <strong>Delivery Date:</strong> {new Date(procurement.deliveryDate).toLocaleDateString()}
        </h6>
        <hr />

        {/* Products Table */}
        <h6>
          <strong>Products</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Unit</CTableHeaderCell>
              <CTableHeaderCell>Unit Price</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {procurement.products?.length > 0 ? (
              procurement.products.map((product, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{product.name}</CTableDataCell>
                  <CTableDataCell>{product.quantity}</CTableDataCell>
                  <CTableDataCell>{product.unit}</CTableDataCell>
                  <CTableDataCell>${product.unitPrice?.toFixed(2) || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No products added yet.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        <hr />

        {/* Approval Buttons */}
        {isApprover && procurement.status === 'Pending' && (
          <>
            <CButton color="success" className="me-2" onClick={handleApprove} disabled={updating}>
              {updating ? <CSpinner size="sm" /> : 'Approve'}
            </CButton>
            <CButton color="danger" onClick={() => setRejectModal(true)} disabled={updating}>
              {updating ? <CSpinner size="sm" /> : 'Reject'}
            </CButton>
          </>
        )}

        {/* Reject Modal */}
        <CModal visible={rejectModal} onClose={() => setRejectModal(false)}>
          <CModalHeader>Reject Procurement</CModalHeader>
          <CModalBody>
            <CFormTextarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setRejectModal(false)}>
              Cancel
            </CButton>
            <CButton color="danger" onClick={handleReject}>
              Confirm Reject
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default ProcurementDetails
