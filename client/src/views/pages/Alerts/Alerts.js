import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CButton } from '@coreui/react'

const Alerts = () => {
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Alerts</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <p>Manage your system alerts here. Configure notifications and set thresholds.</p>
        <CButton color="primary">View Alerts</CButton>
      </CCardBody>
    </CCard>
  )
}

export default Alerts
