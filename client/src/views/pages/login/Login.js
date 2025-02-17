import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { VITE_RECAPTCHA_SITE_KEY } from '../../../config.js'
import { useAuth } from '../../../context/AuthContext.js'

const Login = () => {
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const navigate = useNavigate()
  const { login } = useAuth()
  const usernameRef = useRef(null)
  const recaptchaRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync()
      recaptchaRef.current.reset()

      const response = await fetch(`${USER_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptcha_ref: recaptchaToken }),
      })

      const responseData = await response.json()
      console.log('Response Data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed')
      }

      const { accessToken, refreshToken, user } = responseData

      // Store user data and token in context
      login(user, accessToken)

      // Set tokens in cookies
      Cookies.set('token', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      })
      Cookies.set('refreshToken', refreshToken, {
        expires: 30,
        secure: true,
        sameSite: 'Strict',
      })

      setNotification({
        message: 'Welcome back! Redirecting to your dashboard...',
        type: 'success',
      })
      reset()

      if (user.role === 'admin' || user.role === 'super admin') {
        navigate('/dashboard')
      } else if (
        user.role === 'staff' ||
        user.role === 'buyer' ||
        user.role === 'staff' ||
        user.role === 'user'
      ) {
        navigate('/inventory')
      } else {
        setNotification({
          message: 'Unauthorized. You do not have admin access.',
          type: 'danger',
        })
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {/* Invisible reCAPTCHA */}
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_RECAPTCHA_SITE_KEY} />
        <CRow className="justify-content-center">
          <CCol
            md={4}
            className="d-flex flex-column align-items-center justify-content-center bg-primary text-white"
          >
            <h2>LOGIN PORTAL</h2>
            <p>Logistic Management System</p>
            <Link to="/VendorLogin" className="text-white">
              Vendor Portal →
            </Link>
            <Link to="/" className="text-white">
              Landing Page →
            </Link>
          </CCol>

          {/* Right side - Login Form */}
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {notification.message && (
                    <CAlert color={notification.type} dismissible>
                      {notification.message}
                    </CAlert>
                  )}
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Username Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        ref={usernameRef}
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        {...register('username', { required: 'Username is required' })}
                      />
                    </CInputGroup>
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}

                    {/* Password Input */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
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

                    <CRow>
                      <CCol sm={5}>
                        <CButton
                          color="success"
                          variant="outline"
                          className="px-4"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'LOGIN'}
                        </CButton>
                      </CCol>
                      <CCol xs="auto" className="me-auto">
                        <Link to="/forgotPass">
                          <CButton
                            color="danger"
                            variant="outline"
                            className="px-4"
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'FORGOT PASSWORD'}
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <Link to="/register">
                          <CButton color="link" className="px-0">
                            Register Now!
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
