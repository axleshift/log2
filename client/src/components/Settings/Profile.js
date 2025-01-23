import React from 'react'
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
  return (
    <div className="profile-page">
      <CCard className="mb-4">
        <CCardHeader>
          <h5>User Profile</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            {/* Profile Picture */}
            <CCol md={3} className="text-center">
              <CImage
                src="https://via.placeholder.com/150"
                alt="Profile Picture"
                className="mb-3"
                rounded
                width={150}
              />
              <CButton color="primary" variant="outline" className="mt-2">
                Change Picture
              </CButton>
            </CCol>

            {/* Personal Details */}
            <CCol md={9}>
              <h6 className="mb-4">Personal Details</h6>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="firstName">First Name</CFormLabel>
                    <CFormInput id="firstName" placeholder="Enter first name" />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="lastName">Last Name</CFormLabel>
                    <CFormInput id="lastName" placeholder="Enter last name" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput type="email" id="email" placeholder="Enter email" />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="phone">Phone</CFormLabel>
                    <CFormInput type="tel" id="phone" placeholder="Enter phone number" />
                  </CCol>
                </CRow>
              </CForm>
            </CCol>
          </CRow>

          <hr />

          {/* Address Information */}
          <h6 className="mb-4">Address Information</h6>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="address1">Address Line 1</CFormLabel>
                <CFormInput id="address1" placeholder="Enter address line 1" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="city">City</CFormLabel>
                <CFormInput id="city" placeholder="Enter city" />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="state">State</CFormLabel>
                <CFormInput id="state" placeholder="Enter state" />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="zip">Zip Code</CFormLabel>
                <CFormInput id="zip" placeholder="Enter zip code" />
              </CCol>
            </CRow>
          </CForm>

          <hr />

          {/* Change Password */}
          <h6 className="mb-4">Change Password</h6>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="currentPassword">Current Password</CFormLabel>
                <CFormInput
                  type="password"
                  id="currentPassword"
                  placeholder="Enter current password"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="newPassword">New Password</CFormLabel>
                <CFormInput type="password" id="newPassword" placeholder="Enter new password" />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="confirmPassword">Confirm New Password</CFormLabel>
                <CFormInput
                  type="password"
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                />
              </CCol>
            </CRow>
            <CButton color="primary">Update Password</CButton>
          </CForm>

          <hr />

          {/* About Section */}
          <h6 className="mb-4">About You</h6>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="bio">Bio</CFormLabel>
                <CFormTextarea id="bio" placeholder="Tell us about yourself..." rows={4} />
              </CCol>
            </CRow>
            <CButton color="primary">Save Changes</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProfilePage
