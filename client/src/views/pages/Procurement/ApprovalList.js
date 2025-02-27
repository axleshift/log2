import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
import { useAuth } from '../../../context/AuthContext'

const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurement`

const ApprovalList = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const response = await axios.get(`${PROCUREMENT_API_URL}?status=Pending`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setProcurements(response.data)
      } catch (err) {
        console.error('Error fetching procurements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProcurements()
  }, [accessToken])

  const handleApprove = async (id) => {
    try {
      setUpdating(true)
      await axios.patch(
        `${PROCUREMENT_API_URL}/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      setProcurements(procurements.filter((p) => p._id !== id))
    } catch (err) {
      alert('Failed to approve procurement')
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
      await axios.patch(
        `${PROCUREMENT_API_URL}/${selectedId}/reject`,
        { rejectionReason },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )

      setProcurements(procurements.filter((p) => p._id !== selectedId))

      setRejectModal(false)
      setRejectReason('')
    } catch (err) {
      console.error('Failed to reject procurement:', err)
      alert('Failed to reject procurement')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <CSpinner color="primary" />

  return (
    <CCard>
      <CCardHeader>
        <h5>Approval List</h5>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Department</CTableHeaderCell>
              <CTableHeaderCell>Requested By</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {procurements.length > 0 ? (
              procurements.map((p) => (
                <CTableRow key={p._id}>
                  <CTableDataCell>{p.title}</CTableDataCell>
                  <CTableDataCell>{p.department}</CTableDataCell>
                  <CTableDataCell>{p.requestedBy?.email || 'Unknown'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="success"
                      className="me-2"
                      onClick={() => handleApprove(p._id)}
                      disabled={updating}
                    >
                      {updating ? <CSpinner size="sm" /> : 'Approve'}
                    </CButton>
                    <CButton
                      color="danger"
                      onClick={() => {
                        setSelectedId(p._id)
                        setRejectModal(true)
                      }}
                    >
                      Reject
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No pending Procurement Request.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
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
    </CCard>
  )
}

export default ApprovalList
