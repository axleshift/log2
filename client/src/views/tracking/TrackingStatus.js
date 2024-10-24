import React from 'react'
import {
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CBadge,
  CContainer,
  CHeader,
  CButton,
  CCardHeader,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css' // CoreUI CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTruck,
  faBoxOpen,
  faShippingFast,
  faCheckCircle,
  faFileInvoice,
} from '@fortawesome/free-solid-svg-icons'

import './tracking.scss'

const TrackingStatus = () => {
  const orderHistory = [
    {
      date: '22 Oct 2024 13:20:33',
      status: 'Delivered',
      location: ' Parcel has been delivered Recipient: Ma.Angelica Olavidez ',
      delivered: true,
    },
    {
      date: '22 Oct 2024 08:19:04',
      status: 'In Transit',
      location: ' Parcel is out for delivery. Rider: Rona',
      delivered: false,
    },
    {
      date: '22 07:44:20',
      status: 'In Transit',
      location: ' Your parcel has arrived at the delivery hub : Mid QC Hub',
      delivered: false,
    },
    {
      date: '21 Oct 2024 23:23:47',
      status: 'In Transit',
      location: 'Parcel has arrived and to be received by the delivery hub',
      delivered: false,
    },
    {
      date: '19 Oct 2024 14:31:21',
      status: 'In Transit',
      location: ' Parcel has arrived at sorting facility',
      delivered: false,
    },
    {
      date: '19 Oct 2024 21:53:42',
      status: 'Created',
      location: ' Order has been created',
      delivered: false,
    },
  ]

  const steps = [
    { label: 'Order Created', icon: faFileInvoice },
    { label: 'Picked Up', icon: faTruck },
    { label: 'Sorting', icon: faBoxOpen },
    { label: 'Courier Delivery', icon: faShippingFast },
    { label: 'Delivered', icon: faCheckCircle },
  ]

  const currentStep = 4 // Example of completed steps.

  return (
    <CContainer fluid>
      {/* Tracking Timeline */}
      <CHeader style={{ marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="Tracking Number"
          style={{
            width: '300px',
            height: '45px',
            fontSize: '18px',
            padding: '10px',
          }}
        />
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary">TRACK NUMBER</CButton>
        </div>
      </CHeader>
      <div className="tracking-timeline">
        <CRow className="text-center mb-4">
          {steps.map((step, index) => (
            <CCol key={index}>
              <div className={`timeline-step ${index <= currentStep ? 'active' : ''}`}>
                <FontAwesomeIcon icon={step.icon} className="timeline-icon" />
                <div>{step.label}</div>
              </div>
            </CCol>
          ))}
        </CRow>
      </div>

      <CRow>
        {/* Package Information */}
        <CCol md="4">
          <div className="package-info p-3 mb-4 bg-light rounded">
            <h5>Package Information</h5>
            <p>
              <strong>Tracking Number:</strong> <span className="text-danger">PH247296860339A</span>
            </p>
            <p>
              <strong>Recipient Name:</strong>{' '}
              <span className="text-danger">Ma.Angelica Olavidez</span>
            </p>
            <p>
              <strong>Tel Number:</strong> +639518941731
            </p>
          </div>
        </CCol>

        {/* Order Tracking History */}
        <CCol md="8">
          <h5>Delivered</h5>
          <CListGroup>
            {orderHistory.map((entry, index) => (
              <CListGroupItem
                key={index}
                className="d-flex justify-content-between align-items-start"
              >
                <CRow>
                  <CCol md="3">
                    <strong>{entry.date}</strong>
                  </CCol>
                  <CCol md="9">
                    <div>{entry.location}</div>
                  </CCol>
                </CRow>
                {entry.delivered && (
                  <CBadge color="success" shape="rounded-pill">
                    Delivered
                  </CBadge>
                )}
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TrackingStatus
