import React, { useState } from 'react'
import CreatePurchaseOrder from '../../../components/procurement/CreatePurchaseOrder'
import PurchaseOrderList from '../../../components/procurement/POList'

const PurchaseManagement = () => {
  const [isCreating, setIsCreating] = useState(false)

  const toggleCreateOrder = () => {
    setIsCreating(!isCreating)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Order Management</h1>

      <div className="mb-4">
        <button
          onClick={toggleCreateOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          {isCreating ? 'View Purchase Orders' : 'Create New Purchase Order'}
        </button>
      </div>

      {isCreating ? <CreatePurchaseOrder /> : <PurchaseOrderList />}
    </div>
  )
}

export default PurchaseManagement
