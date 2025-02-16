import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CImage,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'

const ProfilePage = () => {
  const PROFILE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/profile`
  const { accessToken, user, profile, setProfile } = useAuth()

  const [previewImage, setPreviewImage] = useState('https://placehold.co/150')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAvatars, setShowAvatars] = useState(false)

  const fetchProfile = async () => {
    if (!user?._id || !accessToken) {
      return setError('User ID or Access Token is missing.')
    }

    try {
      const response = await axios.get(`${PROFILE_API_URL}/${user._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 5000, // 5 seconds timeout
      })

      const profileData = response.data
      if (profileData.email) {
        setProfile(profileData)
        setPreviewImage(profileData.avatar || 'https://placehold.co/150')
      } else {
        setError('Email is required in profile data.')
      }

      localStorage.setItem('profile', JSON.stringify(profileData))
      setLoading(false)
    } catch (error) {
      setError('Error fetching profile.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && accessToken && !profile) {
      fetchProfile()
    } else if (profile) {
      setPreviewImage(profile.avatar || 'https://placehold.co/150')
      setLoading(false)
    }
  }, [user, accessToken, profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value || '',
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!profile.email) {
      setError('Email is required.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.put(`${PROFILE_API_URL}/${user._id}`, profile, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const updatedProfile = response.data
      localStorage.setItem('profile', JSON.stringify(updatedProfile))
      setProfile(updatedProfile)
      setPreviewImage(updatedProfile.avatar || 'https://placehold.co/150')
      setError(null)
    } catch (error) {
      setError('There was an issue updating your profile.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>No profile found. Please log in.</div>

  return (
    <div className="profile-page">
      <CCard className="mb-4">
        <CCardHeader>
          <h5>User Profile</h5>
        </CCardHeader>
        <CCardBody>
          {error && <div className="alert alert-danger">{error}</div>}
          <CRow>
            <CCol md={3} className="text-center">
              {/* Profile Picture */}
              <CImage
                src={
                  previewImage.startsWith('http')
                    ? previewImage
                    : `/src/assets/images/${previewImage}`
                }
                alt="Profile Picture"
                className="mb-3"
                rounded
                width={150}
              />

              {/* Choose Avatar Button */}
              <CButton color="primary" onClick={() => setShowAvatars(!showAvatars)}>
                Choose Avatar
              </CButton>

              {/* Avatar Selection Grid */}
              {showAvatars && (
                <div className="d-flex flex-wrap justify-content-center mt-3">
                  {avatarOptions.map((avatar, index) => (
                    <CImage
                      key={index}
                      src={`/src/assets/images/${avatar}`}
                      alt={`Avatar ${index + 1}`}
                      width={60}
                      height={60}
                      className={`m-2 avatar-option ${profile.avatar === avatar ? 'selected' : ''}`}
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, avatar }))
                        setPreviewImage(avatar)
                        setShowAvatars(false)
                      }}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '50%',
                        border: profile.avatar === avatar ? '3px solid blue' : 'none',
                      }}
                    />
                  ))}
                </div>
              )}
            </CCol>

            <CCol md={9}>
              <h6 className="mb-4">Personal Details</h6>
              <CForm onSubmit={handleProfileSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="firstName">First Name</CFormLabel>
                    <CFormInput
                      id="firstName"
                      name="firstName"
                      value={profile.firstName || ''}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="lastName">Last Name</CFormLabel>
                    <CFormInput
                      id="lastName"
                      name="lastName"
                      value={profile.lastName || ''}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      id="email"
                      name="email"
                      value={profile.email || ''}
                      onChange={handleChange}
                      placeholder="Enter email"
                      disabled
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="phone">Phone</CFormLabel>
                    <CFormInput
                      id="phone"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="address">Address</CFormLabel>
                    <CFormInput
                      id="address"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="city">City</CFormLabel>
                    <CFormInput
                      id="city"
                      name="city"
                      value={profile.city || ''}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="bio">Bio</CFormLabel>
                    <CFormInput
                      id="bio"
                      name="bio"
                      value={profile.bio || ''}
                      onChange={handleChange}
                      placeholder="Enter bio"
                    />
                  </CCol>
                </CRow>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Save Changes'}
                </CButton>
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProfilePage
