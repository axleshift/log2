import React from 'react'
import { useState, useEffect } from 'react'
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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const RFQList = () => {
  const navigate = useNavigate()
  const [rfqs, setRFQs] = useState([])

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        console.log('Fetching RFQs from:', RFQ_API_URL)
        const response = await axios.get(RFQ_API_URL)
        console.log('RFQs fetched successfully:', response.data)
        setRFQs(response.data)
      } catch (error) {
        console.error('Error fetching RFQs:', error.response ? error.response.data : error.message)
      }
    }

    fetchRFQs()
  }, [])

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Requests for Quotation (RFQs)</h5>
        <CButton color="primary" onClick={() => navigate('/rfqs/create')}>
          Create RFQ
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>RFQ Number</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Items</CTableHeaderCell>
              <CTableHeaderCell>Vendors</CTableHeaderCell>
              <CTableHeaderCell>Quotes</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfqs.map((rfq) => (
              <CTableRow key={rfq._id}>
                <CTableDataCell>{rfq.rfqNumber}</CTableDataCell>
                <CTableDataCell>{rfq.title}</CTableDataCell>
                <CTableDataCell>{rfq.description}</CTableDataCell>
                <CTableDataCell>
                  {rfq.items?.length || 0} item{rfq.items?.length !== 1 ? 's' : ''}
                </CTableDataCell>
                <CTableDataCell>
                  {rfq.vendors?.length || 0} vendor{rfq.vendors?.length !== 1 ? 's' : ''}
                </CTableDataCell>
                <CTableDataCell>
                  {rfq.quotes?.length || 0} quote{rfq.quotes?.length !== 1 ? 's' : ''}
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      rfq.status === 'Open'
                        ? 'success'
                        : rfq.status === 'Awarded'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {rfq.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {rfq.createdAt ? new Date(rfq.createdAt).toLocaleDateString() : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => navigate(`/procurement/rfqs/${rfq._id}`)}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default RFQList
