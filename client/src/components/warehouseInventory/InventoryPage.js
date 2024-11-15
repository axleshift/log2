import React from 'react'
import { useParams } from 'react-router-dom'

const Inventory = () => {
  const { warehouseName } = useParams()

  return (
    <div>
      <h1>{warehouseName} Inventory</h1>
    </div>
  )
}

export default Inventory
