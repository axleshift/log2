import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import Select from 'react-select'

const API_BASE_URL = import.meta.env.VITE_API_URL
const RFQ_API_URL = `${API_BASE_URL}/api/v1/rfq`
const VENDOR_API_URL = `${API_BASE_URL}/api/v1/vendor`

const InviteVendorModal = ({ rfq, onClose, onSuccess }) => {
  const [vendors, setVendors] = useState([])
  const [selectedVendors, setSelectedVendors] = useState([])
  const [isInviting, setIsInviting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })

  const showToast = (message, color = 'success') => {
    setToast({ visible: true, message, color })

    setTimeout(() => {
      setToast({ visible: false, message: '', color: '' })
    }, 3000)
  }

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(VENDOR_API_URL)
        const invitedVendorIds = new Set(rfq?.invitedVendors?.map((id) => id.toString()) || [])

        const formattedVendors = response.data
          .filter((vendor) => !invitedVendorIds.has(vendor._id))
          .map((vendor) => ({
            value: vendor._id,
            label: `${vendor.fullName || 'Unknown Vendor'} (${vendor.userId?.email || 'No Email'})`,
          }))

        setVendors(formattedVendors)
      } catch (error) {
        console.error('Error fetching vendors:', error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [rfq])

  const handleInvite = async () => {
    if (!selectedVendors.length) {
      showToast('❌ Please select at least one vendor.', 'danger')
      return
    }

    setIsInviting(true)
    const vendorIds = selectedVendors.map((v) => v.value)

    try {
      const response = await axios.post(`${RFQ_API_URL}/${rfq._id}/invite`, { vendorIds })

      if (response.status === 200) {
        showToast('🎉 Vendors invited successfully!', 'success')

        const updatedRfq = response.data.rfq
        onSuccess(updatedRfq)

        const invitedVendorIds = new Set(updatedRfq.invitedVendors.map((id) => id.toString()))
        setVendors((prevVendors) =>
          prevVendors.filter((vendor) => !invitedVendorIds.has(vendor.value)),
        )

        setSelectedVendors([])

        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Invite error:', error.response?.data)
      showToast(error.response?.data?.message || '❌ Failed to invite vendors.', 'danger')
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <>
      {/* Custom Toast Notification */}
      {toast.visible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: toast.color === 'success' ? '#28a745' : '#dc3545',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            {toast.message}
          </div>
        </div>
      )}

      <CModal visible={!!rfq} onClose={onClose} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Invite Vendors to RFQ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-muted">Select vendors to invite to this RFQ.</p>

          {loading ? (
            <CSpinner color="primary" />
          ) : (
            <Select
              isMulti
              options={vendors}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={setSelectedVendors}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#212529',
                  color: '#ffffff',
                  borderColor: '#0d6efd',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#343a40',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#ffffff',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#0d6efd',
                  color: '#ffffff',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: '#ffffff',
                }),
                option: (base, { isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#0d6efd' : '#343a40',
                  color: '#ffffff',
                  ':hover': {
                    backgroundColor: '#0b5ed7',
                  },
                }),
              }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={onClose} disabled={isInviting}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleInvite} disabled={isInviting}>
            {isInviting ? <CSpinner size="sm" className="me-1" /> : 'Send Invites'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

InviteVendorModal.propTypes = {
  rfq: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    invitedVendors: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        userId: PropTypes.string,
      }),
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default InviteVendorModal
