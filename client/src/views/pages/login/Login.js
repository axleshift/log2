import React, { useState, useEffect } from 'react';
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

function Login() {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate ();

    useEffect(() => {
      fetchAdmins();
    }, [])

  const fetchAdmins = () => {
        axios
        .get('http://localhost:3001/register')
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.err('Error fetching admins', err);
        });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login',
        { username, password });
      const token = response.data.token;
      alert('Login Successfully');
      setUsername('')
      setPassword('');
      fetchAdmins();
      localStorage.setItem('token', token);
      navigate('/dashboard');  
    } catch (err) {
      console.error('Login Error', err);
      alert('Login failed. Please Check your credentials');
    }
  };


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                      type="test"
                      placeholder="Username"
                      autoComplete="username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
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
                      />
                    </CInputGroup>
                  <CRow className="justify-content-between">   
                   <CCol xs={4}>
                       <CButton color="primary" className="px-4" type="submit">Login</CButton>
                     </CCol>   
                     <CCol xs={4}>
                       <CButton color="link" className="px-0">Forgot password?</CButton>
                    </CCol>
                    </CRow>
                  <CRow className="justify-content-center">
                    <CCol xs ={4}>
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

export default Login;
