import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const VendorRFQDetails = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()
  const [rfq, setRfq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRFQDetails = async () => {
      try {
        const response = await axios.get(`${RFQ_API_URL}/vendor/rfqs/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        setRfq(response.data.rfq)
        console.log('RFQ Details:', response.data.rfq)
      } catch (err) {
        console.error('Failed to fetch RFQ details:', err)
        setError(err.response?.data?.message || 'Failed to load RFQ details.')
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchRFQDetails()
    }
  }, [id, accessToken])

  if (loading) {
    return (
      <div className="text-center my-3">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <CAlert color="danger" className="text-center">
        {error}
      </CAlert>
    )
  }

  if (!rfq) {
    return (
      <CAlert color="warning" className="text-center">
        RFQ not found.
      </CAlert>
    )
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">
        RFQ Details - {rfq.procurementId?.title || 'Untitled'}
      </CCardHeader>
      <CCardBody>
        <p>
          <strong>RFQ Number:</strong> {rfq.rfqNumber}
        </p>
        <p>
          <strong>Deadline:</strong>{' '}
          {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'N/A'}
        </p>
        <p>
          <strong>Status:</strong> {rfq.status}
        </p>

        <h5 className="mt-4">Products / Services</h5>
        <CTable striped hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Product / Service</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Unit</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfq.products?.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.description}</CTableDataCell>
                <CTableDataCell>{item.quantity}</CTableDataCell>
                <CTableDataCell>{item.unit}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default VendorRFQDetails
