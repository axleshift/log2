import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardFooter } from '@coreui/react'
import { Link } from 'react-router-dom'

// Sample logistics data
const initialLogistics = [
  {
    incomingShipment: {
      tracking_id: '12345',
      current_location: 'Warehouse 1',
      date_time_release: new Date(),
      estimated_arrival: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      courier: 'FedEx',
    },
    outgoingShipment: {
      tracking_id: '67890',
      next_destination: 'Warehouse 2',
      estimated_time: '1 day',
      courier: 'DHL',
    },
  },
]

// Logistics Monitor Component
const LogisticsMonitor = () => {
  const [logistics, setLogistics] = useState(initialLogistics)

  if (logistics.length === 0) {
    return <p>No logistics data available.</p>
  }

  return (
    <CRow>
      {logistics.map((entry, index) => {
        const { incomingShipment, outgoingShipment } = entry

        return (
          <CCol sm="12" key={index}>
            <CRow>
              {/* Incoming Shipment Card */}
              <CCol sm="6" className="mb-4">
                <CCard>
                  <CCardHeader>
                    <h5>Incoming Shipment</h5>
                  </CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>Tracking ID:</strong> {incomingShipment.tracking_id}
                    </p>
                    <p>
                      <strong>Currently at:</strong> {incomingShipment.current_location}
                    </p>
                    <p>
                      <strong>Estimated Arrival:</strong>{' '}
                      {incomingShipment.estimated_arrival.toLocaleString()}
                    </p>
                    <p>
                      <strong>Courier:</strong> {incomingShipment.courier}
                    </p>
                  </CCardBody>
                  <CCardFooter>
                    <Link to={`/incoming`}>
                      <CButton color="primary">View Incoming Details</CButton>
                    </Link>
                  </CCardFooter>
                </CCard>
              </CCol>

              {/* Outgoing Shipment Card */}
              <CCol sm="6" className="mb-4">
                <CCard>
                  <CCardHeader>
                    <h5>Outgoing Shipment</h5>
                  </CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>Tracking ID:</strong> {outgoingShipment.tracking_id}
                    </p>
                    <p>
                      <strong>Next Destination:</strong> {outgoingShipment.next_destination}
                    </p>
                    <p>
                      <strong>Estimated Time:</strong> {outgoingShipment.estimated_time}
                    </p>
                    <p>
                      <strong>Courier:</strong> {outgoingShipment.courier}
                    </p>
                  </CCardBody>
                  <CCardFooter>
                    <Link to={`/outgoing`}>
                      <CButton color="primary">View Outgoing Details</CButton>
                    </Link>
                  </CCardFooter>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        )
      })}
    </CRow>
  )
}

export default LogisticsMonitor
