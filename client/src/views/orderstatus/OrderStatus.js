import React from "react";
import { 
CTable,
CTableHead,
CTableRow,
CTableHeaderCell,
CTableBody,
CTableDataCell,
CFormCheck,
CButton,
CButtonGroup,
CDropdown,
CDropdownToggle,
CDropdownItem,
CDropdownMenu,
CDropdownDivider
} from '@coreui/react';

const orderstatus = () =>{
    
    return (
        
        <CTable hover>
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell scope="col"></CTableHeaderCell>
      <CTableHeaderCell scope="col">No.</CTableHeaderCell>
      <CTableHeaderCell scope="col">OrderStatus</CTableHeaderCell>
      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
      <CTableHeaderCell scope="col">BillingAddress</CTableHeaderCell>
      <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
      <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
      <CTableHeaderCell scope="col">Kg</CTableHeaderCell>
      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    <CTableRow>
       <CTableDataCell><CFormCheck id="flexCheckDefault"/></CTableDataCell> 
      <CTableHeaderCell scope="row">1</CTableHeaderCell>
      <CTableDataCell>
      
        <CDropdown variant="btn-group">
        <CDropdownToggle color="secondary" size="sm">Status</CDropdownToggle>
        <CDropdownMenu>
        <CDropdownItem href="#">Processing</CDropdownItem>
        <CDropdownItem href="#">Failed</CDropdownItem>
        <CDropdownItem href="#">SuccessShippiment</CDropdownItem>
        <CDropdownDivider/>
        </CDropdownMenu>
        </CDropdown>

      </CTableDataCell>
      <CTableDataCell>Ma.Angelica Olavidez</CTableDataCell>
      <CTableDataCell>maanpajimola@gmail.com</CTableDataCell>
      <CTableDataCell>2455 Pacamara st,Brgy Commonwealth QuezonCity</CTableDataCell>
      <CTableDataCell>09518941731</CTableDataCell>
      <CTableDataCell>Rona irader</CTableDataCell>
      <CTableDataCell>0915648489</CTableDataCell>
      <CTableDataCell>5</CTableDataCell>
      <CTableDataCell>199</CTableDataCell>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
    <CButtonGroup className="me-md-2">
    <CButton as="a" color="primary" href="#" role="button">Submit</CButton>
    </CButtonGroup>
    </div>
      </CTableRow>
      
  </CTableBody>
  
</CTable>

    
    )
    
    
}

export default orderstatus