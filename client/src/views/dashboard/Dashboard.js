import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import WidgetComponent from '../widgets/WidgetComponent'
import UserDashboard from './UserDashboard'
import MainChart from './MainChart'

const Dashboard = () => {
  const [warehouse, setWarehouse] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showUsers, setShowUsers] = useState(false)

  const navigate = useNavigate()
  const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`
  const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehouses, inventoryData] = await Promise.all([
          axios.get(WAREHOUSE_API_URL),
          axios.get(INVENTORY_API_URL),
        ])
        setWarehouse(warehouses.data)
        setInventory(inventoryData.data)
      } catch (err) {
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <CContainer fluid className="text-center mt-5">
        {/* Use inline styles for the spinner size instead of using `size="lg"` */}
        <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading dashboard...</p>
      </CContainer>
    )
  }

  return (
    <CContainer fluid className="px-5 py-4">
      <h1 className="mb-4 fw-bold">📊 Dashboard Overview</h1>

      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}

      {/* Dashboard Metrics */}
      <CRow>
        <CCol sm="12" md="6" lg="4">
          <CCard
            className="mb-4 shadow-sm hover-card interactive-card"
            onClick={() => navigate('/warehouse')}
          >
            <CCardBody>
              <CCardTitle className="fw-bold">Warehouses</CCardTitle>
              <CCardText className="fs-4">{warehouse.length} Total</CCardText>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm="12" md="6" lg="4">
          <CCard
            className="mb-4 shadow-sm hover-card interactive-card"
            onClick={() => navigate('/inventory')}
          >
            <CCardBody>
              <CCardTitle className="fw-bold">Inventory Items</CCardTitle>
              <CCardText className="fs-4">{inventory.length} Total</CCardText>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm="12" md="6" lg="4">
          <CCard
            className="mb-4 shadow-sm hover-card interactive-card"
            onClick={() => setShowUsers(!showUsers)}
          >
            <CCardBody>
              <CCardTitle className="fw-bold">User Management</CCardTitle>
              <CCardText className="fs-5">{showUsers ? 'Hide Users' : 'Show Users'}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Additional Widgets */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <WidgetComponent />
        </CCol>
      </CRow>

      {/* Interactive Chart */}
      <MainChart />

      {/* User Dashboard Toggle */}
      <CRow className="mt-5">
        <CCol xs={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="fw-bold">User Management</h3>
            <CButton
              color={showUsers ? 'danger' : 'primary'}
              onClick={() => setShowUsers(!showUsers)}
            >
              {showUsers ? 'Hide Users' : 'Show Users'}
            </CButton>
          </div>

          {showUsers && <UserDashboard />}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
