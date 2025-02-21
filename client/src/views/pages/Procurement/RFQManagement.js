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
import ProcurementList from '../../../components/procurement/procurement/ProcureList.js'

const RFQManagement = () => {
  const [activeTab, setActiveTab] = useState('ProcurementList')
  const [loading, setLoading] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setLoading(true)

    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <CButton
                  color={activeTab === 'ProcurementList' ? 'primary' : 'secondary'}
                  onClick={() => handleTabChange('ProcurementList')}
                  className="ms-2"
                  active={activeTab === 'ProcurementList'}
                  style={{
                    transition: 'all 0.3s ease',
                    boxShadow:
                      activeTab === 'ProcurementList' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                >
                  Procurement List
                </CButton>
                <CButton
                  color={activeTab === 'rfqList' ? 'primary' : 'secondary'}
                  onClick={() => handleTabChange('rfqList')}
                  className="ms-2"
                  active={activeTab === 'rfqList'}
                  style={{
                    transition: 'all 0.3s ease',
                    boxShadow: activeTab === 'rfqList' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                >
                  RFQ List
                </CButton>
              </div>
              <div>{loading && <CSpinner color="primary" />}</div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <CAlert color="info">Loading data...</CAlert>
              ) : (
                <>
                  {activeTab === 'ProcurementList' && <ProcurementList />}
                  {activeTab === 'rfqList' && <RFQList />}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default RFQManagement
