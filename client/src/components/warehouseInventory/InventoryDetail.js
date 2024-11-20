import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner, CAlert, CButton } from '@coreui/react'
import axios from 'axios'
import InventoryItem from './InventoryItem'

const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const InventoryDetail = () => {
  const { warehouse_id } = useParams()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Handle updating an inventory item
  const handleUpdateItem = (updatedItem) => {
    setInventory((prevItems) =>
      prevItems.map((item) => (item.tracking_id === updatedItem.tracking_id ? updatedItem : item)),
    )
  }

  useEffect(() => {
    const fetchInventoryByWarehouse = async () => {
      if (!warehouse_id) {
        setError('Invalid warehouse ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch the inventory linked to the warehouse
        const response = await axios.get(`${WAREHOUSE_API_URL}/${warehouse_id}/inventory`)
        const inventoryData = response.data

        if (inventoryData.length === 0) {
          setError('No inventory linked to this warehouse.')
        } else {
          setInventory(inventoryData)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load inventory. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryByWarehouse()
  }, [warehouse_id])

  if (loading) {
    return (
      <CContainer>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">{error}</CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer>
      <CButton color="secondary" onClick={() => navigate(-1)} className="mb-3">
        Back
      </CButton>
      <h1>Inventory for Warehouse {warehouse_id}</h1>
      {inventory.length > 0 ? (
        inventory.map((item) => (
          <InventoryItem key={item.tracking_id} item={item} onUpdateItem={handleUpdateItem} />
        ))
      ) : (
        <CAlert color="info">No inventory available for this warehouse</CAlert>
      )}
    </CContainer>
  )
}

export default InventoryDetail
