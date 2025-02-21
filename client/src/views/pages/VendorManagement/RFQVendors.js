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
  CSpinner,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import SubmitQuoteModal from '../../../components/Modal/SubmitModal.js'

const API_BASE_URL = import.meta.env.VITE_API_URL
const RFQ_API_URL = `${API_BASE_URL}/api/v1/rfq`

const VendorRFQ = () => {
  const { id } = useParams()
  const [rfq, setRFQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [vendorId, setVendorId] = useState(null)

  useEffect(() => {
    console.log('Extracted RFQ ID:', id)

    if (!id) {
      setError('Invalid RFQ ID.')
      setLoading(false)
      return
    }

    const fetchRFQ = async () => {
      try {
        console.log(`Fetching RFQ from: ${RFQ_API_URL}/${id}`)

        const token = localStorage.getItem('token')
        const loggedInVendorId = localStorage.getItem('vendorId')

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const response = await axios.get(`${RFQ_API_URL}/${id}`, { headers })

        console.log('RFQ Response Data:', response.data) // <== Add this

        if (!response.data) {
          console.warn('No RFQ found in response')
          setError('RFQ not found.')
          return
        }

        setRFQ(response.data)

        // Debug invited vendors
        console.log('Invited Vendors:', response.data.invitedVendors)

        // Check vendor invitation
        const foundVendor = response.data.invitedVendors.find(
          (vendor) => vendor._id.toString() === loggedInVendorId,
        )
        if (foundVendor) {
          setVendorId(foundVendor._id)
          console.log('Vendor is invited:', foundVendor._id)
        } else {
          console.warn('Vendor is not invited to this RFQ.')
          setError('You are not authorized to view this RFQ.')
        }
      } catch (error) {
        console.error('Error fetching RFQ:', error.response)
        setError(error.response?.data?.message || 'Failed to fetch RFQ details.')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQ()
  }, [id])

  if (loading) return <CSpinner color="primary" />
  if (error) return <CAlert color="danger">{error}</CAlert>
  if (!rfq) return <CAlert color="warning">RFQ not found.</CAlert>

  return (
    <CCard>
      <CCardHeader>
        <h5>RFQ Details - {rfq.procurementId?.title || 'N/A'}</h5>
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
            {rfq?.products?.length > 0 ? (
              rfq.products.map((product, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{product.name || 'No name'}</CTableDataCell>
                  <CTableDataCell>{product.specs || 'No specs'}</CTableDataCell>
                  <CTableDataCell>{product.quantity || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="3">No products listed</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {rfq.status === 'Open' && vendorId && (
          <CButton color="primary" onClick={() => setShowModal(true)}>
            Submit Quote
          </CButton>
        )}
      </CCardBody>

      {showModal && vendorId && (
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
