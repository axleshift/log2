import React from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import WidgetComponent from '../widgets/WidgetComponent'

const Dashboard = () => {
  return (
    <CContainer>
      <h1>Dashboard</h1>
      <CRow>
        <CCol xs={10}>
          {/* Use the WidgetComponent */}
          <WidgetComponent />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
