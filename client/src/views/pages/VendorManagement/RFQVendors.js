import React from 'react'
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import SubmitQuoteForm from '../../../components/procurement/Vendor/List'

const RFQVendorManagement = () => {
  const navigate = useNavigate()

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>RFQ Vendors Management</h5>
          <CButton color="primary" onClick={() => navigate('/procurement/rfqs')}>
            View RFQs
          </CButton>
        </CCardHeader>
        <CCardBody>
          {/* Here you can render the components for managing RFQs and vendor interactions */}
          <SubmitQuoteForm />
          {/* Add other components here */}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default RFQVendorManagement
