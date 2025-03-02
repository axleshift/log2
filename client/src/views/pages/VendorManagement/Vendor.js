import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import { apiService } from '../../../api/api.js'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react'

const VendorRFQs = () => {
  const { accessToken } = useAuth()
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVendorRFQs = async () => {
      try {
        const response = await apiService.get('/api/v1/rfq/vendor/rfqs', null, {
          Authorization: `Bearer ${accessToken}`,
        })
        setRfqs(response.data)
      } catch (err) {
        console.error('Failed to fetch RFQs:', err)
        setError(err.response?.data?.message || 'Failed to load RFQs.')
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchVendorRFQs()
    }
  }, [accessToken])

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">Your RFQs</CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        ) : rfqs.length === 0 ? (
          <CAlert color="warning" className="text-center">
            No RFQs available.
          </CAlert>
        ) : (
          <CTable striped hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Due Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfqs.map((rfq, index) => (
                <CTableRow key={rfq._id}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{rfq.procurementId?.title || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/vendor/rfqs/${rfq._id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default VendorRFQs
