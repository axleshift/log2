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

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loading2FA, setLoading2FA] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [twoFAMessage, setTwoFAMessage] = useState('')

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  useEffect(() => {
    if (show2FA) {
      const timer = setTimeout(() => {
        document.querySelector('input[placeholder="Enter 2FA Code"]')?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [show2FA])

  const onSubmit = async (data) => {
    setLoadingLogin(true)
    setNotification({ message: '', type: '' })

    try {
      const recaptchaToken = await recaptchaRef.current?.executeAsync()
      recaptchaRef.current?.reset()

      const response = await fetch(`${USER_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptcha_ref: recaptchaToken }),
      })

      const responseData = await response.json()

      if (!response.ok) throw new Error(responseData.message || 'Login failed')

      if (responseData.status === '2fa_required') {
        setShow2FA(true)
        setUsername(data.username)
        setTwoFAMessage(responseData.message || 'Enter your 2FA code.')
        return
      }

      handleLoginSuccess(responseData)
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleVerify2FA = async () => {
    setLoading2FA(true)
    try {
      const response = await fetch(`${USER_API_URL}/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username }),
      })

      const responseData = await response.json()

      if (!response.ok) throw new Error(responseData.message || '2FA verification failed')

      if (responseData.status === 'success') {
        handleLoginSuccess(responseData)
      } else {
        setTwoFAMessage('Invalid 2FA code, please try again.')
      }
    } catch (error) {
      setTwoFAMessage(error.message)
    } finally {
      setLoading2FA(false)
    }
  }

  const handleLoginSuccess = ({ accessToken, refreshToken, user }) => {
    login(user, accessToken)
    Cookies.set('token', accessToken, { expires: 1, secure: true, sameSite: 'Strict' })
    Cookies.set('refreshToken', refreshToken, { expires: 30, secure: true, sameSite: 'Strict' })

    setNotification({ message: 'Welcome back! Redirecting...', type: 'success' })
    reset()

    if (user.role === 'admin' || user.role === 'super admin') {
      navigate('/dashboard')
    } else if (user.role === 'staff') {
      navigate('/procurement')
    } else if (user.role === 'vendor') {
      navigate('/dashboard')
    } else {
      setNotification({ message: 'Unauthorized role.', type: 'danger' })
    }
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_RECAPTCHA_SITE_KEY} />
        <CRow className="justify-content-center">
          <CCol
            md={4}
            className="d-flex flex-column align-items-center justify-content-center bg-primary text-white"
          >
            <h2>VENDOR PORTAL</h2>
            <p>Logistic Management System</p>
            <Link to="/" className="text-white">
              Landing Page →
            </Link>
          </CCol>

          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {notification.message && (
                    <CAlert color={notification.type} dismissible>
                      {notification.message}
                    </CAlert>
                  )}

                  {!show2FA ? (
                    <CForm onSubmit={handleSubmit(onSubmit)}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p>

                      {/* Username */}
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

                      {/* Password */}
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
                            disabled={loadingLogin}
                          >
                            {loadingLogin ? 'Logging in...' : 'LOGIN'}
                          </CButton>
                        </CCol>
                        <CCol xs="auto" className="me-auto">
                          <Link to="/forgotPass">
                            <CButton
                              color="danger"
                              variant="outline"
                              className="px-4"
                              disabled={loadingLogin}
                            >
                              {loadingLogin ? 'Processing...' : 'FORGOT PASSWORD'}
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
                  ) : (
                    <div className="mt-4">
                      <h5>Two-Factor Authentication</h5>
                      {twoFAMessage && <p className="text-info">{twoFAMessage}</p>}
                      <CInputGroup className="mb-3">
                        <CFormInput
                          placeholder="Enter 2FA Code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </CInputGroup>
                      <CButton
                        color="primary"
                        onClick={handleVerify2FA}
                        disabled={loading2FA || !code.trim()}
                      >
                        {loading2FA ? 'Verifying...' : 'Verify Code'}
                      </CButton>
                    </div>
                  )}
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
