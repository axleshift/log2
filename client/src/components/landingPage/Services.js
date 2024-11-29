import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardBody,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShip,
  faRoute,
  faUser,
  faUserShield,
  faPaperPlane,
  faBell,
} from '@fortawesome/free-solid-svg-icons'

const Services = () => {
  return (
    <CContainer fluid className="h-100">
      <CRow className="h-100 justify-content-center align-items-center p-5">
        <CCol xs={12} lg={5} className="order-md-1 mb-4">
          <span data-aos="fade-up">
            <h1>OUR SERVICES</h1>
          </span>

          <p className="lead" data-aos="fade-up">
            Our Freight Management System offers a robust Vendor Portal with advanced document
            tracking, automated alerts, real-time analytics, and customizable reporting, empowering
            you to streamline operations and make data-driven decisions with ease.
          </p>
        </CCol>
        <CCol xs={12} lg={7} className="order-md-2 mb-4">
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faShip}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Freight Management</h3>
              <p>
                Optimize your logistics with our comprehensive freight management solutions,
                ensuring timely and cost-effective deliveries. Monitor shipments in real-time to
                enhance visibility and efficiency.
              </p>
            </CCol>

            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faPaperPlane}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Document Tracking</h3>
              <p>
                Track all essential documents related to freight management with our Advanced
                Document Tracking system. Every document, from invoices to shipping manifests, can
                be tracked, ensuring compliance, reducing errors, and improving the overall
                workflow.
              </p>
            </CCol>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faBell}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Automated Alerts</h3>
              <p>
                Stay ahead of any potential delays or issues with Automated Alerts that notify
                vendors about important updates related to their shipments. Whether it’s a delay, a
                status update, or a new document ready for review, our alert system keeps you
                informed at all times.
              </p>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Services
