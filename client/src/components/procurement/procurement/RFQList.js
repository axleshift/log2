import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
  CSpinner,
  CAlert,
  CButton,
} from '@coreui/react'

const RFQList = () => {
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/rfq`)

        if (response.data && Array.isArray(response.data.rfqs)) {
          setRfqs(response.data.rfqs)
        } else if (Array.isArray(response.data)) {
          setRfqs(response.data)
        } else {
          setError('Unexpected API response format')
          setRfqs([])
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch RFQs')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RFQ?')) return

    setDeletingId(id)
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/rfq/${id}`)
      setRfqs(rfqs.filter((rfq) => rfq._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete RFQ')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <CContainer className="mt-4">
      <h2 className="mb-4">RFQ List</h2>

      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}

      {!loading && !error && (
        <CTable hover responsive striped borderColor="secondary">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>RFQ ID</CTableHeaderCell>
              <CTableHeaderCell>Procurement</CTableHeaderCell>
              <CTableHeaderCell>Deadline</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfqs.length > 0 ? (
              rfqs.map((rfq) => (
                <CTableRow key={rfq._id}>
                  <CTableDataCell>{rfq._id}</CTableDataCell>
                  <CTableDataCell>{rfq.procurementId?.title || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'No Deadline'}
                  </CTableDataCell>
                  <CTableDataCell>{rfq.status || 'Pending'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/procurement/rfq/${rfq._id}`)}
                    >
                      View
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(rfq._id)}
                      disabled={deletingId === rfq._id}
                    >
                      {deletingId === rfq._id ? 'Deleting...' : 'Delete'}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  No RFQs found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      )}
    </CContainer>
  )
}

export default RFQList
