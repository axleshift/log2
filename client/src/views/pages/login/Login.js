import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import DOMPurify from 'dompurify'
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
import ReCAPTCHA from 'react-google-recaptcha'

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
  const [captchaValue, setCaptchaValue] = useState(null)
  const recaptchaRef = useRef()

  const loginUser = async (data) => {
    const response = await fetch(`${USER_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const responseData = await response.json()
      throw new Error(responseData.message || 'Login failed')
    }
    return response.json()
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    if (!captchaValue) {
      setNotification({ message: 'Please complete the reCAPTCHA', type: 'danger' })
      setLoading(false)
      return
    }

    try {
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        password: DOMPurify.sanitize(data.password),
        recaptchaToken: captchaValue,
      }
      const response = await loginUser(sanitizedData)

      // Assuming the response contains tokens
      const { accessToken, refreshToken } = response // Update as needed

      // Store tokens in cookies
      Cookies.set('token', accessToken, { expires: 1 })
      Cookies.set('refreshToken', refreshToken, { expires: 1 })

      // Set a custom success message here
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
      setCaptchaValue(null)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
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

                    {/* ReCAPTCHA Component */}
                    <div className="mb-3">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={setCaptchaValue}
                      />
                    </div>

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
