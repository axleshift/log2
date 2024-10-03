import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

function Register() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Sanitize the user inputs
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        email: data.email, // You can keep this if you prefer to sanitize
        password: DOMPurify.sanitize(data.password),
      };
      await axios.post('http://localhost:3001/register', sanitizedData);
      alert('Registration Successful');
      reset(); // Reset form fields after successful registration
      navigate('/login');
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error('Registration Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
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
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                        maxLength: {
                          value: 20,
                          message: "Username must not exceed 20 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+$/,
                          message: "Username can only contain letters, numbers, dots, underscores, and hyphens",
                        },
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
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
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
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        validate: {
                          hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                          hasNumber: (value) => /[0-9]/.test(value) || "Password must contain at least one number",
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
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch('password') || "Passwords do not match",
                      })}
                    />
                  </CInputGroup>
                  {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}

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
  );
}

export default Register;
