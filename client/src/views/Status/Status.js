import React, { useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'

const InvoiceAndPaymentStatus = () => {
  const [pendingInvoices, setPendingInvoices] = useState([
    { id: 'INV001', amount: '$1500', dueDate: '2024-12-15' },
    { id: 'INV002', amount: '$2000', dueDate: '2024-12-20' },
    { id: 'INV003', amount: '$1800', dueDate: '2024-12-25' }, // Example additional data
    { id: 'INV004', amount: '$2200', dueDate: '2024-12-30' }, // Example additional data
  ])

  const [paidInvoices, setPaidInvoices] = useState([
    { id: 'INV100', amount: '$5000', paidDate: '2024-11-01' },
    { id: 'INV101', amount: '$3000', paidDate: '2024-11-15' },
    { id: 'INV102', amount: '$2500', paidDate: '2024-10-20' }, // Example additional data
    { id: 'INV103', amount: '$4000', paidDate: '2024-10-25' }, // Example additional data
  ])

  const [createInvoiceModal, setCreateInvoiceModal] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    id: '',
    amount: '',
    dueDate: '',
  })

  const toggleCreateInvoiceModal = () => {
    setCreateInvoiceModal(!createInvoiceModal)
  }

  const handleInvoiceSubmit = () => {
    setPendingInvoices([...pendingInvoices, { ...newInvoice }])
    setNewInvoice({ id: '', amount: '', dueDate: '' })
    setCreateInvoiceModal(false)
  }

  return (
    <CContainer fluid>
      {/* Pending Invoices Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Pending Invoices</h3>
            </CCardHeader>
            <CCardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Due Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pendingInvoices.map((invoice, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{invoice.id}</CTableDataCell>
                      <CTableDataCell>{invoice.amount}</CTableDataCell>
                      <CTableDataCell>{invoice.dueDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Paid Invoices Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Paid Invoices</h3>
            </CCardHeader>
            <CCardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Paid Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paidInvoices.map((invoice, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{invoice.id}</CTableDataCell>
                      <CTableDataCell>{invoice.amount}</CTableDataCell>
                      <CTableDataCell>{invoice.paidDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Invoice Section */}
      <CRow className="mb-4">
        <CCol>
          <CButton color="primary" onClick={toggleCreateInvoiceModal}>
            Create Invoice
          </CButton>
        </CCol>
      </CRow>

      {/* Create Invoice Modal */}
      <CModal visible={createInvoiceModal} onClose={toggleCreateInvoiceModal}>
        <CModalHeader closeButton>
          <CModalTitle>Create Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="invoiceId">Invoice ID</CFormLabel>
              <CFormInput
                type="text"
                id="invoiceId"
                value={newInvoice.id}
                onChange={(e) => setNewInvoice({ ...newInvoice, id: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="invoiceAmount">Amount</CFormLabel>
              <CFormInput
                type="text"
                id="invoiceAmount"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="invoiceDueDate">Due Date</CFormLabel>
              <CFormInput
                type="date"
                id="invoiceDueDate"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleCreateInvoiceModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleInvoiceSubmit}>
            Submit Invoice
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default InvoiceAndPaymentStatus
