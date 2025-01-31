import React, { useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'

const Procurement = () => {
  const [orders, setOrders] = useState([
    {
      id: '#12345',
      supplier: 'XYZ Ltd.',
      status: 'Pending',
      orderDate: '2025-01-15',
      deliveryDate: '2025-01-30',
      totalValue: '$500',
    },
    {
      id: '#12346',
      supplier: 'ABC Corp',
      status: 'Shipped',
      orderDate: '2025-01-10',
      deliveryDate: '2025-01-25',
      totalValue: '$750',
    },
    {
      id: '#12347',
      supplier: 'DEF Supplies',
      status: 'Delivered',
      orderDate: '2025-01-05',
      deliveryDate: '2025-01-15',
      totalValue: '$1,200',
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newOrder, setNewOrder] = useState({
    supplier: '',
    totalValue: '',
    orderDate: '',
    deliveryDate: '',
  })

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target
    setNewOrder({ ...newOrder, [name]: value })
  }

  const toggleModal = () => setIsModalVisible(!isModalVisible)

  const handleAddOrder = () => {
    const newOrderData = {
      id: `#${Math.floor(Math.random() * 100000)}`,
      ...newOrder,
      status: 'Pending',
    }
    setOrders([...orders, newOrderData])
    toggleModal()
  }

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Procurement</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol sm="6">
            <p>Handle procurement processes, including orders and supplier management.</p>
          </CCol>
        </CRow>

        {/* Orders Table */}
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Order ID</CTableHeaderCell>
              <CTableHeaderCell>Supplier</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Order Date</CTableHeaderCell>
              <CTableHeaderCell>Delivery Date</CTableHeaderCell>
              <CTableHeaderCell>Total Value</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {orders.map((order) => (
              <CTableRow key={order.id}>
                <CTableDataCell>{order.id}</CTableDataCell>
                <CTableDataCell>{order.supplier}</CTableDataCell>
                <CTableDataCell>{order.status}</CTableDataCell>
                <CTableDataCell>{order.orderDate}</CTableDataCell>
                <CTableDataCell>{order.deliveryDate}</CTableDataCell>
                <CTableDataCell>{order.totalValue}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm">
                    View
                  </CButton>
                  <CButton color="warning" size="sm" className="ml-2">
                    Edit
                  </CButton>
                  <CButton color="danger" size="sm" className="ml-2">
                    Cancel
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* New Order Modal */}
        <CModal show={isModalVisible} onClose={toggleModal}>
          <CModalHeader closeButton>
            <CModalTitle>Create New Procurement Order</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm="12">
                  <label>Supplier Name</label>
                  <CInputGroup>
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="text"
                      name="supplier"
                      value={newOrder.supplier}
                      onChange={handleNewOrderChange}
                      placeholder="Enter supplier name"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm="12">
                  <label>Total Value</label>
                  <CInputGroup>
                    <CInputGroupText>$</CInputGroupText>
                    <CFormInput
                      type="text"
                      name="totalValue"
                      value={newOrder.totalValue}
                      onChange={handleNewOrderChange}
                      placeholder="Enter total value"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm="6">
                  <label>Order Date</label>
                  <CFormInput
                    type="date"
                    name="orderDate"
                    value={newOrder.orderDate}
                    onChange={handleNewOrderChange}
                  />
                </CCol>
                <CCol sm="6">
                  <label>Delivery Date</label>
                  <CFormInput
                    type="date"
                    name="deliveryDate"
                    value={newOrder.deliveryDate}
                    onChange={handleNewOrderChange}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={toggleModal}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleAddOrder}>
              Add Order
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default Procurement
