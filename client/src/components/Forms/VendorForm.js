import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CAlert,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilPhone, cilUser, cilEnvelopeClosed, cilGlobeAlt } from '@coreui/icons'

function VendorForm() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const documentFields = [
    'businessRegistrationCertificate',
    'companyProfile',
    'isoCertification',
    'authorizationCertificate',
    'complianceDeclaration',
    'productCatalog',
  ]

  return (
    <div>
      <h5 className="mb-3">Vendor Details</h5>

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

      {/* Email */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilEnvelopeClosed} />
        </CInputGroupText>
        <CFormInput
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />
      </CInputGroup>
      {errors.email && <CAlert color="danger">{errors.email.message}</CAlert>}

      {/* Website */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilGlobeAlt} />
        </CInputGroupText>
        <CFormInput placeholder="Website" {...register('website')} />
      </CInputGroup>

      {/* Registration Number */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Registration No.</CInputGroupText>
        <CFormInput placeholder="Registration Number" {...register('businessRegistrationNumber')} />
      </CInputGroup>

      {/* Business Type */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Business Type</CInputGroupText>
        <CFormSelect {...register('businessType')}>
          <option value="">Select Type</option>
          <option value="LLC">LLC</option>
          <option value="Partnership">Partnership</option>
          <option value="Sole Proprietorship">Sole Proprietorship</option>
        </CFormSelect>
      </CInputGroup>

      {/* Country of Registration */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Country</CInputGroupText>
        <CFormInput placeholder="Country of Registration" {...register('countryOfRegistration')} />
      </CInputGroup>

      {/* Year Established */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Year</CInputGroupText>
        <CFormInput
          type="number"
          placeholder="Year Established"
          {...register('yearEstablished', {
            min: { value: 1900, message: 'Year must be 1900 or later' },
            max: { value: new Date().getFullYear(), message: 'Invalid future year' },
          })}
        />
      </CInputGroup>
      {errors.yearEstablished && <CAlert color="danger">{errors.yearEstablished.message}</CAlert>}

      {/* Tax ID */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Tax ID</CInputGroupText>
        <CFormInput placeholder="Tax ID" {...register('taxId')} />
      </CInputGroup>

      {/* File Inputs for Documents */}
      <h6 className="mt-4 mb-2">Upload Documents</h6>
      {documentFields.map((doc) => (
        <CInputGroup className="mb-2" key={doc}>
          <CInputGroupText>{doc.replace(/([A-Z])/g, ' $1')}</CInputGroupText>
          <Controller
            name={`documents.${doc}`}
            control={control}
            render={({ field }) => (
              <CFormInput
                type="file"
                accept="application/pdf, image/*"
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />
        </CInputGroup>
      ))}

      {/* Terms Agreement */}
      <div className="mb-3 mt-4">
        <CFormCheck
          label={
            <>
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Terms and Conditions
              </a>
            </>
          }
          {...register('agreeToTerms', { required: 'You must agree to the Terms and Conditions' })}
        />
        {errors.agreeToTerms && <CAlert color="danger">{errors.agreeToTerms.message}</CAlert>}
      </div>

      {/* NDA Agreement */}
      <div className="mb-3">
        <CFormCheck
          label={
            <>
              I accept the{' '}
              <a
                href="/nda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Non-Disclosure Agreement (NDA)
              </a>
            </>
          }
          {...register('acceptNDA', { required: 'You must accept the NDA' })}
        />
        {errors.acceptNDA && <CAlert color="danger">{errors.acceptNDA.message}</CAlert>}
      </div>
    </div>
  )
}

export default VendorForm
