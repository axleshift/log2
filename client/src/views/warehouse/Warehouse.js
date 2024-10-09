import React from "react";
import {
  CCard,

  CCardHeader,
  CCardFooter,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
 
  CButton,
  
} from "@coreui/react";

const Warehouse =()=>{
  return(
   <CCard className="Card">
    <h1 align='center'>WAREHOUSE</h1>
     <CCardHeader>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      <CButton color="primary" className="me-md-2" href="./Create.js">+ Create</CButton>
        <input type='text' placeholder='Search'></input>
        </div>
     </CCardHeader>

     <CTable bordered hover> 
  <CTableHead align="center" size="md">
    <CTableRow>
     
      <CTableHeaderCell scope="col">No.</CTableHeaderCell>
      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
      <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
      <CTableHeaderCell scope="col">Product Category</CTableHeaderCell>
      <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
      <CTableHeaderCell scope="col">Units Received</CTableHeaderCell>

    </CTableRow>
  </CTableHead>

  <CTableBody>
    <CTableRow>
      
    <CTableHeaderCell scope="row">1</CTableHeaderCell>
    <CTableDataCell>10/9/20224</CTableDataCell>
      <CTableDataCell>Samsung</CTableDataCell>
      <CTableDataCell>Laptop</CTableDataCell>
      <CTableDataCell>Maan</CTableDataCell>
      <CTableDataCell>2</CTableDataCell>
    </CTableRow>

    <CTableRow>
      <CTableHeaderCell scope="row">2</CTableHeaderCell>
      <CTableDataCell>10/9/20224</CTableDataCell>
      <CTableDataCell>Infinix</CTableDataCell>
      <CTableDataCell>Cellphone</CTableDataCell>
      <CTableDataCell>Carl</CTableDataCell>
      <CTableDataCell>1</CTableDataCell>
    </CTableRow>

    <CTableRow >
    
      <CTableHeaderCell scope="row">3</CTableHeaderCell>
      <CTableDataCell>10/9/20224</CTableDataCell>
      <CTableDataCell>Rog</CTableDataCell>
      <CTableDataCell>Pc</CTableDataCell>
      <CTableDataCell>Angel</CTableDataCell>
      <CTableDataCell>6</CTableDataCell>
    </CTableRow>
  
  </CTableBody>
  
</CTable>
     

     <CCardFooter>  
     <CPagination align="end"size="sm" aria-label="Search results pages">
      <CPaginationItem>Previous</CPaginationItem>
      <CPaginationItem>1</CPaginationItem>
      <CPaginationItem>2</CPaginationItem>
      <CPaginationItem>3</CPaginationItem>
      <CPaginationItem>Next</CPaginationItem>
    </CPagination>
     </CCardFooter>

   </CCard>
  )
}
export default Warehouse