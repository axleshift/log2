import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const UserDetailsModal = ({ visible, onClose, user }) => {
  console.log(user)

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>User Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {user ? (
          <div>
            <p>
              <strong>User ID:</strong> {user._id}
            </p>
            <p>
              <strong>Name:</strong> {user.name || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>

            {user.role === 'vendor' && user.details ? (
              <>
                <p>
                  <strong>Business Name:</strong> {user.details.businessName || 'N/A'}
                </p>
                <p>
                  <strong>Full Name:</strong> {user.details.fullName || 'N/A'}
                </p>
                <p>
                  <strong>Business Address:</strong> {user.details.businessAddress || 'N/A'}
                </p>
                <p>
                  <strong>Contact Number:</strong> {user.details.contactNumber || 'N/A'}
                </p>
                <p>
                  <strong>Tax ID:</strong> {user.details.taxId || 'N/A'}
                </p>
                <p>
                  <strong>Certifications:</strong>{' '}
                  {user.details.certifications?.join(', ') || 'N/A'}
                </p>
              </>
            ) : (
              <p>No vendor details available.</p>
            )}
          </div>
        ) : (
          <div>Loading details...</div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UserDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    details: PropTypes.shape({
      businessName: PropTypes.string,
      fullName: PropTypes.string,
      businessAddress: PropTypes.string,
      contactNumber: PropTypes.string,
      taxId: PropTypes.string,
      certifications: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
}

export default UserDetailsModal
