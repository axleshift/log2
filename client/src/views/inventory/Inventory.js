import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CFormCheck,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

const Inventory = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedRows(new Set(Array.from({ length: 1 }, (_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowCheckChange = (e, index) => {
    if (e.target.checked) {
      selectedRows.add(index);
    } else {
      selectedRows.delete(index);
    }
    setSelectedRows(new Set(selectedRows));
  };

  return (
    <CCard>
      <CCardHeader as="h5" align="center" >
        INVENTORY
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-3">
          <CInputGroupText id="basic-addon1">Search</CInputGroupText>
          <CFormInput input="text " placeholder="Search" shape />
          &nbsp;&nbsp;
          <CButton color="primary" value="Search" shape="rounded-0">
            Search
          </CButton>
          &nbsp;
          <CButton color="primary" value="Delete" shape="rounded-0">
            Delete
          </CButton>
        </CInputGroup>

        <CTable>
          <CTableHead> 
            <CTableRow>
              <CTableHeaderCell scope="col" >
                &nbsp;
                <CFormCheck
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Type Of Item</CTableHeaderCell>
              <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              <CTableHeaderCell scope="col">Price</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>
                &nbsp;
                <CFormCheck
                  id="row1"
                  checked={selectedRows.has(0)}
                  onChange={(e) => handleRowCheckChange(e, 0)}
                />
              </CTableDataCell>
              <CTableDataCell>CellPhone</CTableDataCell>
              <CTableDataCell>Infinix</CTableDataCell>
              <CTableDataCell>10</CTableDataCell>
              <CTableDataCell>800</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>
                &nbsp;
                <CFormCheck
                  id="row1"
                  checked={selectedRows.has(0)}
                  onChange={(e) => handleRowheckChange(e, 0)}
                />
              </CTableDataCell>
              <CTableDataCell>Laptop</CTableDataCell>
              <CTableDataCell>ACER</CTableDataCell>
              <CTableDataCell>100</CTableDataCell>
              <CTableDataCell>1500</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};
export default Inventory;