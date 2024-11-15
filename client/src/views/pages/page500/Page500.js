import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

const Page500 = () => {
  const handleBackToHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <CContainer className="text-center">
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <div className="mb-4">
              <h1 className="display-1 fw-bold text-danger">500</h1>
              <h2 className="pt-3">Uh-oh! Something went wrong.</h2>
              <p className="lead text-muted">
                We&apos;re experiencing technical difficulties. Please try again later or contact
                support.
              </p>
            </div>
            <CInputGroup className="mb-4">
              <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} aria-label="Search Icon" />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="What are you looking for?"
                aria-label="Search Input"
              />
              <CButton color="primary" className="ms-2" aria-label="Search Button">
                Search
              </CButton>
            </CInputGroup>
            <p className="text-muted">
              You can also{' '}
              <a href="/" className="text-primary fw-bold">
                return to the Homepage
              </a>{' '}
              or try navigating back.
            </p>
            <CButton color="secondary" className="mt-3" onClick={() => window.history.back()}>
              Go Back
            </CButton>
            <CButton color="primary" className="mt-3 ms-3" onClick={handleBackToHome}>
              Go to Homepage
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500

{
  /*** theme is missing need to fix*/
}
