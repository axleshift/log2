import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

const ForgotPass = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Email is required.')
      setLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const res = await forgotPassUser({ email })
      if (res.status === 200 && res.data.status === 'success') {
        setSuccess(true)
        setOtpSent(true)
        setEmail('')
      } else {
        setError('Failed to send password reset link.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while sending the email.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await verifyOtp({ email, otp })
      if (res.status === 200 && res.data.status === 'success') {
        navigate('/changePassword', { state: { email, otp } })
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while verifying the OTP.'
      setError(errorMsg)
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
                  <CForm onSubmit={otpSent ? handleOtpSubmit : handleSubmit}>
                    <h1>{otpSent ? 'Verify OTP' : 'Forgot Password'}</h1>
                    <p className="text-body-secondary">
                      {otpSent
                        ? 'Enter the OTP sent to your email'
                        : 'Enter your email to reset your password'}
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && !otpSent && (
                      <div className="alert alert-success">
                        A reset code has been sent to your email. Please check your inbox.
                      </div>
                    )}
                    {!otpSent && (
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                            setSuccess(false)
                          }}
                          required
                          aria-label="Email"
                        />
                      </CInputGroup>
                    )}
                    {otpSent && (
                      <CInputGroup className="mb-4">
                        <CInputGroupText>OTP</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          aria-label="OTP"
                        />
                      </CInputGroup>
                    )}
                    <CRow>
                      <CButton type="submit" color="primary" disabled={loading}>
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : otpSent ? (
                          'Verify OTP'
                        ) : (
                          'Send Reset Code'
                        )}
                      </CButton>
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

export default ForgotPass
