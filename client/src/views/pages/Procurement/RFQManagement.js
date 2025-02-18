import React, { useState } from 'react'
import {
  CContainer,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CreateRFQ from '../../../components/procurement/RFQ/CreateRFQ.js'
import RFQList from '../../../components/procurement/RFQ/ListPage.js'

const RFQManagement = () => {
  const [activeTab, setActiveTab] = useState('createRFQ')

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CButton
                color={activeTab === 'createRFQ' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('createRFQ')}
                className={`ms-2 ${activeTab === 'createRFQ' ? 'active-tab' : ''}`}
                style={{ transition: 'all 0.3s ease' }}
              >
                Create RFQ
              </CButton>
              <CButton
                color={activeTab === 'rfqList' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('rfqList')}
                className={`ms-2 ${activeTab === 'rfqList' ? 'active-tab' : ''}`}
                style={{ transition: 'all 0.3s ease' }}
              >
                RFQ List
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTabContent>
                <CTabPane visible={activeTab === 'createRFQ'}>
                  <CreateRFQ />
                </CTabPane>
                <CTabPane visible={activeTab === 'rfqList'}>
                  <RFQList />
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
