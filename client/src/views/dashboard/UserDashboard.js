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
  CButton,
  CPagination,
  CPaginationItem,
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

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>Please log in to view the dashboard.</div>
  }

  return (
    <div className="user-dashboard">
      <h2>Welcome {user.username}</h2>
      <CTable hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">UserName</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
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
                  <span
                    className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}
                  >
                    {user.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm" className="me-2">
                    View
                  </CButton>
                  <CButton color="warning" size="sm" className="me-2">
                    Edit
                  </CButton>
                  <CButton color="danger" size="sm">
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6">No users found</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      <CPagination align="center" className="mt-3">
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
  )
}

export default UserDashboard
