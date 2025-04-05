import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CSpinner, CWidgetStatsA } from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import UserDashboard from './UserDashboard'
import MainChart from './MainChart'

const Dashboard = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const BASE_URL = import.meta.env.VITE_API_URL
  const PO_API_URL = `${BASE_URL}/api/v1/purchaseOrder`
  const INVENTORY_API_URL = `${BASE_URL}/api/v1/inventory`

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
            onClick={() => navigate('/procurement/po-payments')}
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
        <CCol xs={12}></CCol>
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
