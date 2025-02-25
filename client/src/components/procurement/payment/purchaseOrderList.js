import React, { useState } from 'react'
import {
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
} from '@coreui/react'

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([
    { id: 1, supplier: 'ABC Supplies', amount: 1500, status: 'Approved' },
    { id: 2, supplier: 'XYZ Electronics', amount: 800, status: 'Pending' },
  ])

  return (
    <div>
      <h3>Purchase Orders</h3>
      <CButton color="primary" className="mb-3">
        Create New Order
      </CButton>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Supplier</CTableHeaderCell>
            <CTableHeaderCell>Total Amount</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {orders.map((order) => (
            <CTableRow key={order.id}>
              <CTableDataCell>{order.id}</CTableDataCell>
              <CTableDataCell>{order.supplier}</CTableDataCell>
              <CTableDataCell>${order.amount}</CTableDataCell>
              <CTableDataCell>{order.status}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm" className="mr-2">
                  View
                </CButton>
                <CButton color="danger" size="sm">
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default PurchaseOrderList
