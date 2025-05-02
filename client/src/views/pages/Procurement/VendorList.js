import React, { useEffect, useState } from 'react'
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
  CButton,
} from '@coreui/react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function VendorList() {
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await axios.get(`${API_URL}/api/v1/vendors`)
      setVendors(res.data || [])
    }
    fetchVendors()
  }, [])

  return React.createElement(
    CCard,
    null,
    React.createElement(CCardHeader, null, 'Vendor Profiles'),
    React.createElement(
      CCardBody,
      null,
      React.createElement(
        CTable,
        { striped: true, responsive: true },
        React.createElement(
          CTableHead,
          null,
          React.createElement(
            CTableRow,
            null,
            React.createElement(CTableHeaderCell, null, 'Company'),
            React.createElement(CTableHeaderCell, null, 'Email'),
            React.createElement(CTableHeaderCell, null, 'Phone'),
            React.createElement(CTableHeaderCell, null, 'Status'),
            React.createElement(CTableHeaderCell, null, 'Actions'),
          ),
        ),
        React.createElement(
          CTableBody,
          null,
          vendors.map((v) =>
            React.createElement(
              CTableRow,
              { key: v._id },
              React.createElement(CTableDataCell, null, v.companyName),
              React.createElement(CTableDataCell, null, v.email),
              React.createElement(CTableDataCell, null, v.phone),
              React.createElement(CTableDataCell, null, v.status),
              React.createElement(
                CTableDataCell,
                null,
                React.createElement(
                  CButton,
                  {
                    size: 'sm',
                    href: v.documentUrl,
                    target: '_blank',
                  },
                  'View Document',
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}

export default VendorList
