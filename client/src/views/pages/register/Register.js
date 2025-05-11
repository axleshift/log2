import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import OTPVerification from '../../../components/Forms/OtpForm.js'
import VendorForm from '../../../components/Forms/VendorForm.js'
import Cookies from 'js-cookie'

function Register() {
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`
  const methods = useForm()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = methods
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [email, setEmail] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const selectedRole = watch('role', 'user')

  const registerUser = async (data) => {
    try {
      const response = await fetch(`${USER_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Registration failed. Please try again.')
      }
      return response.json()
    } catch (error) {
      throw new Error(error.message || 'Something went wrong.')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const email = data.email || ''
      if (!email) {
        throw new Error('Email verification is required.')
      }

      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('email', email)
      formData.append('password', data.password)
      formData.append('role', data.role || 'user')

      // Vendor details
      if (data.role === 'vendor') {
        formData.append('businessName', data.businessName)
        formData.append('fullName', data.fullName)
        formData.append('businessAddress', data.businessAddress)
        formData.append('contactNumber', data.contactNumber)
        formData.append('taxId', data.taxId)
        formData.append('website', data.website)
        formData.append('businessType', data.businessType)
        formData.append('countryOfRegistration', data.countryOfRegistration)
        formData.append('yearEstablished', data.yearEstablished)
        formData.append('agreeToTerms', data.agreeToTerms ? 'true' : 'false')
        formData.append('acceptNDA', data.acceptNDA ? 'true' : 'false')

        // Handle documents
        const docFields = [
          'businessRegistrationCertificate',
          'companyProfile',
          'isoCertification',
          'authorizationCertificate',
          'complianceDeclaration',
          'productCatalog',
        ]

        docFields.forEach((field) => {
          const file = data.documents?.[field]?.[0]
          if (file) formData.append(field, file)
        })
      }

      const response = await fetch(`${USER_API_URL}/register/vendor`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Registration failed. Please try again.')
      }

      const responseData = await response.json()

      Cookies.set('token', responseData.accessToken, { expires: 1 })
      Cookies.set('refreshToken', responseData.refreshToken, { expires: 30 })

      setNotification({ message: 'Registration Successful! Redirecting...', type: 'success' })

      reset()
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {!otpVerified ? (
                  <OTPVerification
                    email={email}
                    setEmail={setEmail}
                    otpVerified={otpVerified}
                    setOtpVerified={setOtpVerified}
                    apiUrl={USER_API_URL}
                  />
                ) : (
                  <FormProvider {...methods}>
                    <CForm onSubmit={handleSubmit(onSubmit)}>
                      <h1 className="text-center mb-4">Complete Registration</h1>
                      {notification.message && (
                        <CAlert color={notification.type}>{notification.message}</CAlert>
                      )}

                      {/* Username */}
                      <CInputGroup className={`mb-3 ${errors.username ? 'is-invalid' : ''}`}>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          {...register('username', { required: 'Username is required' })}
                        />
                      </CInputGroup>
                      {errors.username && <CAlert color="danger">{errors.username.message}</CAlert>}

                      {/* Password */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters',
                            },
                          })}
                        />
                        <CInputGroupText
                          role="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{ cursor: 'pointer' }}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </CInputGroupText>
                      </CInputGroup>
                      {errors.password && <CAlert color="danger">{errors.password.message}</CAlert>}

                      {/* Role Selection */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Role</CInputGroupText>
                        <CFormSelect {...register('role')}>
                          <option value="super admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="vendor">Vendor</option>
                          <option value="staff">Staff</option>
                        </CFormSelect>
                      </CInputGroup>

                      {/* Vendor Form (Conditionally Rendered) */}
                      {selectedRole === 'vendor' && <VendorForm />}

                      <div className="d-grid">
                        <CButton color="primary" type="submit" disabled={loading}>
                          {loading ? <CSpinner color="light" /> : 'Register'}
                        </CButton>
                      </div>
                    </CForm>
                  </FormProvider>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
