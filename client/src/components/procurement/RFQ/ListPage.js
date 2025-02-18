import React, { useState, useEffect } from 'react'
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
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import InviteVendorModal from '../../Modal/InviteModal'

const API_BASE_URL = import.meta.env.VITE_API_URL
const RFQ_API_URL = `${API_BASE_URL}/api/v1/rfq`
const VENDOR_API_URL = `${API_BASE_URL}/api/v1/vendor`

const RFQList = () => {
  const navigate = useNavigate()
  const [rfqs, setRFQs] = useState([])
  const [vendors, setVendors] = useState([])
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [selectedVendor, setSelectedVendor] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const response = await axios.get(RFQ_API_URL)
        setRFQs(response.data)
      } catch (error) {
        console.error('Error fetching RFQs:', error.response?.data || error.message)
      }
    }

    const fetchVendors = async () => {
      try {
        const response = await axios.get(VENDOR_API_URL)
        setVendors(response.data)
      } catch (error) {
        console.error('Error fetching vendors:', error.response?.data || error.message)
      }
    }

    fetchRFQs()
    fetchVendors()
  }, [])

  const handleInvite = async () => {
    if (!selectedRFQ || !selectedVendor) {
      setToast({
        visible: true,
        message: 'Please select a vendor',
        color: 'danger',
      })
      return
    }

    setIsInviting(true)

    try {
      const response = await axios.put(
        `${RFQ_API_URL}/${selectedRFQ}/invite-vendors`,
        { vendors: [selectedVendor] },
        { headers: { 'Content-Type': 'application/json' } },
      )

      const vendor = vendors.find((vendor) => vendor._id === selectedVendor)
      const vendorEmail = vendor?.userId?.email

      if (!vendorEmail) {
        throw new Error('Vendor email not found')
      }

      const rfqResponse = await axios.get(`${RFQ_API_URL}/${selectedRFQ}`)
      const rfqTitle = rfqResponse.data.title
      const rfqId = selectedRFQ

      if (!rfqTitle || !rfqId) {
        throw new Error('Missing required fields: rfqTitle or rfqId.')
      }

      const emailResponse = await axios.post(`${API_BASE_URL}/api/v1/rfq/send-invite-email`, {
        vendorEmail,
        rfqTitle,
        rfqId,
      })

      setToast({
        visible: true,
        message: 'Vendor invited successfully!',
        color: 'success',
      })

      setSelectedRFQ(null)
      setSelectedVendor('')
    } catch (error) {
      setToast({
        visible: true,
        message: `Failed to invite vendor: ${error.response?.data?.message || error.message}`,
        color: 'danger',
      })
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <>
      <CToaster position="top-center">
        {toast.visible && (
          <CToast
            autohide={true}
            color={toast.color}
            onClose={() => setToast({ ...toast, visible: false })}
          >
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">Requests for Quotation (RFQs)</h5>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center">RFQ Number</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfqs.map((rfq) => (
                <CTableRow key={rfq._id}>
                  <CTableDataCell className="text-center">{rfq.rfqNumber}</CTableDataCell>
                  <CTableDataCell>{rfq.title}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge color={rfq.status === 'Open' ? 'success' : 'warning'}>
                      {rfq.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => navigate(`/procurement/rfqs/${rfq._id}`)}
                    >
                      View
                    </CButton>{' '}
                    <CButton color="warning" size="sm" onClick={() => setSelectedRFQ(rfq._id)}>
                      Invite
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Invite Vendor Modal */}
      <InviteVendorModal
        visible={selectedRFQ !== null}
        vendors={vendors}
        selectedVendor={selectedVendor}
        setSelectedVendor={setSelectedVendor}
        handleInvite={handleInvite}
        isInviting={isInviting}
        onClose={() => setSelectedRFQ(null)}
      />
    </>
  )
}

export default RFQList
