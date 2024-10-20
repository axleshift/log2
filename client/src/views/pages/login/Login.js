import React, { useState, useEffect } from 'react'
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

    try {
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        password: DOMPurify.sanitize(data.password),
      }
      const response = await loginUser(sanitizedData)

      // Store tokens in cookies
      Cookies.set('token', response.accessToken, { expires: 1 })
      Cookies.set('refreshToken', response.refreshToken, { expires: 1 })

      setNotification({ message: 'Login Successful! Redirecting...', type: 'success' })
      reset()
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      setNotification({ message: error.message, type: 'danger' })
      console.error('Login Error:', error.message)
    } finally {
      setLoading(false)
    }
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
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
                      />
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
