import React from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
} from '@coreui/react'

const InviteVendorModal = ({
  visible,
  vendors,
  selectedVendor,
  setSelectedVendor,
  handleInvite,
  isInviting,
  onClose,
}) => {
  const handleVendorInvite = async () => {
    if (!selectedVendor) {
      return
    }
    try {
      await handleInvite(selectedVendor)
      onClose()
    } catch (error) {
      console.error('Error inviting vendor:', error)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
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
                {vendor.businessName} ({vendor.userId?.email})
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleVendorInvite} disabled={isInviting}>
          {isInviting ? <CSpinner size="sm" /> : 'Invite Vendor'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

InviteVendorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      businessName: PropTypes.string.isRequired,
      userId: PropTypes.shape({
        email: PropTypes.string,
      }),
    }),
  ).isRequired,
  selectedVendor: PropTypes.string,
  setSelectedVendor: PropTypes.func.isRequired,
  handleInvite: PropTypes.func.isRequired,
  isInviting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default InviteVendorModal
