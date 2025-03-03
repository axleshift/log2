import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
} from '@coreui/react'
import RFQList from '../../../components/procurement/procurement/RFQList.js'

const RFQManagement = () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5>RFQ Management</h5>
              {loading && <CSpinner color="primary" />}
            </CCardHeader>
            <CCardBody>
              {loading ? <CAlert color="info">Loading data...</CAlert> : <RFQList />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default RFQManagement
