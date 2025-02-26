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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
const PROCUREMENT_API_URL = `${API_BASE_URL}/api/v1/procurement`

const ProcurementList = () => {
  const navigate = useNavigate()
  const [procurements, setProcurements] = useState([])

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

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">Procurement List</h5>
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
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default ProcurementList
