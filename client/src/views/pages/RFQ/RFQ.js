import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const RFQListPage = () => {
  const rfqs = [
    { id: 1, title: 'RFQ 001', status: 'Open', deadline: '2025-02-20' },
    { id: 2, title: 'RFQ 002', status: 'Closed', deadline: '2025-02-18' },
    { id: 3, title: 'RFQ 003', status: 'Open', deadline: '2025-02-25' },
  ]

  return (
    <CCard>
      <CCardHeader>RFQ List</CCardHeader>
      <CCardBody>
        <CTable striped bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>RFQ Title</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Deadline</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rfqs.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.title}</CTableDataCell>
                <CTableDataCell>{item.status}</CTableDataCell>
                <CTableDataCell>{item.deadline}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" href={`/rfq/${item.id}`}>
                    View Details
                  </CButton>
                  <CButton color="warning" className="ml-2">
                    Edit
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

export default RFQListPage
