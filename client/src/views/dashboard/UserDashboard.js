import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'

const UserDashboard = () => {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const { user, accessToken } = useAuth()

  const rowsPerPage = 5
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      if (!accessToken) {
        setError('Authentication token missing. Please log in.')
        setLoading(false)
        return
      }
      const response = await axios.get(`${USER_API_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setUsers(response.data.users)
      setLoading(false)
    } catch (error) {
      setError('Error fetching user data.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [accessToken])

  // Sort users
  let sortedUsers = [...users]
  if (sortConfig.key) {
    sortedUsers.sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase() || ''
      const bVal = b[sortConfig.key]?.toLowerCase() || ''

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Pagination slice
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentUsers = sortedUsers.slice(indexOfFirstRow, indexOfLastRow)

  const handlePageChange = (page) => setCurrentPage(page)

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const openModal = (user) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedUser(null)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <CAlert color="danger">{error}</CAlert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <CAlert color="warning">Please log in to view the dashboard.</CAlert>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">User Dashboard</h4>
          <CButton color="light" size="sm" onClick={fetchUsers}>
            Refresh
          </CButton>
        </CCardHeader>
        <CCardBody>
          <p className="mb-4">
            Welcome <strong>{user.username}</strong>
          </p>

          <CTable hover responsive bordered>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell
                  role="button"
                  onClick={() => requestSort('username')}
                  style={{ userSelect: 'none' }}
                >
                  User Name
                  {sortConfig.key === 'username'
                    ? sortConfig.direction === 'asc'
                      ? ' ▲'
                      : ' ▼'
                    : null}
                </CTableHeaderCell>
                <CTableHeaderCell
                  role="button"
                  onClick={() => requestSort('email')}
                  style={{ userSelect: 'none' }}
                >
                  Email
                  {sortConfig.key === 'email'
                    ? sortConfig.direction === 'asc'
                      ? ' ▲'
                      : ' ▼'
                    : null}
                </CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((u, index) => (
                  <CTableRow
                    key={u.id || `user-${index}`}
                    onClick={() => openModal(u)}
                    style={{ cursor: 'pointer' }}
                    title="Click for details"
                  >
                    <CTableDataCell>{indexOfFirstRow + index + 1}</CTableDataCell>
                    <CTableDataCell>{u.username}</CTableDataCell>
                    <CTableDataCell>{u.email}</CTableDataCell>
                    <CTableDataCell>{u.role}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="4" className="text-center">
                    No users found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-center mt-4">
            <CPagination align="center">
              {[...Array(Math.ceil(users.length / rowsPerPage))].map((_, pageIndex) => (
                <CPaginationItem
                  key={`page-${pageIndex}`}
                  active={currentPage === pageIndex + 1}
                  onClick={() => handlePageChange(pageIndex + 1)}
                >
                  {pageIndex + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>

      {/* User Detail Modal */}
      <CModal visible={modalVisible} onClose={closeModal} size="lg" alignment="center">
        <CModalHeader closeButton>User Details</CModalHeader>
        <CModalBody>
          {selectedUser ? (
            <div>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </div>
          ) : (
            <p>No user selected.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default UserDashboard
