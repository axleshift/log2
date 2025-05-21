import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CSpinner, CWidgetStatsA } from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilWarning } from '@coreui/icons'
import UserDashboard from './UserDashboard'
import MainChart from './MainChart'
import { useAuth } from '../../context/AuthContext.js'

const Dashboard = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const [showAccessModal, setShowAccessModal] = useState(false)

  const BASE_URL = import.meta.env.VITE_API_URL
  const PO_API_URL = `${BASE_URL}/api/v1/purchaseOrder`
  const INVENTORY_API_URL = `${BASE_URL}/api/v1/inventory`

  const isVendor = user?.role === 'vendor'

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrdersData, inventoryData] = await Promise.all([
          axios.get(PO_API_URL),
          axios.get(INVENTORY_API_URL),
        ])
        setPurchaseOrders(purchaseOrdersData.data)
        setInventory(inventoryData.data)
      } catch (err) {
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [PO_API_URL, INVENTORY_API_URL])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardLoaded', 'true')
    }
  }, [])

  if (loading) {
    return (
      <CContainer fluid>
        <CRow className="justify-content-center">
          <CSpinner color="primary" size="sm" />
        </CRow>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer fluid>
        <CRow className="justify-content-center">
          <div className="alert alert-danger">{error}</div>
        </CRow>
      </CContainer>
    )
  }

  return (
    <CContainer fluid className="px-5 py-4">
      <h1 className="mb-4">Dashboard</h1>

      {/* Purchase Orders and Inventory Widgets */}
      <CRow>
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={purchaseOrders.length}
            title="Purchase Orders"
            icon={<i className="cil-list-numbered" />}
            onClick={() => {
              if (isVendor) {
                setShowAccessModal(true)
                return
              }
              navigate('/procurement/po-payments')
            }}
            style={{
              cursor: isVendor ? 'not-allowed' : 'pointer',
              padding: '3rem',
              opacity: isVendor ? 0.5 : 1,
            }}
          />
        </CCol>
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={inventory.length}
            title="Inventory Items"
            icon={<i className="cil-cube" />}
            onClick={() => navigate('/inventory')}
            style={{ cursor: 'pointer', padding: '3rem' }}
          />
        </CCol>
      </CRow>

      <CModal visible={showAccessModal} onClose={() => setShowAccessModal(false)}>
        <CModalHeader closeButton>
          <CIcon icon={cilWarning} size="lg" className="text-danger me-2" />
          <strong> Access Restricted</strong>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex align-items-center">
            <CIcon icon={cilLockLocked} size="xl" className="text-danger me-3" />
            <div>
              Vendors are not allowed to access the Purchase Orders section.
              <br />
              If you believe this is an error, please contact the administrator.
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAccessModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Main Chart with both inventory and purchase orders */}
      <MainChart inventory={inventory} purchaseOrders={purchaseOrders} />

      {/* User Management Section */}
      <CRow className="mt-5">
        <CCol xs={12}>
          <h3>User Management</h3>
          <UserDashboard />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
