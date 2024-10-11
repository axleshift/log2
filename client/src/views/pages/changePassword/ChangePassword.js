import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
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
import { cilLockLocked } from '@coreui/icons'

const ChangePassword = () => {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const navigate = useNavigate()

  const API_URL = process.env.REACT_APP_API_URL

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API_URL}/verifyCode`, {
        email,
        resetCode,
      })

      if (res.data.status === 'success') {
        setSuccess(true)
        setCodeVerified(true)
      } else {
        setError(res.data.message || 'Verification failed. Please try again.')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(`${API_URL}/changePassword/${id}`, {
        newPassword: password,
        resetCode,
      })

      if (res.data.status === 'success') {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(res.data.message || 'Failed to change password. Please try again.')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(errorMessage)
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
                  <CForm onSubmit={handleSubmit}>
                    <h1>Change Password</h1>
                    <p className="text-body-secondary">Enter New Password</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Successfully Verified</div>}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>Email</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>Reset Code</CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Enter Reset Code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                        aria-label="Reset Code"
                      />
                    </CInputGroup>
                    <CButton onClick={handleVerifyCode} color="primary" disabled={loading}>
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        'Verify Code'
                      )}
                    </CButton>

                    <CInputGroup className="mb-4 mt-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="off"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        aria-label="Confirm Password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CButton type="submit" color="primary" disabled={loading || !codeVerified}>
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          'UPDATE'
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

export default ChangePassword
