import React, { useEffect, useState } from 'react'
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

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const RFQList = () => {
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const response = await axios.get(RFQ_API_URL)
        console.log('Full API Response:', response.data)

        if (Array.isArray(response.data)) {
          setRfqs(response.data)
        } else if (Array.isArray(response.data.rfqs)) {
          setRfqs(response.data.rfqs)
        } else {
          setRfqs([])
          setError('Unexpected API response format')
        }
      } catch (err) {
        console.error('Error fetching RFQs:', err)
        setError(err.response?.data?.message || 'Failed to fetch RFQs')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQs()
  }, [])

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
                    <CButton color="primary" href={`/rfq/${rfq._id}`} size="sm">
                      View
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
