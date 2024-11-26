import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import Cookies from 'js-cookie'

function Login() {
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)

  const executeRecaptcha = async () => {
    try {
      const token = await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
        action: 'login',
      })
      setCaptchaToken(token)
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error)
    }
  }

  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: 'login' })
          .then(executeRecaptcha)
      })
    } else {
      console.error('reCAPTCHA is not loaded properly.')
    }
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    if (!captchaToken) {
      setNotification({ message: 'Please complete the reCAPTCHA', type: 'danger' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${USER_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken: captchaToken }),
      })

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.message || 'Login failed')
      }

      const { accessToken, refreshToken } = await response.json()
      Cookies.set('token', accessToken, { expires: 1 })
      Cookies.set('refreshToken', refreshToken, { expires: 1 })

      setNotification({
        message: 'Welcome back! Redirecting to your dashboard...',
        type: 'success',
      })

      reset()
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoading(false)
      setCaptchaToken(null)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          {/* Left side - Vendor Portal */}
          <CCol
            md={4}
            className="d-flex flex-column align-items-center justify-content-center bg-primary text-white"
          >
            <h2>Vendor Portal</h2>
            <p>Logistic Management System</p>
            <Link to="/" className="text-white">
              Landing page →
            </Link>
            <Link to="/supplierslogin" className="text-white">
              Supplier Login →
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

                    {/* reCAPTCHA */}
                    <div className="mb-3">
                      <div
                        className="g-recaptcha"
                        data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      ></div>
                    </div>

                    {/* Submit and Forgot Password Buttons */}
                    <CRow>
                      <CCol sm={5}>
                        <CButton
                          color="success"
                          variant="outline"
                          className="px-4"
                          type="submit"
                          disabled={loading || !captchaToken}
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
                      <CCol xs={4}>
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
