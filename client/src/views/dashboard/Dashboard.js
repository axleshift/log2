import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CSpinner, CAlert } from '@coreui/react'
import axios from 'axios'
import { CWidgetStatsA } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import WidgetComponent from '../widgets/WidgetComponent'

const Dashboard = () => {
  const [warehouse, setWarehouse] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`
  const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(WAREHOUSE_API_URL)
      .then((response) => {
        const fetchedWarehouses = response.data
        setWarehouse(fetchedWarehouses)
      })
      .catch((error) => {
        setError('There was an error fetching warehouses!')
      })

    axios
      .get(INVENTORY_API_URL)
      .then((response) => {
        const fetchedInventory = response.data
        setInventory(fetchedInventory)
        setLoading(false)
      })
      .catch((error) => {
        setError('There was an error fetching inventory!')
        setLoading(false)
      })
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

      <CRow>
        {/* Widget for Warehouses */}
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={warehouse.length}
            title="Warehouses"
            icon={<i className="cil-building" />}
            onClick={() => {
              navigate('/warehouse')
              setSuccessMessage('Redirecting to warehouse details')
            }}
            style={{ cursor: 'pointer', padding: '3rem' }}
          />
        </CCol>

        {/* Widget for Inventory Items */}
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={inventory.length}
            title="Inventory Items"
            icon={<i className="cil-cube" />}
            onClick={() => {
              navigate('/inventory')
              setSuccessMessage('Redirecting to inventory details')
            }}
            style={{ cursor: 'pointer', padding: '3rem' }}
          />
        </CCol>
      </CRow>

      {/* Success Message Display */}
      {successMessage && (
        <CAlert color="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </CAlert>
      )}

      {/* Widget Section for Incoming and Outgoing Shipments */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <WidgetComponent />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
