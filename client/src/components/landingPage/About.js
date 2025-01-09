import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CContainer,
  CFormInput,
} from '@coreui/react'

const RecentAwardNotices = () => {
  const awardNotices = [
    { title: 'Various Instruments', amount: '4,020,520.00' },
    { title: 'INSTALLATION OF SOLAR', amount: '249,250.08' },
    { title: 'SUPPLEMENTAL FEEDING', amount: '572,039.20' },
    { title: 'Reed Diffuser', amount: '1,044,888.00' },
    { title: 'Lot 17-QUEZON', amount: '714,164.00' },
    { title: 'HYGIENIC AND SURGICAL HAND DISINFECTANT ALCOHOL BA', amount: '451,200.00' },
    { title: 'POWERFUL NEUTRAL AND ECOLOGICAL CLEANING CONCENTRA', amount: '478,380.00' },
    { title: 'Construction of Concrete Water Tank@Danipa', amount: '362,493.13' },
    { title: 'ten (10) ea Brush (Metal Big) and 19 other L/I', amount: '946,450.00' },
    { title: 'Smart TV', amount: '96,550.00' },
  ]

  const [searchTerm, setSearchTerm] = useState('')

  // Filter notices based on search term
  const filteredNotices = awardNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CContainer className="p-5">
      <h3 className="mb-4 text-center">Recent Award Notices</h3>
      {/* Search Bar */}
      <CFormInput
        type="text"
        placeholder="Search notices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {/* Table */}
      <CTable bordered hover>
        <CTableHead color="primary">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Title</CTableHeaderCell>
            <CTableHeaderCell scope="col">Amount (PHP)</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredNotices.map((notice, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>
                <a href="#">{notice.title}</a>
              </CTableDataCell>
              <CTableDataCell>{notice.amount}</CTableDataCell>
            </CTableRow>
          ))}
          {/* Show message if no results found */}
          {filteredNotices.length === 0 && (
            <CTableRow>
              <CTableDataCell colSpan="3" className="text-center">
                No notices found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default RecentAwardNotices
