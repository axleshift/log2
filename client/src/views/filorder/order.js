import React from "react";
import 
{ CInputGroup,
  CInputGroupText,
  CFormInput,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CCardHeader,
  CButton,
  CButtonGroup
} from "@coreui/react";

import './order.scss';

const Order = ( ) => {
    return (   
        
        <CRow className="Row">
        <CCol sm={6}>
          <CCard>
            <CCardHeader className="header-1"><h1>Customer Information</h1></CCardHeader>
            <CCardBody>
            <CInputGroup className="Name">
            <CInputGroupText id="basic-addon3">Full Name</CInputGroupText>
            <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
            </CInputGroup>
            <CInputGroup className="Email">
            <CInputGroupText id="basic-addon3">EmailAddress</CInputGroupText>
            <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
            </CInputGroup>

            <CInputGroup className="Address">
            <CInputGroupText id="basic-addon3">Billing Address</CInputGroupText>
            <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
            </CInputGroup>

            <CInputGroup className="Number">
            <CInputGroupText id="basic-addon3">ContactNumber</CInputGroupText>
            <CFormInput placeholder="Contact Number" aria-describedby="basic-addon3"/>
            </CInputGroup>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm={6}>
          <CCard>
            <CCardHeader className="header-2"> <h1>Recipient Information</h1></CCardHeader>
            <CCardBody>
            <CInputGroup className="recipient">
            <CInputGroupText>Recipient Adresss</CInputGroupText> 
            <CFormInput placeholder="Address" aria-label="Adress"/>
            </CInputGroup>

            <CInputGroup className="Number">
            <CInputGroupText>ContactNumber</CInputGroupText>
            <CFormInput placeholder="ContactNumber" aria-label="ContactNumber"/>
            
            <CInputGroupText>Kg</CInputGroupText>
            <CFormInput id="" aria-labal="Kg"/>
            </CInputGroup>

            <CInputGroup className="Amount">
            <CInputGroupText>Paid Amount</CInputGroupText>
            <CFormInput placeholder="Amount" aria-labal="Paid Amount"/>
            </CInputGroup>
            </CCardBody>
          </CCard>
        </CCol>
        <div className="btn">
    <CButtonGroup className="me-md-2">
    <CButton as="a" color="primary" href="#" role="button">Submit</CButton>
    </CButtonGroup>
    </div>

      </CRow>

      
      
            )
            

}

export default Order