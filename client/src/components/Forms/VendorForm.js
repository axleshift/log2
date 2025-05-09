import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormCheck,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilPhone, cilUser, cilEnvelopeClosed, cilGlobeAlt } from '@coreui/icons'

function VendorForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const documentFields = [
    'businessRegistrationCertificate',
    'taxClearanceCertificate',
    'financialStatements',
    'insuranceCertificate',
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

      {/* VAT Number */}
      <CInputGroup className="mb-3">
        <CInputGroupText>VAT</CInputGroupText>
        <CFormInput placeholder="VAT Number" {...register('vatNumber')} />
      </CInputGroup>

      {/* Certifications */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Certifications</CInputGroupText>
        <CFormInput placeholder="Comma-separated certifications" {...register('certifications')} />
      </CInputGroup>

      {/* Categories */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Categories</CInputGroupText>
        <CFormInput placeholder="Comma-separated categories" {...register('categories')} />
      </CInputGroup>

      {/* Authorized Dealer */}
      <CFormCheck className="mb-3" label="Authorized Dealer" {...register('authorizedDealer')} />

      {/* Banking Info */}
      <h6 className="mt-4 mb-2">Banking Information</h6>
      <CInputGroup className="mb-3">
        <CInputGroupText>Bank</CInputGroupText>
        <CFormInput placeholder="Bank Name" {...register('bankingInfo.bankName')} />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText>Account #</CInputGroupText>
        <CFormInput placeholder="Account Number" {...register('bankingInfo.bankAccountNumber')} />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText>SWIFT</CInputGroupText>
        <CFormInput placeholder="SWIFT Code" {...register('bankingInfo.bankSwiftCode')} />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText>Bank Country</CInputGroupText>
        <CFormInput placeholder="Bank Country" {...register('bankingInfo.bankCountry')} />
      </CInputGroup>

      {/* Documents (URLs) */}
      <h6 className="mt-4 mb-2">Documents (URLs)</h6>
      {documentFields.map((doc) => (
        <CInputGroup className="mb-2" key={doc}>
          <CInputGroupText>{doc.replace(/([A-Z])/g, ' $1')}</CInputGroupText>
          <CFormInput placeholder={`URL for ${doc}`} {...register(`documents.${doc}`)} />
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
          {...register('acceptTerms', { required: 'You must agree to the Terms and Conditions' })}
        />
        {errors.acceptTerms && <CAlert color="danger">{errors.acceptTerms.message}</CAlert>}
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
