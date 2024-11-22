import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import axios from 'axios'

const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`

const ForgotPass = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const navigate = useNavigate()

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const forgotPassUser = async (data) => {
    return await axios.post(`${USER_API_URL}/forgot-password`, data)
  }

  const verifyOtp = async (data) => {
    return await axios.post(`${USER_API_URL}/verify-otp`, data)
  }

  const changePassword = async (data) => {
    return await axios.post(`${USER_API_URL}/change-password`, data)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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
      if (res.status === 200) {
        setSuccess('A reset code has been sent to your email. Please check your inbox.')
        setOtpSent(true)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while sending the OTP.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    if (!otp) {
      setError('OTP is required.')
      setLoading(false)
      return
    }

    try {
      const res = await verifyOtp({ email, otp })
      if (res.status === 200) {
        setSuccess('OTP verified successfully! You can now set a new password.')
        setOtpVerified(true)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while verifying the OTP.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!newPassword || !otp) {
      setError('Both OTP and new password fields are required.')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await changePassword({ email, otp, newPassword })
      if (res.status === 200) {
        setSuccess('Password changed successfully. Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'An error occurred while changing the password.'
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
                  <CForm
                    onSubmit={
                      otpVerified ? handleChangePassword : otpSent ? handleOtpSubmit : handleSubmit
                    }
                  >
                    <h1>
                      {otpVerified ? 'Change Password' : otpSent ? 'Verify OTP' : 'Forgot Password'}
                    </h1>
                    <p className="text-body-secondary">
                      {otpVerified
                        ? 'Enter your new password'
                        : otpSent
                          ? 'Enter the OTP sent to your email'
                          : 'Enter your email to reset your password'}
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Email Input */}
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
                            setSuccess('')
                          }}
                          required
                        />
                      </CInputGroup>
                    )}

                    {/* OTP Input */}
                    {otpSent && !otpVerified && (
                      <CInputGroup className="mb-4">
                        <CInputGroupText>OTP</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </CInputGroup>
                    )}

                    {/* New Password Inputs */}
                    {otpVerified && (
                      <>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>New Password</CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>Confirm Password</CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </CInputGroup>
                      </>
                    )}

                    {/* Submit Button */}
                    <CRow>
                      <CButton type="submit" color="primary" disabled={loading}>
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : otpVerified ? (
                          'Change Password'
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
