import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react'

function SupplierPage() {
  const [profile, setProfile] = useState({
    companyName: 'XYZ Supplies',
    status: 'Approved',
    complianceDocuments: [
      { name: 'Certificate of Compliance', expiry: '12/2023' },
      { name: 'Business License', expiry: '05/2024' },
    ],
  })

  const [orders, setOrders] = useState([
    { id: '12345', quantity: '500 Units', dueDate: '2024-01-20' },
    { id: '12346', quantity: '300 Units', dueDate: '2024-01-30' },
  ])

  const [invoices, setInvoices] = useState([
    { id: 'A123', amount: '$5000', status: 'Pending' },
    { id: 'A124', amount: '$3000', status: 'Paid' },
  ])

  const [notification, setNotification] = useState('')

  useEffect(() => {
    // Fetch data from an API if needed
    // setProfile(...), setOrders(...), setInvoices(...)
  }, [])

  return (
    <CContainer fluid>
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Supplier Profile</h3>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Company Name:</strong> {profile.companyName}
              </p>
              <p>
                <strong>Status:</strong> {profile.status}
              </p>
              <h5>Compliance Documents</h5>
              <ul>
                {profile.complianceDocuments.map((doc, index) => (
                  <li key={index}>
                    {doc.name} - Expiry: {doc.expiry}
                  </li>
                ))}
              </ul>
              <CButton color="primary" variant="outline" className="mt-3">
                Edit Profile
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Active Orders</h3>
            </CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Due Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {orders.map((order) => (
                    <CTableRow key={order.id}>
                      <CTableDataCell>{order.id}</CTableDataCell>
                      <CTableDataCell>{order.quantity}</CTableDataCell>
                      <CTableDataCell>{order.dueDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Pending Invoices</h3>
            </CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invoices.map((invoice) => (
                    <CTableRow key={invoice.id}>
                      <CTableDataCell>{invoice.id}</CTableDataCell>
                      <CTableDataCell>{invoice.amount}</CTableDataCell>
                      <CTableDataCell>{invoice.status}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Notifications</h3>
            </CCardHeader>
            <CCardBody>
              {notification ? (
                <CAlert color="info">{notification}</CAlert>
              ) : (
                <p>No new notifications.</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default SupplierPage
