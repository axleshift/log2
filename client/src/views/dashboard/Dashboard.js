import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CSpinner } from '@coreui/react'
import axios from 'axios'
import { CWidgetStatsA } from '@coreui/react'
import WidgetComponent from '../widgets/WidgetComponent'

const Dashboard = () => {
  const [warehouse, setWarehouse] = useState([])
  const [inventoryCount, setInventoryCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

  useEffect(() => {
    axios
      .get(WAREHOUSE_API_URL)
      .then((response) => {
        const fetchedWarehouses = response.data
        setWarehouse(fetchedWarehouses)
        setInventoryCount(
          fetchedWarehouses.reduce(
            (acc, warehouse) =>
              acc + (Array.isArray(warehouse.inventory) ? warehouse.inventory.length : 0),
            0,
          ),
        )
        setLoading(false)
      })
      .catch((error) => {
        setError('There was an error fetching warehouses!')
        setLoading(false)
      })
  }, [WAREHOUSE_API_URL])

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
            onClick={() => alert('Redirect to warehouse details')}
            style={{ cursor: 'pointer', padding: '3rem' }}
          />
        </CCol>

        {/* Widget for Inventory Items */}
        <CCol sm="12" md="6" lg="4">
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={inventoryCount}
            title="Inventory Items"
            icon={<i className="cil-cube" />}
            onClick={() => alert('Redirect to inventory details')}
            style={{ cursor: 'pointer', padding: '3rem' }}
          />
        </CCol>
      </CRow>

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
