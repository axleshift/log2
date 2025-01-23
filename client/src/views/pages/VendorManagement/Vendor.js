import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCol,
  CRow,
} from '@coreui/react'

const Vendor = () => {
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Vendor Management</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol sm="6">
            <p>Manage vendor details, contracts, and performance metrics.</p>
          </CCol>
          <CCol sm="6" className="text-right">
            <CButton color="primary">Add New Vendor</CButton>
          </CCol>
        </CRow>

        {/* Vendor Table */}
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor Name</CTableHeaderCell>
              <CTableHeaderCell>Contact Person</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>ABC Corp</CTableDataCell>
              <CTableDataCell>John Doe</CTableDataCell>
              <CTableDataCell>Active</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm">
                  View
                </CButton>
                <CButton color="warning" size="sm" className="ml-2">
                  Edit
                </CButton>
                <CButton color="danger" size="sm" className="ml-2">
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>XYZ Ltd.</CTableDataCell>
              <CTableDataCell>Jane Smith</CTableDataCell>
              <CTableDataCell>Inactive</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm">
                  View
                </CButton>
                <CButton color="warning" size="sm" className="ml-2">
                  Edit
                </CButton>
                <CButton color="danger" size="sm" className="ml-2">
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Vendor
