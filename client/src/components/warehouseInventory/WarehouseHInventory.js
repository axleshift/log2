import React from 'react'
import { useNavigate } from 'react-router-dom'
import Inventory from '../../views/inventory/WHInventory/WH1'

const WarehouseHInventory = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div>
      <h1>Warehouse H Inventory</h1>
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>
        Back
      </button>
      <Inventory warehouse="Warehouse H" />
    </div>
  )
}

export default WarehouseHInventory
