import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="">
          CAPSTONE
        </a>
        <span className="ms-1"></span>
      </div>
      <div className="ms-auto">
        <span className="me-1"> Cluster L: </span>
        <a href= "">
          Logistics 2: Inventory Management
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
