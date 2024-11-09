import React from 'react'
import { CContainer, CRow, CCol, CImage } from '@coreui/react'

const About = () => {
  return (
    <CContainer fluid className="h-100 p-5 bg-primary shadow" data-aos="fade-up">
      <CRow className="h-100 justify-content-start align-items-center">
        <CCol xs={12} md={5} className="mb-4" data-aos="zoom-in">
          <CImage fluid src="/image/about.svg" />
        </CCol>
        <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2">
          <span className="text-white" data-aos="zoom-out-up">
            ABOUT US
          </span>
          <h1 className="text-white" data-aos="zoom-out-up">
            Axleshift Logistics 2
          </h1>
          <p className="lead text-white" data-aos="zoom-out-up">
            Welcome to our Freight Management System – an advanced vendor portal designed to
            streamline logistics with robust document tracking, automated alerts, real-time
            analytics, and custom reporting. Our platform empowers businesses to manage freight
            operations more efficiently, ensuring seamless collaboration, enhanced visibility, and
            informed decision-making every step of the way.
          </p>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default About
