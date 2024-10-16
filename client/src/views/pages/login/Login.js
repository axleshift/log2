import React, { useState } from 'react';
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
import { cilLockLocked, cilUser } from '@coreui/icons';
import { loginUser } from '../../../api/authService.js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success messages

    try {
      const response = await loginUser({ username, password });
      if (response) {

        localStorage.setItem('token', response.token); // Store token in localStorage
        setUsername('');
        setPassword('');
        setSuccess('Successfully logged in!');
        setTimeout(() => {
          navigate('/'); // Redirect to the home page after a short delay
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
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
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>} {/* Display success message */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        aria-label="Username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password"
                      />
                    </CInputGroup>
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
  );
}

export default Login;
