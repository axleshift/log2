import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

  function Register() {
    const [ admin, setAdmins ] = useState([])
    const [ email, setEmail ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate ();

      useEffect(() => {
        fetchAdmins();
      }, [])

    const fetchAdmins = () => {
          axios
          .get('http://localhost:3001/register')
          .then((res) => {
           console.log(res.data)
          })
        }
     const handleRegister = (event) => {
          event.preventDefault()
          axios
          .post('http://localhost:3001/register', { email, username,
            password})
          .then(() => {
            alert('Registration Successful')
            setEmail('')
            setUsername('')
            setPassword('')
            fetchAdmins()
            navigate('/login')
          })
          .catch((err) => {
            console.log("Unable to Register user")
          })
   };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
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
                    value={ username }
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                     type="email"
                     placeholder="Email"
                     autoComplete="email" 
                     value={ email }
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={ password }
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register;