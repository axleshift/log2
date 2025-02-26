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
      if (!email) {
        throw new Error('Email verification is required.')
      }

      const userData = {
        username: data.username,
        email,
        password: data.password,
        role: data.role || 'user',
      }

      if (data.role === 'vendor') {
        userData.vendorDetails = {
          businessName: data.businessName,
          fullName: data.fullName,
          businessAddress: data.businessAddress,
          contactNumber: data.contactNumber,
          certifications: data.certifications ? data.certifications.split(',') : [],
          taxId: data.taxId,
        }
      }

      const response = await registerUser(userData)

      Cookies.set('token', response.accessToken, { expires: 1 })
      Cookies.set('refreshToken', response.refreshToken, { expires: 1 })

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
                      <CInputGroup className={`mb-3 ${errors.password ? 'is-invalid' : ''}`}>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          {...register('password', { required: 'Password is required' })}
                        />
                      </CInputGroup>
                      {errors.password && <CAlert color="danger">{errors.password.message}</CAlert>}

                      {/* Role Selection */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Role</CInputGroupText>
                        <CFormSelect {...register('role')}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super admin">Super Admin</option>
                          <option value="vendor">Vendor</option>
                          <option value="buyer">Buyer</option>
                          <option value="finance">Finance</option>
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
