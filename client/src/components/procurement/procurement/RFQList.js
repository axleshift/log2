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
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { cilSearch, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

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
      <CCard>
        <CCardHeader className="bg-primary text-white">
          <h4 className="mb-0">Request for Quotation (RFQ) List</h4>
        </CCardHeader>
        <CCardBody>
          {loading && <CSpinner color="primary" className="d-block mx-auto my-3" />}
          {error && <CAlert color="danger">{error}</CAlert>}

          {!loading && !error && (
            <CTable hover responsive bordered borderColor="secondary">
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>RFQ ID</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Deadline</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
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
                      <CTableDataCell>
                        <CBadge color={rfq.status === 'Approved' ? 'success' : 'warning'}>
                          {rfq.status || 'Pending'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/procurement/rfq/${rfq._id}`)}
                        >
                          <CIcon icon={cilSearch} className="me-1" />
                          View
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(rfq._id)}
                          disabled={deletingId === rfq._id}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
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
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default RFQList
