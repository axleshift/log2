import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
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
} from '@coreui/react'
import UserDetailsModal from '../../components/Modal/UserDetails.js'

const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

const UserManagement = () => {
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
        setUsers(Array.isArray(data.users) ? data.users : [])
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

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardBody>
              <h4>User Management</h4>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <CTable striped bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>User ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <CTableRow key={user._id}>
                          <CTableDataCell>{user._id}</CTableDataCell>
                          <CTableDataCell>{user?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>{user.status}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color="info" onClick={() => handleViewDetails(user)}>
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
                          No users found.
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

      <UserDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={selectedUser}
      />
    </>
  )
}

export default UserManagement
