import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';

function ForgotPass() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Simple email regex for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate email format
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/ForgotPass', { email });
      if (res.data.Status === 'Success') {
        setUserId(res.data.userId);
        setResetToken(res.data.resetToken);
        setSuccess(true);
        setEmail(''); // Clear the email input after successful submission
      } else {
        setError('Failed to send password reset link.');
      }
    } catch (err) {
      console.error('Error sending password reset email:', err);
      setError('An error occurred while sending the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <p className="text-body-secondary">Enter your email to reset your password</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                      <div className="alert alert-success">
                        A reset link has been sent to your email. You can Click the link to Update
                        {userId && resetToken && (
                          <div>
                            <Link to={`/changePassword/${userId}/${resetToken}`}>Change Password</Link>
                          </div>
                        )}
                      </div>
                    )}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                      />
                    </CInputGroup>
                    <CRow>
                      <CButton type="submit" color="primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
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
  );
}

export default ForgotPass;
