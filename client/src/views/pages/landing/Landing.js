import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CSpinner,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
  CImage,
} from '@coreui/react'
import AOS from 'aos'

import { Navbar, Services, About, Team, Footer } from '../../../components/landingPage/index'

const Landing = () => {
  AOS.init()
  const [loading, setLoading] = useState(false)

  // Carousel images
  const images = [
    { src: '/image/Freight-Land.jpg', caption: ' Land Freight' },
    { src: '/image/Freight-Sea.jpg', caption: ' Sea Freight' },
    { src: '/image/Freight-Air.png', caption: 'Air Freight' },
  ]

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <div className="body flex-grow-1">
        {loading && (
          <div className="loading-overlay">
            <CSpinner color="primary" variant="grow" />
          </div>
        )}

        <div className="landing-page">
          <CContainer fluid className="h-100">
            <CCarousel indicators dark interval={3000}>
              {images.map((image, index) => (
                <CCarouselItem key={index}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100vh',
                    }}
                  >
                    <CImage
                      className="d-block w-100"
                      src={image.src}
                      alt={`Slide ${index + 1}`}
                      style={{
                        maxHeight: '100vh',
                        objectFit: 'cover',
                        opacity: 0.6,
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    ></div>
                    <CCarouselCaption>
                      <h5>{image.caption}</h5>
                    </CCarouselCaption>
                  </div>
                </CCarouselItem>
              ))}
            </CCarousel>
          </CContainer>

          <CContainer
            fluid
            className="h-100"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              color: 'white',
            }}
          >
            <Navbar />
            <CRow className="h-100 justify-content-center align-items-center">
              <CCol xs={12} md={6} className="px-4 mx-0 mx-md-4 text-center">
                <h3
                  className="display-6 text-white"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  style={{ fontSize: '2.5rem' }}
                >
                  Where Freight Meets Efficiency
                </h3>
                <p
                  className="lead text-white"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  style={{ fontSize: '1.5rem' }}
                >
                  Our Freight Management System empowers vendors with a seamless portal featuring
                  advanced document tracking, automated alerts, real-time analytics, and
                  customizable reporting for streamlined logistics and optimized performance.
                </p>
                <CButton
                  to="/register"
                  as={NavLink}
                  className="rounded-1 btn-warning fs-6 px-5"
                  data-aos="fade-down"
                  data-aos-duration="1000"
                  style={{ width: '100%', maxWidth: '250px' }}
                >
                  Register now
                </CButton>
              </CCol>
            </CRow>
          </CContainer>
        </div>

        <Services />
        <About />
        <Team />
        <Footer />
      </div>
    </div>
  )
}

export default Landing
