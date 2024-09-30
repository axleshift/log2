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
  CButtonGroup,
  CCardFooter,
  CForm,
  CCardTitle,
  CFormLabel,

} from "@coreui/react";

import './order.scss';

const Order = ( ) => {
    return (   
        <CCard >
          <CCardHeader><h1>Customer Information</h1></CCardHeader>
          <CCardBody>
          <CForm>
            <CFormInput
              type="Name"
              id="ControlInput1"
              label="Customer Name"
              placeholder="Juan DelaCruz"
              text="Must be 8-20 characters long."
              aria-describedby="exampleFormControlInputHelpInline"
            />
            </CForm>
            <CForm>
            <CFormInput
              type="Email"
              id="ControlInput1"
              label="Email Address"
              placeholder="name@example.com"
              text="Must be 8-20 characters long."
              aria-describedby="exampleFormControlInputHelpInline"
            />
            </CForm>

            <CForm>
            <CFormInput
              type="Address"
              id="ControlInput1"
              label="Address"
              placeholder="number and street name. You may include the city, state and ZIP code on the final line"
              aria-describedby="exampleFormControlInputHelpInline"
            />
            </CForm>

            <CForm>
            <CFormInput
              type="Contact Number"
              id="ControlInput1"
              label="ContactNumber"
              placeholder="000 0000 0000"
              aria-describedby="exampleFormControlInputHelpInline"  
            />
            </CForm>
            

            

          
          </CCardBody>
          <CCardFooter>
          <CButton color="primary" href="#">SUBMIT</CButton>
          </CCardFooter>
        </CCard>
        

      
      
            )
            

}

export default Order