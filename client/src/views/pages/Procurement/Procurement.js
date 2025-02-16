import React from 'react'
import { useState } from 'react'
import { CContainer, CButton, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import CreateRFQ from '../../../components/procurement/RFQ/CreateRFQ.js'
import RFQList from '../../../components/procurement/RFQ/ListPage.js'

const MainProcurement = () => {
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
                className="ms-2"
              >
                Create RFQ
              </CButton>
              <CButton
                color={activeTab === 'rfqList' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('rfqList')}
                className="ms-2"
              >
                RFQList
              </CButton>
            </CCardHeader>
            <CCardBody>{activeTab === 'createRFQ' ? <CreateRFQ /> : <RFQList />}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default MainProcurement
