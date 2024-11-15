import React from 'react'
import { useNavigate } from 'react-router-dom'
import Inventory from '../../views/inventory/WHInventory/WH1'

const WarehouseIInventory = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div>
      <h1>Warehouse I Inventory</h1>
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>
        Back
      </button>
      <Inventory warehouse="Warehouse I" />
    </div>
  )
}

export default WarehouseIInventory
