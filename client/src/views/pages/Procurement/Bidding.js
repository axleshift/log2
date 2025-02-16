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
import PublishBid from '../../../components/procurement/Bid/PublishBid'
import SubmitBid from '../../../components/procurement/Bid/Submit'
import EvaluateBid from '../../../components/procurement/Bid/Evaluate'
import AwardBid from '../../../components/procurement/Bid/Award'

const BiddingManagement = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Bidding Management</h3>
            </CCardHeader>
            <CCardBody>
              {/* Tab Navigation */}
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                    PublishBid
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                    SubmitBid
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
                    EvaluateBid
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
                    AwardBid
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Tab Content */}
              <CTabContent>
                <CTabPane visible={activeTab === 0}>
                  <PublishBid />
                </CTabPane>
                <CTabPane visible={activeTab === 1}>
                  <SubmitBid />
                </CTabPane>
                <CTabPane visible={activeTab === 2}>
                  <EvaluateBid />
                </CTabPane>
                <CTabPane visible={activeTab === 3}>
                  <AwardBid />
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default BiddingManagement
