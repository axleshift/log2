import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">© CAPSTONE {currentYear} All rights reserved</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"> Cluster L: </span>
        <p>Logistics 2: Inventory Management</p>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
