import React from 'react'
import { CFooter } from '@coreui/react'

const SupplierFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4">
      <div>
        <a href="">CAPSTONE</a>
        <span className="ms-1">© {currentYear} All rights reserved</span> {/* Copyright text */}
      </div>
      <div className="ms-auto">
        <span className="me-1">Cluster L:</span>
        <a href="">Logistics 2: Inventory Management</a>
      </div>
    </CFooter>
  )
}

export default React.memo(SupplierFooter)
