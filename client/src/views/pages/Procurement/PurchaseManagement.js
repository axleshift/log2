import React from 'react'
import PurchaseOrderList from '../../../components/procurement/POList'

const PurchaseManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CreatePurchaseOrder</h1>
      <PurchaseOrderList />
    </div>
  )
}

export default PurchaseManagement
