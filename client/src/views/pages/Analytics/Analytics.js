import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CButton } from '@coreui/react'

const Analytics = () => {
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Analytics</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <p>View various analytics and performance data here.</p>
        <CButton color="primary">View Analytics</CButton>
      </CCardBody>
    </CCard>
  )
}

export default Analytics
