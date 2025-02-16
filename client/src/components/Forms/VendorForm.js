import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CInputGroup, CInputGroupText, CFormInput, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilPhone, cilUser } from '@coreui/icons'

function VendorForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div>
      <h5>Vendor Details</h5>

      {/* Business Name */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilHome} />
        </CInputGroupText>
        <CFormInput
          placeholder="Business Name"
          {...register('businessName', { required: 'Business Name is required' })}
        />
      </CInputGroup>
      {errors.businessName && <CAlert color="danger">{errors.businessName.message}</CAlert>}

      {/* Full Name */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormInput
          placeholder="Full Name"
          {...register('fullName', { required: 'Full Name is required' })}
        />
      </CInputGroup>
      {errors.fullName && <CAlert color="danger">{errors.fullName.message}</CAlert>}

      {/* Business Address */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Address</CInputGroupText>
        <CFormInput
          placeholder="Business Address"
          {...register('businessAddress', { required: 'Business Address is required' })}
        />
      </CInputGroup>
      {errors.businessAddress && <CAlert color="danger">{errors.businessAddress.message}</CAlert>}

      {/* Contact Number */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilPhone} />
        </CInputGroupText>
        <CFormInput
          placeholder="Contact Number"
          {...register('contactNumber', { required: 'Contact Number is required' })}
        />
      </CInputGroup>
      {errors.contactNumber && <CAlert color="danger">{errors.contactNumber.message}</CAlert>}

      {/* Certifications */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Certifications</CInputGroupText>
        <CFormInput placeholder="Comma separated certifications" {...register('certifications')} />
      </CInputGroup>

      {/* Tax ID */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Tax ID</CInputGroupText>
        <CFormInput placeholder="Tax ID" {...register('taxId')} />
      </CInputGroup>
    </div>
  )
}

export default VendorForm
