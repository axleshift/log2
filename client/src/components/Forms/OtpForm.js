import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CButton, CAlert, CInputGroup, CInputGroupText, CFormInput, CForm } from '@coreui/react'

function OTPVerification({ email, setEmail, otpVerified, setOtpVerified, apiUrl }) {
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })

  const sendOtp = async () => {
    if (!email) {
      setNotification({ message: 'Please enter an email address.', type: 'danger' })
      return
    }

    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const response = await fetch(`${apiUrl}/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsOtpSent(true)
        setNotification({ message: 'OTP sent to your email. Check your inbox.', type: 'success' })
      } else {
        const errorResponse = await response.json()
        setNotification({ message: errorResponse.message, type: 'danger' })
      }
    } catch (error) {
      setNotification({ message: 'Network error. Please try again later.', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp) {
      setNotification({ message: 'Please enter the OTP.', type: 'danger' })
      return
    }

    setLoading(true)
    setNotification({ message: '', type: '' })

    try {
      const response = await fetch(`${apiUrl}/register/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      if (response.ok) {
        setOtpVerified(true)
        setNotification({ message: 'OTP verified successfully!', type: 'success' })
      } else {
        const errorResponse = await response.json()
        setNotification({ message: errorResponse.message, type: 'danger' })
      }
    } catch (error) {
      setNotification({ message: 'Network error. Please try again later.', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {notification.message && <CAlert color={notification.type}>{notification.message}</CAlert>}

      {!isOtpSent && !otpVerified ? (
        <CForm
          onSubmit={(e) => {
            e.preventDefault()
            sendOtp()
          }}
        >
          <h1>Register</h1>
          <p className="text-body-secondary">Enter your email to receive an OTP</p>

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

          <div className="d-grid">
            <CButton color="success" type="submit" disabled={loading || !email}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </CButton>
          </div>
        </CForm>
      ) : (
        !otpVerified && (
          <CForm
            onSubmit={(e) => {
              e.preventDefault()
              verifyOtp()
            }}
          >
            <h1>Verify OTP</h1>
            <p className="text-body-secondary">Enter the OTP sent to your email</p>

            <CInputGroup className="mb-3">
              <CInputGroupText>OTP</CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </CInputGroup>

            <div className="d-grid">
              <CButton color="success" type="submit" disabled={loading || !otp}>
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </CButton>
            </div>
          </CForm>
        )
      )}
    </>
  )
}

OTPVerification.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  otpVerified: PropTypes.bool.isRequired,
  setOtpVerified: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
}

export default OTPVerification
