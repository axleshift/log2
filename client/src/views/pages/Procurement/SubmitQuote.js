import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../components/Toast/Toast.js'

const BuyerRFQDetails = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchRFQDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/rfq/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setRFQ(response.data)
      } catch (err) {
        setError('Failed to load RFQ details.')
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchRFQDetails()
    }
  }, [id, accessToken])

  const handleQuoteStatus = async (quoteId, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/rfq/${id}/quotes/${quoteId}`,
        { status },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      setRFQ((prev) => ({
        ...prev,
        quotes: prev.quotes.map((q) => (q._id === quoteId ? { ...q, status } : q)),
      }))

      showToast(`Quote ${status.toLowerCase()} successfully!`, 'success')
    } catch (err) {
      showToast('Failed to update quote status.', 'error')
    }
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">RFQ Details</CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        ) : rfq ? (
          <>
            <h6>
              <strong>Submitted Quotes</strong>
            </h6>
            <CTable hover responsive className="text-center">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Total Price</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Lead Time</CTableHeaderCell>
                  <CTableHeaderCell>Terms</CTableHeaderCell>
                  <CTableHeaderCell>Valid Until</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rfq.quotes.length > 0 ? (
                  rfq.quotes.map((q, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{q.totalPrice}</CTableDataCell>
                      <CTableDataCell>{q.quantity}</CTableDataCell>
                      <CTableDataCell>{q.leadTime}</CTableDataCell>
                      <CTableDataCell>{q.terms || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            q.status === 'Approved'
                              ? 'success'
                              : q.status === 'Rejected'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {q.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {q.status === 'Pending' && (
                          <>
                            <CButton
                              color="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleQuoteStatus(q._id, 'Approved')}
                            >
                              Approve
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleQuoteStatus(q._id, 'Rejected')}
                            >
                              Reject
                            </CButton>
                          </>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7">No quotes submitted yet.</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </>
        ) : (
          <CAlert color="warning" className="text-center">
            RFQ not found.
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  )
}

export default BuyerRFQDetails
