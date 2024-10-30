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

  // API calls
  const forgotPassUser = async (data) => {
    console.log('Sending forgot password request:', data)
    return await axios.post(`${USER_API_URL}/forgot-password`, data)
  }
  const verifyOtp = async (data) => {
    console.log('Verifying OTP:', data)
    return await axios.post(`${USER_API_URL}/verify-otp`, data)
  }
  const changePassword = async (data) => {
    console.log('Changing password for user:', data)
    return await axios.post(`${USER_API_URL}/change-password`, data)
  }

  // Handle form submission for sending OTP
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    console.log('Submit email for OTP:', email)

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
      console.log('Forgot password response:', res)
      if (res.status === 200 && res.data.message === 'OTP sent to your email.') {
        setSuccess('A reset code has been sent to your email. Please check your inbox.')
        setOtpSent(true)
      } else {
        setError('Failed to send OTP. Please try again later.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while sending the OTP.'
      console.error('Error sending OTP:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP verification
  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    console.log('Submit OTP:', otp)

    if (!otp) {
      setError('OTP is required.')
      setLoading(false)
      return
    }

    try {
      const res = await verifyOtp({ email, otp })
      console.log('OTP verification response:', res)
      if (res.status === 200) {
        setOtpVerified(true)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred while verifying the OTP.'
      console.error('Error verifying OTP:', errorMsg)
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

    console.log('Change password attempt:', { email, otp, newPassword })

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

    const payload = { email, otp, newPassword }
    console.log('Changing password with payload:', payload)

    try {
      const res = await changePassword(payload)
      console.log('Change password response:', res)
      if (res.status === 200) {
        setSuccess('Password changed successfully. Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Failed to change password. Please try again later.')
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'An error occurred while changing the password.'
      console.error('Error changing password:', errorMsg)
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
                          aria-label="Email"
                        />
                      </CInputGroup>
                    )}
                    {otpSent && !otpVerified && (
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
                            aria-label="New Password"
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
                            aria-label="Confirm Password"
                          />
                        </CInputGroup>
                      </>
                    )}
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
