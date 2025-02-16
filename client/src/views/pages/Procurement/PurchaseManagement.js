import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'

const PurchaseManagement = () => {
  const [activeTab, setActiveTab] = useState('orders')
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [purchaseRequests, setPurchaseRequests] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [errorOrders, setErrorOrders] = useState(null)
  const [errorRequests, setErrorRequests] = useState(null)

  const PURCHASEORDER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/purchaseOrder`
  const PURCHASEREQUESTS_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/purchaseRequests`

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await fetch(PURCHASEORDER_API_URL)
        if (!response.ok) throw new Error('Failed to fetch purchase orders')
        const data = await response.json()
        setPurchaseOrders(data)
      } catch (error) {
        setErrorOrders(error.message)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchPurchaseOrders()
  }, [])

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await fetch(PURCHASEREQUESTS_API_URL)
        if (!response.ok) throw new Error('Failed to fetch purchase requests')
        const data = await response.json()
        setPurchaseRequests(data)
      } catch (error) {
        setErrorRequests(error.message)
      } finally {
        setLoadingRequests(false)
      }
    }

    fetchPurchaseRequests()
  }, [])

  return (
    <CCard>
      <CCardHeader>
        <h4>Purchase Management</h4>
      </CCardHeader>
      <CCardBody>
        {/* Tabs for Purchase Orders and Purchase Requests */}
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
              Purchase Orders
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 'requests'} onClick={() => setActiveTab('requests')}>
              Purchase Requests
            </CNavLink>
          </CNavItem>
        </CNav>

        {/* Tabs Content */}
        <CTabContent>
          {/* Purchase Orders Tab */}
          <CTabPane visible={activeTab === 'orders'}>
            {loadingOrders ? (
              <p>Loading Purchase Orders...</p>
            ) : errorOrders ? (
              <p>Error: {errorOrders}</p>
            ) : (
              <PurchaseOrdersTable data={purchaseOrders} />
            )}
          </CTabPane>

          {/* Purchase Requests Tab */}
          <CTabPane visible={activeTab === 'requests'}>
            {loadingRequests ? (
              <p>Loading Purchase Requests...</p>
            ) : errorRequests ? (
              <p>Error: {errorRequests}</p>
            ) : (
              <PurchaseRequestsTable data={purchaseRequests} />
            )}
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  )
}

// Purchase Orders Table Component
const PurchaseOrdersTable = ({ data }) => (
  <CTable bordered hover responsive>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell>#</CTableHeaderCell>
        <CTableHeaderCell>Order ID</CTableHeaderCell>
        <CTableHeaderCell>Supplier</CTableHeaderCell>
        <CTableHeaderCell>Status</CTableHeaderCell>
        <CTableHeaderCell>Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {data.map((order, index) => (
        <CTableRow key={`${order.id}-${index}`}>
          <CTableDataCell>{order.id}</CTableDataCell>
          <CTableDataCell>{order.orderId}</CTableDataCell>
          <CTableDataCell>{order.supplier}</CTableDataCell>
          <CTableDataCell>{order.status}</CTableDataCell>
          <CTableDataCell>
            <CButton color="info">View</CButton>
            <CButton color="warning" className="ms-2">
              Edit
            </CButton>
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
)

// Purchase Requests Table Component
const PurchaseRequestsTable = ({ data }) => (
  <CTable bordered hover responsive>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell>#</CTableHeaderCell>
        <CTableHeaderCell>Request ID</CTableHeaderCell>
        <CTableHeaderCell>Supplier</CTableHeaderCell>
        <CTableHeaderCell>Status</CTableHeaderCell>
        <CTableHeaderCell>Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {data.map((request, index) => (
        <CTableRow key={`${request.id}-${index}`}>
          <CTableDataCell>{request.id}</CTableDataCell>
          <CTableDataCell>{request.requestId}</CTableDataCell>
          <CTableDataCell>{request.supplier}</CTableDataCell>
          <CTableDataCell>{request.status}</CTableDataCell>
          <CTableDataCell>
            <CButton color="info">View</CButton>
            <CButton color="warning" className="ms-2">
              Edit
            </CButton>
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
)

// PropTypes Validation
PurchaseOrdersTable.propTypes = {
  data: PropTypes.array.isRequired,
}

PurchaseRequestsTable.propTypes = {
  data: PropTypes.array.isRequired,
}

export default PurchaseManagement
