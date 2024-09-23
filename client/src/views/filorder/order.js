import React from "react";
import 
{ CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormTextarea,
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCardFooter
} from "@coreui/react";


const Order = ( ) => {
    return (    
        <div className="Order">
    <CCard className="mb-4">
    <CCardHeader>header</CCardHeader> 
    <CFormLabel>
    <CFormLabel htmlFor="basic-url"></CFormLabel>
    <CInputGroup className="mb-4">
    <CInputGroupText id="basic-addon3">Full Name</CInputGroupText>
    <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
    </CInputGroup>

    <CInputGroup className="mb-3">
    <CInputGroupText>Adresss</CInputGroupText> 
    <CFormInput placeholder="Address" aria-label="Adress"/>
    <CInputGroupText>ContactNumber</CInputGroupText>
    <CFormInput placeholder="ContactNumber" aria-label="ContactNumber"/>
    </CInputGroup>

    <CInputGroup className="mb-3">
    <CFormInput type="file" id="inputGroupFile02"/>
    </CInputGroup>

    <CInputGroup>
    <CInputGroupText>Description</CInputGroupText>
    <CFormTextarea aria-label="With textarea"></CFormTextarea>
    </CInputGroup>

    <CButtonGroup className="mb-4">
    <CButton as="a" color="primary" href="#" role="button">Submit</CButton>
    </CButtonGroup>

</CFormLabel>
    <CCardFooter className="text-body-secondary"></CCardFooter>
</CCard>

</div>

            )
        
}

export default Order