import React, { useState } from "react";
import {
  CCard,
  CRow,
  CCol,
  CCardHeader,
  CFormInput,
  CCardBody,
  CInputGroup,
  CInputGroupText,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react"; // Import from @coreui/react
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faUserAlt } from "@fortawesome/free-solid-svg-icons";
const profile = () => {
  const [visible, setVisible] = useState(false);
  return (
    <CRow className="justify-content-center">
      {/* Center the card horizontally */}
      <CCol md={12}>
        {/* Adjust the column width as needed */}
        <CCard style={{ width: "60rem", height:"18rem" }}>
          <CCardHeader as="h5">Account Details</CCardHeader>
          <CCardBody>
            <CInputGroup className="mb-3" style={{ textAlign: "center" }}>
              <CInputGroupText id="basic-addon1">
                <FontAwesomeIcon icon={faUser} />
                &nbsp; Fullname
              </CInputGroupText>
              <CFormInput
                placeholder="Ma Angelica Olavidez"
                aria-label="Fullname"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3" style={{ textAlign: "center" }}>
              <CInputGroupText id="basic-addon1">
                <FontAwesomeIcon icon={faUser} />
                &nbsp; UserName
              </CInputGroupText>
              <CFormInput
                placeholder="MaanOla"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3" style={{ textAlign: "center" }}>
              <CInputGroupText id="basic-addon1">
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp; Email
              </CInputGroupText>
              <CFormInput
                placeholder="maanpajimola@gmail.com"
                aria-label="Email"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            &nbsp;
            &nbsp;
            <div className="d-grid gap-2 d-md-block">
              <CButton color="primary">Save Changes</CButton>
              &nbsp;&nbsp;
              <CButton color="primary" onClick={() => setVisible(!visible)}>
                Change Password?
              </CButton>
            </div>
            <CModal
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="LiveDemoExampleLabel"
            >
              <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">
                  Change Password
                </CModalTitle>
              </CModalHeader>
              <CModalBody>

              <CInputGroup className="mb-3" style={{ textAlign: "center" }}>
              <CInputGroupText id="basic-addon1">
                <FontAwesomeIcon icon={faLock} />
                &nbsp; New Password
              </CInputGroupText>
              <CFormInput
                placeholder="New Passoword"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>

            <CInputGroup className="mb-3" style={{ textAlign: "center" }}>
              <CInputGroupText id="basic-addon1">
                <FontAwesomeIcon icon={faLock} />
                &nbsp; Confirm Password
              </CInputGroupText>
              <CFormInput
                placeholder="Confirm Passoword"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Close
                </CButton>
                <CButton color="primary">Save changes</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default profile;