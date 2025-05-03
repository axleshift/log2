import React, { useState } from 'react'
import {
  CContainer,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButtonGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilLocationPin } from '@coreui/icons'
import ShipmentDeliveryForm from '../../../components/Forms/ShipmentForm/'
import DeliveryTracking from '../../../components/procurement/tracking/Tracking.js'

const ShipmentsAndTracking = () => {
  const [activeTab, setActiveTab] = useState('ShipmentDeliveryForm')

  return (
    <CContainer fluid>
      <CRow className="justify-content-center mt-4">
        <CCol lg={10}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="d-flex justify-content-start gap-2">
              <CButton
                color={activeTab === 'ShipmentDeliveryForm' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('ShipmentDeliveryForm')}
                variant="outline"
              >
                <CIcon icon={cilTruck} className="me-2" />
                Shipment Delivery
              </CButton>
              <CButton
                color={activeTab === 'deliveryTracking' ? 'danger' : 'secondary'}
                onClick={() => setActiveTab('deliveryTracking')}
                variant="outline"
              >
                <CIcon icon={cilLocationPin} className="me-2" />
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
