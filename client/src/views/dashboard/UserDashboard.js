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
} from '@coreui/react'

const UserDashboard = () => {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, accessToken } = useAuth()

  const rowsPerPage = 5
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        if (!accessToken) {
          setError('Authentication token missing. Please log in.')
          setLoading(false)
          return
        }

        const response = await axios.get(`${USER_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        setUsers(response.data.users)
        setLoading(false)
      } catch (error) {
        setError('Error fetching user data.')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [accessToken])

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow)

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
        <CCardHeader className="bg-primary text-white">
          <h4 className="mb-0">User Dashboard</h4>
        </CCardHeader>
        <CCardBody>
          <p className="mb-4">
            Welcome <strong>{user.username}</strong>
          </p>
          <CTable hover responsive bordered>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>User Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <CTableRow key={user.id || `user-${index}`}>
                    <CTableDataCell>{indexOfFirstRow + index + 1}</CTableDataCell>
                    <CTableDataCell>{user.username}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
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
    </div>
  )
}

export default UserDashboard
