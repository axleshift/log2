import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CButton } from '@coreui/react'

const DocumentTracking = () => {
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Document Tracking</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <p>Track your documents and shipments here.</p>
        <CButton color="primary">Track Documents</CButton>
      </CCardBody>
    </CCard>
  )
}

export default DocumentTracking
