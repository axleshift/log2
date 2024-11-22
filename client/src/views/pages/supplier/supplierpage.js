import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react'
import { SupplierFooter } from '../../../components/supplierpage'
import DefaultLayout from '../../../components/supplierpage/layout/DefaultLayout'

function SupplierPage() {
  return (
    <DefaultLayout>
      <SupplierFooter />
    </DefaultLayout>
  )
}

export default SupplierPage
