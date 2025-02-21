import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import axios from 'axios'

const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurement`

const ProcurementDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [procurement, setProcurement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <CSpinner color="primary" />
  if (error) return <div>{error}</div>
  if (!procurement) return <div>No Procurement found.</div>

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
          <strong>Description:</strong> {procurement.description || 'No description available'}
        </h6>
        <h6>
          <strong>Status:</strong>
          <CBadge
            color={
              procurement.status === 'Pending'
                ? 'warning'
                : procurement.status === 'Approved'
                  ? 'success'
                  : procurement.status === 'Rejected'
                    ? 'danger'
                    : 'primary'
            }
          >
            {procurement.status}
          </CBadge>
        </h6>

        <h6>
          <strong>Created By:</strong> {procurement.createdBy?.email || 'Unknown'}
        </h6>
        <h6>
          <strong>Procurement Date:</strong>{' '}
          {new Date(procurement.procurementDate).toLocaleDateString()}
        </h6>
        <h6>
          <strong>RFQ Required:</strong> {procurement.rfqRequired ? 'Yes' : 'No'}
        </h6>

        {procurement.rfqId && (
          <h6>
            <strong>RFQ:</strong>{' '}
            <a href={`/rfq/${procurement.rfqId._id}`}>{procurement.rfqId.title}</a>
          </h6>
        )}

        <hr />

        {/* Purchase Orders Table */}
        <h6>
          <strong>Purchase Orders</strong>
        </h6>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>PO ID</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {procurement.purchaseOrders.length > 0 ? (
              procurement.purchaseOrders.map((po, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{po._id}</CTableDataCell>
                  <CTableDataCell>{po.status}</CTableDataCell>
                  <CTableDataCell>${po.amount || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{new Date(po.createdAt).toLocaleDateString()}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4">No purchase orders created yet.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default ProcurementDetails
