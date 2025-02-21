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
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })

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

  const handleDelete = async (rfqId) => {
    try {
      const response = await axios.delete(`${RFQ_API_URL}/${rfqId}/delete`)

      if (response && response.status === 200) {
        setRFQs(rfqs.filter((rfq) => rfq._id !== rfqId))
        setToast({
          visible: true,
          message: 'RFQ deleted successfully!',
          color: 'success',
        })
      } else {
        throw new Error(`Failed to delete RFQ with status: ${response?.status}`)
      }
    } catch (error) {
      console.error('Delete RFQ error:', error)

      const errorMessage =
        error?.response?.data?.message || error.message || 'An unknown error occurred'
      setToast({
        visible: true,
        message: `Failed to delete RFQ: ${errorMessage}`,
        color: 'danger',
      })
    }
  }

  const handleCloseRFQ = async (rfqId) => {
    try {
      const response = await axios.patch(`${RFQ_API_URL}/${rfqId}/close`)
      if (response.status === 200) {
        setRFQs(rfqs.map((rfq) => (rfq._id === rfqId ? { ...rfq, status: 'Closed' } : rfq)))
        setToast({ visible: true, message: 'RFQ closed successfully!', color: 'success' })
      }
    } catch (error) {
      console.error('Close RFQ error:', error)
      setToast({
        visible: true,
        message: `Failed to close RFQ: ${error.response?.data?.message || error.message}`,
        color: 'danger',
      })
    }
  }

  return (
    <>
      <CToaster position="top-center">
        {toast.visible && (
          <CToast
            autohide
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
                <CTableHeaderCell className="text-center">RFQ ID</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Title</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rfqs.map((rfq) => (
                <CTableRow key={rfq._id}>
                  <CTableDataCell className="text-center">{rfq._id}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {rfq.procurementId?.title || 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={
                        rfq.status === 'Open'
                          ? 'success'
                          : rfq.status === 'Closed'
                            ? 'danger'
                            : 'warning'
                      }
                    >
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
                    <CButton color="warning" size="sm" onClick={() => setSelectedRFQ(rfq)}>
                      Invite
                    </CButton>{' '}
                    {rfq.status !== 'Closed' && (
                      <CButton color="danger" size="sm" onClick={() => handleCloseRFQ(rfq._id)}>
                        Close
                      </CButton>
                    )}{' '}
                    <CButton
                      color="light"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rfq._id)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Invite Vendor Modal */}
      {selectedRFQ && (
        <InviteVendorModal
          rfq={selectedRFQ}
          vendors={vendors}
          onClose={() => setSelectedRFQ(null)}
          onSuccess={(updatedRFQ) => {
            setRFQs((prevRFQs) =>
              prevRFQs.map((rfq) =>
                rfq._id === updatedRFQ._id
                  ? { ...rfq, ...updatedRFQ, procurementId: rfq.procurementId }
                  : rfq,
              ),
            )
            setToast({ visible: true, message: 'Vendors invited successfully!', color: 'success' })
          }}
        />
      )}
    </>
  )
}

export default RFQList
