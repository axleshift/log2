import React from 'react'
import { useState } from 'react'
import { CContainer, CButton, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import ShipmentDeliveryForm from '../../../components/Forms/ShipmentForm/'
import DeliveryTracking from '../../../components/procurement/tracking/Tracking.js'

const ShipmentsAndTracking = () => {
  const [activeTab, setActiveTab] = useState('ShipmentDeliveryForm')

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CButton
                color={activeTab === 'ShipmentDeliveryForm' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('ShipmentDeliveryForm')}
                className="ms-2"
              >
                ShipmentDeliveryForm
              </CButton>
              <CButton
                color={activeTab === 'deliveryTracking' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('deliveryTracking')}
                className="ms-2"
              >
                Delivery Tracking
              </CButton>
            </CCardHeader>
            <CCardBody>
              {activeTab === 'ShipmentDeliveryForm' ? (
                <ShipmentDeliveryForm />
              ) : (
                <DeliveryTracking />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ShipmentsAndTracking
