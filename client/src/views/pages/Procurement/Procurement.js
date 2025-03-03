import React, { useState } from 'react'
import CreateProcurement from '../../../components/procurement/procurement/CreateProcurement'
import ProcurementList from '../../../components/procurement/procurement/ProcurementList'
import { CCard, CCardBody, CNav, CNavItem, CNavLink } from '@coreui/react'
import '@fortawesome/fontawesome-free/css/all.min.css'

const ProcurementPage = () => {
  const [activeTab, setActiveTab] = useState('create')

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">🛒 Procurement Request</h1>

      {/* Tab Navigation */}
      <CCard className="mb-4">
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              active={activeTab === 'create'}
              onClick={() => setActiveTab('create')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-plus-circle me-2"></i> New Procurement
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'list'}
              onClick={() => setActiveTab('list')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-list me-2"></i> View Procurements
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCard>

      {/* Content Section */}
      <CCard>
        <CCardBody>
          {activeTab === 'create' ? <CreateProcurement /> : <ProcurementList />}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProcurementPage
