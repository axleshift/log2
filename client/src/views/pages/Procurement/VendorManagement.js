import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext.js'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'

const VENDOR_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/vendor`
const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

const Vendors = () => {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    if (!accessToken) return

    const fetchVendors = async () => {
      try {
        const response = await fetch(`${VENDOR_API_URL}/with-users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setUsers(data.vendors)
      } catch (error) {
        console.error('Error fetching vendors:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [accessToken])

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)),
    )
  }

  const handleApproval = async (userId) => {
    if (!accessToken) return
    setActionLoading(userId)
    try {
      const response = await fetch(`${USER_API_URL}/approve/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        updateUserStatus(userId, 'Approved')
      } else {
        console.error('Error approving user', response.statusText)
      }
    } catch (error) {
      console.error('Error approving user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelApproval = async (userId) => {
    if (!accessToken) return
    setActionLoading(userId)

    try {
      const response = await fetch(`${USER_API_URL}/cancel-approval/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        updateUserStatus(userId, 'Pending')
      } else {
        console.error('Error canceling approval:', response.statusText)
      }
    } catch (error) {
      console.error('Error canceling approval:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard className="shadow-lg">
            <CCardBody>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable striped bordered hover responsive>
                  <CTableHead className="bg-light">
                    <CTableRow>
                      <CTableHeaderCell>User ID</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <CTableRow key={user._id} className="text-center">
                          <CTableDataCell>{user._id}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color={getStatusColor(user.status)} className="mr-2">
                              {user.status}
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>{user.role}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              onClick={() => handleViewDetails(user)}
                              className="mr-2"
                            >
                              View Details
                            </CButton>

                            {user.status === 'Approved' ? (
                              <CButton
                                color="warning"
                                onClick={() => handleCancelApproval(user._id)}
                                className="ml-2"
                                disabled={actionLoading === user._id}
                              >
                                Cancel Approval
                              </CButton>
                            ) : (
                              <CButton
                                color="success"
                                onClick={() => handleApproval(user._id)}
                                className="ml-2"
                                disabled={actionLoading === user._id}
                              >
                                Approve
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No vendors found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Vendor Profile */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton className="bg-dark text-white">
          <CModalTitle>Vendor Profile</CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-dark text-white">
          {selectedUser && (
            <div className="p-2">
              <p>
                <strong>User ID:</strong> {selectedUser._id}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>

              {selectedUser.vendorProfile ? (
                <>
                  <p>
                    <strong>Business Name:</strong> {selectedUser.vendorProfile.businessName}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {selectedUser.vendorProfile.contactNumber}
                  </p>

                  {/* Render documents as clickable preview links */}
                  {selectedUser.vendorProfile.documents?.businessRegistrationCertificate && (
                    <p>
                      <strong>Business Registration Certificate:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.businessRegistrationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                  {selectedUser.vendorProfile.documents?.companyProfile && (
                    <p>
                      <strong>Company Profile:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.companyProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                  {selectedUser.vendorProfile.documents?.isoCertification && (
                    <p>
                      <strong>ISO Certification:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.isoCertification}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                  {selectedUser.vendorProfile.documents?.authorizationCertificate && (
                    <p>
                      <strong>Authorization Certificate:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.authorizationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                  {selectedUser.vendorProfile.documents?.complianceDeclaration && (
                    <p>
                      <strong>Compliance Declaration:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.complianceDeclaration}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                  {selectedUser.vendorProfile.documents?.productCatalog && (
                    <p>
                      <strong>Product Catalog:</strong>
                      <a
                        href={selectedUser.vendorProfile.documents.productCatalog}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted">No vendor profile attached.</p>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter className="bg-dark">
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Vendors
