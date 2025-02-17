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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSelect,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`
const VENDOR_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/vendor`

const RFQList = () => {
  const navigate = useNavigate()
  const [rfqs, setRFQs] = useState([])
  const [vendors, setVendors] = useState([])
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [selectedVendor, setSelectedVendor] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('')

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const response = await axios.get(RFQ_API_URL)
        setRFQs(response.data)
      } catch (error) {
        console.error('Error fetching RFQs:', error.response ? error.response.data : error.message)
      }
    }

    const fetchVendors = async () => {
      try {
        const response = await axios.get(VENDOR_API_URL)
        setVendors(response.data)
      } catch (error) {
        console.error(
          'Error fetching vendors:',
          error.response ? error.response.data : error.message,
        )
      }
    }

    fetchRFQs()
    fetchVendors()
  }, [])

  const openInviteModal = (rfqId) => {
    setSelectedRFQ(rfqId)
    setModalVisible(true)
  }

  const handleInvite = async () => {
    if (!selectedRFQ || !selectedVendor) {
      setToastMessage('Please select a vendor')
      setToastColor('danger')
      setToastVisible(true)
      return
    }

    try {
      console.log(`Inviting vendor ${selectedVendor} to RFQ ${selectedRFQ}`)

      const response = await axios.put(
        `${RFQ_API_URL}/${selectedRFQ}/invite-vendors`,
        { vendors: [selectedVendor] },
        { headers: { 'Content-Type': 'application/json' } },
      )

      console.log('Vendor invited successfully:', response.data)
      setToastMessage('Vendor invited successfully!')
      setToastColor('success')
      setToastVisible(true)
      setModalVisible(false)
    } catch (error) {
      console.error('Error inviting vendor:', error.response ? error.response.data : error.message)
      setToastMessage(
        `Failed to invite vendor: ${error.response ? error.response.data.message : error.message}`,
      )
      setToastColor('danger')
      setToastVisible(true)
    }
  }

  return (
    <>
      {/* Toast Container */}
      {toastVisible && (
        <CToaster
          position="top-center"
          className="position-fixed top-0 start-50 translate-middle-x zindex-9999"
        >
          <CToast
            color={toastColor}
            visible={toastVisible}
            autohide={true}
            onClose={() => setToastVisible(false)}
          >
            <CToastHeader>{toastColor === 'success' ? 'Success' : 'Error'}</CToastHeader>
            <CToastBody>{toastMessage}</CToastBody>
          </CToast>
        </CToaster>
      )}

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Requests for Quotation (RFQs)</h5>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>RFQ Number</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfqs.map((rfq) => (
                <CTableRow key={rfq._id}>
                  <CTableDataCell>{rfq.rfqNumber}</CTableDataCell>
                  <CTableDataCell>{rfq.title}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={rfq.status === 'Open' ? 'success' : 'warning'}>
                      {rfq.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => navigate(`/procurement/rfqs/${rfq._id}`)}
                    >
                      View
                    </CButton>{' '}
                    <CButton color="warning" size="sm" onClick={() => openInviteModal(rfq._id)}>
                      Invite
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Invite Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Invite Vendor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Select Vendor</CFormLabel>
            <CFormSelect value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)}>
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.businessName}
                </option>
              ))}
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleInvite}>
            Invite Vendor
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default RFQList
