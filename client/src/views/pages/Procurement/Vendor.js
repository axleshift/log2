import React from 'react'
import { useState } from 'react'
import { CContainer, CButton, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import VendorManagement from '../../../components/procurement/Vendor/Vendor'
import VendorProfile from '../../../components/procurement/Vendor/VendorRate'

const Vendors = () => {
  const [activeTab, setActiveTab] = useState('vendorManagement')

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CButton
                color={activeTab === 'vendorManagement' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('vendorManagement')}
                className="ms-2"
              >
                Vendor Management
              </CButton>
              <CButton
                color={activeTab === 'vendorProfile' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('vendorProfile')}
                className="ms-2"
              >
                Vendor Profile
              </CButton>
            </CCardHeader>
            <CCardBody>
              {activeTab === 'vendorManagement' ? <VendorManagement /> : <VendorProfile />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Vendors
