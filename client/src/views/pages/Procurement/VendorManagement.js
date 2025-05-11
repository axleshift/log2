import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/react'
import Vendors from '../../../components/vendor/Vendors'

const VendorManagement = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard
            className="shadow-lg border-0"
            style={{
              borderRadius: '1rem',
            }}
          >
            <CCardHeader
              className="d-flex justify-content-between align-items-center"
              style={{
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem',
                padding: '1rem 1.5rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                letterSpacing: '0.5px',
              }}
            >
              Vendor Management
            </CCardHeader>
            <CCardBody style={{ padding: '1.5rem' }}>
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-3 fs-5">Fetching vendor data...</p>
                </div>
              ) : (
                <Vendors />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default VendorManagement
