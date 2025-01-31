import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import axios from 'axios'
import { CWidgetStatsA } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import WidgetComponent from '../widgets/WidgetComponent'
import UserDashboard from './UserDashboard'
import MainChart from './MainChart'

const Dashboard = () => {
  const [warehouse, setWarehouse] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`
  const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

  const navigate = useNavigate()

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
  }, [WAREHOUSE_API_URL, INVENTORY_API_URL])

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

      {/* Warehouses and Inventory Widgets */}
      <CRow>
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={warehouse.length}
            title="Warehouses"
            icon={<i className="cil-building" />}
            onClick={() => navigate('/warehouse')}
            style={{ cursor: 'pointer', padding: '3rem' }}
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

      {/* Other Widgets */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <WidgetComponent />
        </CCol>
      </CRow>
      <MainChart />
      {/* User Dashboard Table */}
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
