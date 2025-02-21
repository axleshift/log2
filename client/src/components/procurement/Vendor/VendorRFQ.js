import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import SubmitQuoteModal from '../../Modal/SubmitModal.js'

const API_BASE_URL = import.meta.env.VITE_API_URL

const VendorRFQ = () => {
  const { rfqId } = useParams()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [vendorId, setVendorId] = useState(null) // Assume this comes from auth context

  useEffect(() => {
    const fetchRFQ = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/rfq/${rfqId}`)
        setRFQ(response.data)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch RFQ details.')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQ()
  }, [rfqId])

  if (loading) return <CSpinner color="primary" />
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CCard>
      <CCardHeader>
        <h5>RFQ Details - {rfq.procurementId?.title}</h5>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Product Name</CTableHeaderCell>
              <CTableHeaderCell>Specifications</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfq.products.map((product, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{product.name}</CTableDataCell>
                <CTableDataCell>{product.specs}</CTableDataCell>
                <CTableDataCell>{product.quantity}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {rfq.status === 'Open' && (
          <CButton color="primary" onClick={() => setShowModal(true)}>
            Submit Quote
          </CButton>
        )}
      </CCardBody>

      {showModal && (
        <SubmitQuoteModal
          rfqId={rfq._id}
          vendorId={vendorId}
          products={rfq.products}
          onClose={() => setShowModal(false)}
          onSuccess={(updatedRFQ) => setRFQ(updatedRFQ)}
        />
      )}
    </CCard>
  )
}

export default VendorRFQ
