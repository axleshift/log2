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
          <CCardHeader className="CardHeader"><h1>Customer Information</h1></CCardHeader>
          <CCardBody>
          <CForm>
            <CRow >
              <CCol >
            <CFormInput
              type="Name"
              id="ControlInput1"
              label="Customer Name"
              placeholder="Juan DelaCruz"
              text="Must be 8-20 characters long."
              
            />
            </CCol>
            <CCol >
            <CFormInput
              type="Email"
              id="ControlInput1"
              label="Email Address"
              placeholder="name@example.com"
              text="Must be 8-20 characters long."
              
            />
            </CCol>
            </CRow>
            </CForm>
            

            <CForm>
              <CRow>
                <CCol>
            <CFormInput
              type="Address"
              id="ControlInput1"
              label="Address"
              placeholder="number and street name. You may include the city, state and ZIP code on the final line"
             
            />
           </CCol>

            <CCol>
            <CFormInput
              type="Contact Number"
              id="ControlInput1"
              label="ContactNumber"
              placeholder="000 0000 0000"
               
            />
            </CCol>
            </CRow>
            </CForm>
          
          </CCardBody>
          
          <CCardBody>
          <CForm>
            <CRow>
              <CCol>
            <CFormInput
              type="Name"
              id="ControlInput1"
              label="Full Name"
              placeholder="Juan DelaCruz"
            />
            </CCol>
            <CCol>
            <CFormInput
              type="Recipient Address"
              id="ControlInput1"
              label="Recipient Address"
              placeholder="number and street name. You may include the city, state and ZIP code on the final line"
            />
            </CCol>
            </CRow>
            </CForm> 

            <CForm>
            <CRow>
              <CCol>
            <CFormInput
              type="Contact Number"
              id="ControlInput1"
              label="ContactNumber"
              placeholder="000 0000 0000"
            />
            </CCol>
            
            <CCol>
            <CFormInput
              type="Weight"
              id="ControlInput1"
              label="Weight"
              placeholder=""
            />
           </CCol>
           </CRow>
            </CForm>

            <CForm>
              <CRow>
              <CCol>
            <CFormInput
              type="Cost"
              id="ControlInput1"
              label="Cost"
              placeholder=""
            />
            </CCol>

            <CCol>
            <CFormInput
              type="Quantity"
              id="ControlInput1"
              label="Product Quantity"
              placeholder="1"
            />
            </CCol>
            
              </CRow>
            </CForm>

          </CCardBody>
          <CCardBody>
          

          <div className="d-grid gap-2 col-6 mx-auto ">
           <CButton color="primary" shape="rounded-pill">SUBMIT</CButton>
           </div>

        </CCardBody>
        </CCard>
        

      
      
            )
            

}

export default Order