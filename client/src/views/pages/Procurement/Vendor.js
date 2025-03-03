import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
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
  CBadge,
} from '@coreui/react'

const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

const VendorManagement = () => {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!accessToken) return

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${USER_API_URL}/users`, {
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
        const filteredVendors = data.users.filter((user) => user.role === 'vendor')
        setUsers(filteredVendors)
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [accessToken])

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard className="shadow-lg border-0 rounded-3">
            <CCardBody>
              <h4 className="text-primary fw-bold text-center mb-3">Vendor Management</h4>

              {loading ? (
                <div className="d-flex justify-content-center py-4">
                  <CSpinner color="primary" size="lg" />
                </div>
              ) : (
                <CTable striped bordered hover responsive className="text-center">
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>User ID</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <CTableRow key={user._id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{user._id}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={
                                user.status === 'Active'
                                  ? 'success'
                                  : user.status === 'Pending'
                                    ? 'warning'
                                    : user.status === 'Approved'
                                      ? 'primary'
                                      : 'danger'
                              }
                            >
                              {user.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{user.role}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              className="text-white fw-bold"
                              onClick={() => handleViewDetails(user)}
                            >
                              View Details
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center text-muted">
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

      {/* Modal for User Details */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <div>
              <p className="fw-bold">
                User ID: <span className="fw-normal">{selectedUser._id}</span>
              </p>
              <p className="fw-bold">
                Name:{' '}
                <span className="fw-normal">
                  {selectedUser?.fullName || selectedUser?.username || 'N/A'}
                </span>
              </p>
              <p className="fw-bold">
                Email: <span className="fw-normal">{selectedUser.email}</span>
              </p>
              <p className="fw-bold">
                Status:{' '}
                <CBadge
                  color={
                    selectedUser.status === 'Active'
                      ? 'success'
                      : selectedUser.status === 'Pending'
                        ? 'warning'
                        : selectedUser.status === 'Approved'
                          ? 'primary'
                          : 'danger'
                  }
                >
                  {selectedUser.status}
                </CBadge>
              </p>
              <p className="fw-bold">
                Role: <span className="fw-normal">{selectedUser.role}</span>
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default VendorManagement
