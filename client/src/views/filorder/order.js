import React from "react";
import 
{ CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormTextarea
} from "@coreui/react";


const Order = ( ) => {
    return (    
        <div>
       <CFormLabel>
        <CFormLabel htmlFor="basic-url"></CFormLabel>
<CInputGroup className="mb-3">
  <CInputGroupText id="basic-addon3">Full Name</CInputGroupText>
  <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
</CInputGroup>

<CInputGroup className="mb-3">
  <CFormInput placeholder="Username" aria-label="Username"/>
  <CInputGroupText>@</CInputGroupText>
  <CFormInput placeholder="Server" aria-label="Server"/>
</CInputGroup>

<CInputGroup className="mb-3">
  <CFormInput type="file" id="inputGroupFile02"/>
  
</CInputGroup>

<CInputGroup>
  <CInputGroupText>Description</CInputGroupText>
  <CFormTextarea aria-label="With textarea"></CFormTextarea>
</CInputGroup>
</CFormLabel>
</div>

            )
        
}

export default Order 