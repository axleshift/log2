import React from 'react'
import { SupplierContent, SupplierSidebar, SupplierFooter, SupplierHeader } from '../../../components/supplierpage/index'

const DefaultLayout = () => {
  return (
    <div>
      <SupplierSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <SupplierHeader />
        <div className="body flex-grow-1">
          <SupplierContent />
        </div>
        <SupplierFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
