import React, { useState, useEffect } from 'react'
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
  CSpinner,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurement`

const ApprovalList = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

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
      setUpdatingId(id)
      await axios.patch(
        `${PROCUREMENT_API_URL}/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      setProcurements((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      alert('Failed to approve procurement')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (id) => {
    try {
      setUpdatingId(id)
      await axios.patch(`${PROCUREMENT_API_URL}/${id}/reject`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProcurements((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      alert('Failed to reject procurement')
      console.error(err)
    } finally {
      setUpdatingId(null)
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
                      color="primary"
                      className="me-2"
                      onClick={() => navigate(`/procurement/${p._id}`)}
                    >
                      View Details
                    </CButton>
                    <CButton
                      color="success"
                      className="me-2"
                      onClick={() => handleApprove(p._id)}
                      disabled={updatingId === p._id}
                    >
                      {updatingId === p._id ? <CSpinner size="sm" /> : 'Approve'}
                    </CButton>
                    <CButton
                      color="danger"
                      disabled={updatingId === p._id}
                      onClick={() => handleReject(p._id)}
                    >
                      {updatingId === p._id ? <CSpinner size="sm" /> : 'Reject'}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No pending Procurement Requests.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default ApprovalList
