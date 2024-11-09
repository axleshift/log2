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
import { faShip, faRoute, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

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
                  icon={faUser}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Real Time Customer Service</h3>
              <p>
                Experience unparalleled support with our real-time customer service, available 24/7
                to address inquiries and resolve issues. Enhance customer satisfaction through
                prompt and efficient communication.
              </p>
            </CCol>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faUserShield}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Advanced Cybersecurity Measures</h3>
              <p>
                Protect your data with state-of-the-art cybersecurity solutions designed to
                safeguard your information against evolving threats. Our proactive approach ensures
                compliance and minimizes risks.
              </p>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Services
