import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { useState } from 'react'
import RFQListPage from './RFQ'
import RFQDetailsPage from './viewdetails'

const RFQManagement = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>RFQ Management</h3>
            </CCardHeader>
            <CCardBody>
              {/* Tab Navigation */}
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                    LIST PAGE
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                    DETAILS PAGE
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Tab Content */}
              <CTabContent>
                <CTabPane visible={activeTab === 0}>
                  <RFQListPage />
                </CTabPane>
                <CTabPane visible={activeTab === 1}>
                  <RFQDetailsPage />
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default RFQManagement
