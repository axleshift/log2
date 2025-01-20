import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CContainer,
  CRow,
  CCol,
  CButton,
  CSpinner,
} from '@coreui/react'
import AOS from 'aos'

import {
  Navbar,
  Services,
  About,
  Bid,
  Newsletter,
  Footer,
  Opportunities,
} from '../components/landing/index'

const Landing = () => {
  AOS.init()
  const [loading, setLoading] = useState(false)
  // TODO: replace this with your own background images max 1080p <1MB
  const images = ['image/Freight-Land.jpg', 'image/Freight-Sea.jpg', 'image/Freight-Air.png']

  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    const randomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length)
      setBackgroundImage(images[randomIndex])
    }

    randomImage()
  }, [])

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <div className="body flex-grow-1">
        {loading && (
          <div className="loading-overlay">
            <CSpinner color="primary" variant="grow" />
          </div>
        )}
        <div className="landing-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <CContainer fluid className="h-100">
            <Navbar />
            <CRow className="h-100 justify-content-start align-items-center">
              <CCol xs={12} md={6} className="px-4 mx-0 mx-md-4">
                <h1 className="display-6 text-white" data-aos="fade-right" data-aos-duration="1000">
                  Where Freight Meets Efficiency
                </h1>
                <p className="lead text-white" data-aos="fade-up" data-aos-duration="1000">
                  Our cutting-edge platform empowers businesses to improve their shipping
                  strategies. Experience optimized routing without the complexities of tracking.
                </p>
                <CButton
                  to="/register"
                  as={NavLink}
                  className="rounded-1 btn-warning fs-6 px-5"
                  data-aos="fade-down"
                  data-aos-duration="1000"
                >
                  Register now
                </CButton>
              </CCol>
            </CRow>
          </CContainer>
        </div>

        <Services />
        <About />
        <Bid />
        <Opportunities />
        <Newsletter setLoading={setLoading} />

        <Footer />
      </div>
    </div>
  )
}

export default Landing
