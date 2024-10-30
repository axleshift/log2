import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import DOMPurify from 'dompurify'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
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

  const registerUser = async (data) => {
    const response = await fetch(`${USER_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    // Check for HTTP errors
    if (!response.ok) {
      const errorResponse = await response.json() // Parse JSON response for more details
      throw new Error(errorResponse.message || 'Registration failed. Please try again.')
    }
    return response.json()
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        email: DOMPurify.sanitize(data.email),
        password: DOMPurify.sanitize(data.password),
      }
      const response = await registerUser(sanitizedData)

      Cookies.set('token', response.accessToken, { expires: 1 }) // Set cookie for 1 day
      Cookies.set('refreshToken', response.refreshToken, { expires: 1 }) // Set refresh token in cookies

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

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {notification.message && (
                  <CAlert color={notification.type} dismissible>
                    {notification.message}
                  </CAlert>
                )}
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

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
                        minLength: { value: 3, message: 'Username must be at least 3 characters' },
                        maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                        pattern: { value: /^[a-zA-Z0-9._-]+$/, message: 'Invalid username format' },
                      })}
                    />
                  </CInputGroup>
                  {errors.username && <p className="text-danger">{errors.username.message}</p>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email format',
                        },
                      })}
                    />
                  </CInputGroup>
                  {errors.email && <p className="text-danger">{errors.email.message}</p>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        validate: {
                          hasUpperCase: (value) =>
                            /[A-Z]/.test(value) || 'At least one uppercase letter required',
                          hasNumber: (value) =>
                            /[0-9]/.test(value) || 'At least one number required',
                        },
                      })}
                    />
                  </CInputGroup>
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}

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

                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
