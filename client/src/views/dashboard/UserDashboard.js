import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CSpinner,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
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
      } catch (error) {
        setError('Error fetching user data.')
      } finally {
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

  return (
    <div className="user-dashboard p-4">
      <CCard className="shadow-lg border-0 rounded-3">
        <CCardHeader className="bg-primary text-white text-center fw-bold fs-4">
          Welcome, {user?.username}!
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" size="sm" />
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <>
              <CTable hover responsive bordered className="mt-3">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
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
                        <CTableDataCell>
                          <CBadge color={user.status === 'Approved' ? 'success' : 'danger'}>
                            {user.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        No users found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              <CPagination align="center" className="mt-4">
                {[...Array(Math.ceil(users.length / rowsPerPage))].map((_, pageIndex) => (
                  <CPaginationItem
                    key={`page-${pageIndex}`}
                    active={currentPage === pageIndex + 1}
                    onClick={() => handlePageChange(pageIndex + 1)}
                    className="cursor-pointer"
                  >
                    {pageIndex + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserDashboard
