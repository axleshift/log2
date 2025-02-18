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
} from '@coreui/react'

const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

const VendorManagement = () => {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

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
              <h4 className="text-primary">Vendor Management</h4>
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

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} className="bg-light">
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <div>
              <p>
                <strong>User ID:</strong> {selectedUser._id}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser?.name || 'N/A'}
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
