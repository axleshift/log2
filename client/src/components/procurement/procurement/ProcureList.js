import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const PROCUREMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/procurement`

const ProcurementList = () => {
  const navigate = useNavigate()
  const { user, accessToken } = useAuth()
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    const fetchProcurements = async () => {
      if (!accessToken) {
        console.error('No authentication token found')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(PROCUREMENT_API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log('Procurements Data:', response.data)
        setProcurements(response.data)
      } catch (err) {
        console.error('Error fetching procurements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProcurements()
  }, [accessToken])

  const handleDelete = async () => {
    if (!deleteId || !accessToken) return

    try {
      await axios.delete(`${PROCUREMENT_API_URL}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setProcurements(procurements.filter((p) => p._id !== deleteId))
      setDeleteModal(false)
    } catch (err) {
      console.error('Error deleting procurement:', err)
      alert('Failed to delete procurement.')
    }
  }

  return (
    <CCard>
      <CCardBody>
        <h5>Procurement Requests</h5>
        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Department</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {procurements.map((procurement) => (
              <CTableRow key={procurement._id}>
                <CTableDataCell>{procurement.title}</CTableDataCell>
                <CTableDataCell>{procurement.department}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={procurement.status === 'Approved' ? 'success' : 'warning'}>
                    {procurement.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => navigate(`/procurement/${procurement._id}`)}
                  >
                    View
                  </CButton>{' '}
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => {
                      setDeleteId(procurement._id)
                      setDeleteModal(true)
                    }}
                  >
                    Delete
                  </CButton>{' '}
                  {procurement.status === 'Approved' && (
                    <>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => navigate(`/rfq/create/${procurement._id}`)}
                      >
                        Create RFQ
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => navigate(`/po/create/${procurement._id}`)}
                      >
                        Create PO
                      </CButton>
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>Confirm Deletion</CModalHeader>
        <CModalBody>Are you sure you want to delete this procurement request?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default ProcurementList
