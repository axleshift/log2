import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const OrdersSection = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState(1)

  // Sample Data
  const currentOrders = [
    { id: '12345', quantity: '500 Units', deliveryDate: '2024-01-20', status: 'Processing' },
    { id: '12346', quantity: '300 Units', deliveryDate: '2024-01-30', status: 'Shipped' },
    { id: '12347', quantity: '200 Units', deliveryDate: '2024-02-10', status: 'Pending' }, // Example extra data
  ]

  const pastOrders = [
    { id: '12234', quantity: '400 Units', deliveryDate: '2023-10-15', feedback: 'Good' },
    { id: '12235', quantity: '600 Units', deliveryDate: '2023-11-05', feedback: 'Excellent' },
    { id: '12236', quantity: '700 Units', deliveryDate: '2023-12-01', feedback: 'Satisfactory' }, // Example extra data
  ]

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h3>Orders Section</h3>
          </CCardHeader>
          <CCardBody>
            {/* Navigation Tabs */}
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} role="tab">
                  Current Orders
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)} role="tab">
                  Past Orders
                </CNavLink>
              </CNavItem>
            </CNav>

            {/* Tab Content */}
            <CTabContent>
              {/* Current Orders Tab */}
              <CTabPane visible={activeTab === 1}>
                <h5>Current Orders</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Order ID</CTableHeaderCell>
                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                        <CTableHeaderCell>Delivery Date</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentOrders.map((order) => (
                        <CTableRow key={order.id}>
                          <CTableDataCell>{order.id}</CTableDataCell>
                          <CTableDataCell>{order.quantity}</CTableDataCell>
                          <CTableDataCell>{order.deliveryDate}</CTableDataCell>
                          <CTableDataCell>{order.status}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CTabPane>

              {/* Past Orders Tab */}
              <CTabPane visible={activeTab === 2}>
                <h5>Past Orders</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Order ID</CTableHeaderCell>
                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                        <CTableHeaderCell>Delivery Date</CTableHeaderCell>
                        <CTableHeaderCell>Feedback</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {pastOrders.map((order) => (
                        <CTableRow key={order.id}>
                          <CTableDataCell>{order.id}</CTableDataCell>
                          <CTableDataCell>{order.quantity}</CTableDataCell>
                          <CTableDataCell>{order.deliveryDate}</CTableDataCell>
                          <CTableDataCell>{order.feedback}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrdersSection
