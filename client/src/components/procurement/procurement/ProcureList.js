import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
const PROCUREMENT_API_URL = `${API_BASE_URL}/api/v1/procurement`

const ProcurementList = () => {
  const navigate = useNavigate()
  const [procurements, setProcurements] = useState([])
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const response = await axios.get(PROCUREMENT_API_URL)
        const filteredProcurements = response.data.filter((p) => !p.rfqRequired)
        setProcurements(filteredProcurements)
      } catch (error) {
        console.error('Error fetching procurements:', error.response?.data || error.message)
      }
    }
    fetchProcurements()
  }, [])

  const handleDelete = async (procurementId) => {
    try {
      await axios.delete(`${PROCUREMENT_API_URL}/${procurementId}`)
      setProcurements(procurements.filter((p) => p._id !== procurementId))
      setToast({ visible: true, message: 'Procurement deleted successfully!', color: 'success' })
    } catch (error) {
      setToast({
        visible: true,
        message: `Failed to delete procurement: ${error.response?.data?.message || error.message}`,
        color: 'danger',
      })
    }
  }

  const updateStatus = async (procurementId, status) => {
    try {
      const endpoint = status === 'Approved' ? 'approve' : 'reject'
      await axios.patch(`${PROCUREMENT_API_URL}/${procurementId}/${endpoint}`)
      setProcurements(procurements.map((p) => (p._id === procurementId ? { ...p, status } : p)))
      setToast({
        visible: true,
        message: `Procurement ${status.toLowerCase()} successfully!`,
        color: 'success',
      })
    } catch (error) {
      setToast({
        visible: true,
        message: `Failed to update status: ${error.response?.data?.message || error.message}`,
        color: 'danger',
      })
    }
  }

  return (
    <>
      <CToaster position="top-center">
        {toast.visible && (
          <CToast
            autohide
            color={toast.color}
            onClose={() => setToast({ ...toast, visible: false })}
          >
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">Procurement List (Approval)</h5>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center">Procurement ID</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {procurements.map((procurement) => (
                <CTableRow key={procurement._id}>
                  <CTableDataCell className="text-center">{procurement._id}</CTableDataCell>
                  <CTableDataCell>{procurement.title}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={
                        procurement.status === 'Approved'
                          ? 'success'
                          : procurement.status === 'Rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
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
                      color="success"
                      size="sm"
                      onClick={() => updateStatus(procurement._id, 'Approved')}
                    >
                      Approve
                    </CButton>{' '}
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => updateStatus(procurement._id, 'Rejected')}
                    >
                      Reject
                    </CButton>{' '}
                    <CButton
                      color="light"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(procurement._id)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ProcurementList
