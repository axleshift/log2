import React from 'react'
import CreateProcurement from '../../../components/procurement/procurement/CreateProcurement'

const ProcurementPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🛒 Procurement Request</h1>
      <CreateProcurement />
    </div>
  )
}

export default ProcurementPage
