import React, { useState } from 'react'
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
import CreateContract from '../../../components/procurement/CreateContract'
import ViewContracts from '../../../components/procurement/Contract'

const ContractManagement = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Contract Management</h3>
            </CCardHeader>
            <CCardBody>
              {/* Tab Navigation */}
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                    CreateContract
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                    ViewContracts
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Tab Content */}
              <CTabContent>
                <CTabPane visible={activeTab === 0}>
                  <CreateContract />
                </CTabPane>
                <CTabPane visible={activeTab === 1}>
                  <ViewContracts />
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ContractManagement
