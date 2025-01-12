import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'

function Register() {
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const registerUser = async (data) => {
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
  }

  const sendOtp = async () => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const response = await fetch(`${USER_API_URL}/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsOtpSent(true)
        setNotification({
          message: 'OTP sent to your email. Please check your inbox.',
          type: 'success',
        })
      } else {
        const errorResponse = await response.json()
        setNotification({ message: errorResponse.message, type: 'danger' })
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const response = await fetch(`${USER_API_URL}/register/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      if (response.ok) {
        setOtpVerified(true) // OTP verification successful
        setNotification({
          message: 'OTP verified successfully. Proceed to registration.',
          type: 'success',
        })
        setIsOtpSent(false) // Hide OTP input
      } else {
        const errorResponse = await response.json()
        setNotification({ message: errorResponse.message, type: 'danger' })
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const userData = {
        username: data.username,
        email: email,
        password: data.password,
        role: data.role || 'user',
      }

      const response = await registerUser(userData)

      Cookies.set('token', response.accessToken, { expires: 1 })
      Cookies.set('refreshToken', response.refreshToken, { expires: 1 })

      setNotification({ message: 'Registration Successful! Redirecting...', type: 'success' })

      reset()

      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
      console.error('Registration Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {/* Back Button */}
        <CButton color="secondary" onClick={handleBack} className="mb-3">
          Back
        </CButton>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {notification.message && (
                  <CAlert color={notification.type} dismissible>
                    {notification.message}
                  </CAlert>
                )}

                {/*  OTP request */}
                {!isOtpSent && !otpVerified ? (
                  <CForm
                    onSubmit={(e) => {
                      e.preventDefault()
                      sendOtp()
                    }}
                  >
                    <h1>Register</h1>
                    <p className="text-body-secondary">Create your account</p>

                    {/* Email Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <CButton color="success" type="submit" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                      </CButton>
                    </div>
                  </CForm>
                ) : (
                  // OTP Verification
                  !otpVerified && (
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault()
                        verifyOtp()
                      }}
                    >
                      <h1>Verify OTP</h1>
                      <p className="text-body-secondary">Enter the OTP sent to your email</p>

                      {/* OTP Input */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>OTP</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </CInputGroup>

                      {/* Submit Button */}
                      <div className="d-grid">
                        <CButton color="success" type="submit" disabled={loading}>
                          {loading ? 'Verifying OTP...' : 'Verify OTP'}
                        </CButton>
                      </div>
                    </CForm>
                  )
                )}

                {/*  Registration Form */}
                {otpVerified && (
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Complete Registration</h1>
                    <p className="text-body-secondary">Fill in your details</p>

                    {/* Username Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        {...register('username', {
                          required: 'Username is required',
                          minLength: {
                            value: 6,
                            message: 'Username must be at least 6 characters',
                          },
                          maxLength: {
                            value: 20,
                            message: 'Username must not exceed 20 characters',
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+$/,
                            message: 'Invalid username format',
                          },
                        })}
                      />
                    </CInputGroup>
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}

                    {/* Password Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                          validate: {
                            hasUpperCase: (value) =>
                              /[A-Z]/.test(value) || 'At least one uppercase letter required',
                            hasNumber: (value) =>
                              /[0-9]/.test(value) || 'At least one number required',
                          },
                        })}
                      />
                      <CButton
                        color="secondary"
                        variant="outline"
                        onClick={togglePasswordVisibility}
                        type="button"
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </CButton>
                    </CInputGroup>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}

                    {/* Confirm Password Input */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        {...register('confirmPassword', {
                          required: 'Confirm Password is required',
                          validate: (value) =>
                            value === watch('password') || 'Passwords do not match',
                        })}
                      />
                    </CInputGroup>
                    {errors.confirmPassword && (
                      <p className="text-danger">{errors.confirmPassword.message}</p>
                    )}

                    {/* Role Dropdown */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect
                        {...register('role', { required: 'Please select a role' })}
                        aria-label="Role Selection"
                      >
                        <option value="">Select Role</option>

                        {/* Admin Roles */}
                        <optgroup label="Admin Roles">
                          <option value="admin">Admin</option>
                          <option value="super admin">Super Admin</option>
                          <option value="auditor">Auditor</option>
                        </optgroup>

                        {/* Staff Roles */}
                        <optgroup label="Staff Roles">
                          <option value="staff">Staff</option>
                          <option value="inventory manager">Inventory Manager</option>
                          <option value="procurement manager">Procurement Manager</option>
                          <option value="regional manager">Regional Manager</option>
                        </optgroup>

                        {/* User Roles */}
                        <optgroup label="User Roles">
                          <option value="user">User</option>
                          <option value="supplier">Supplier</option>
                          <option value="vendor">Vendor</option>
                          <option value="buyer">Buyer</option>
                          <option value="finance">Finance</option>
                          <option value="temporary staff">Temporary Staff</option>
                          <option value="delivery partner">Delivery Partner</option>
                          <option value="customer support">Customer Support</option>
                        </optgroup>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.role && <p className="text-danger">{errors.role.message}</p>}

                    {/* Submit Button */}
                    <div className="d-grid">
                      <CButton color="success" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </CButton>
                    </div>
                  </CForm>
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
