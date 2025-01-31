import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faClock, faEye, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types' // Import PropTypes

const RFQ = () => {
  const [activeTab, setActiveTab] = useState('pending')

  // Sample RFQ Data
  const rfqs = {
    pending: [
      { id: 1, supplier: 'ABC Supplies', date: '2025-02-01', total: '$500', status: 'Pending' },
      { id: 2, supplier: 'XYZ Corp', date: '2025-02-02', total: '$750', status: 'Pending' },
    ],
    accepted: [
      {
        id: 3,
        supplier: 'Global Traders',
        date: '2025-01-25',
        total: '$1,200',
        status: 'Accepted',
      },
    ],
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Requests for Quotation (RFQs)</h4>
      </CCardHeader>
      <CCardBody>
        {/* Tabs for Pending and Accepted RFQs */}
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
              <FontAwesomeIcon icon={faClock} className="me-2" />
              Pending RFQs
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 'accepted'} onClick={() => setActiveTab('accepted')}>
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              Accepted RFQs
            </CNavLink>
          </CNavItem>
        </CNav>

        {/* RFQ Table Content */}
        <CTabContent>
          {/* Pending RFQs */}
          <CTabPane visible={activeTab === 'pending'}>
            <RFQTable data={rfqs.pending} type="pending" />
          </CTabPane>

          {/* Accepted RFQs */}
          <CTabPane visible={activeTab === 'accepted'}>
            <RFQTable data={rfqs.accepted} type="accepted" />
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  )
}

// Reusable RFQ Table Component
const RFQTable = ({ data, type }) => (
  <CTable striped responsive>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell>ID</CTableHeaderCell>
        <CTableHeaderCell>Supplier</CTableHeaderCell>
        <CTableHeaderCell>Date</CTableHeaderCell>
        <CTableHeaderCell>Total</CTableHeaderCell>
        <CTableHeaderCell>Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {data.map((rfq) => (
        <CTableRow key={rfq.id}>
          <CTableDataCell>#{rfq.id}</CTableDataCell>
          <CTableDataCell>{rfq.supplier}</CTableDataCell>
          <CTableDataCell>{rfq.date}</CTableDataCell>
          <CTableDataCell>{rfq.total}</CTableDataCell>
          <CTableDataCell>
            <CButton color="info" variant="outline" size="sm" className="me-2">
              <FontAwesomeIcon icon={faEye} /> View
            </CButton>
            {type === 'pending' && (
              <>
                <CButton color="success" variant="outline" size="sm" className="me-2">
                  <FontAwesomeIcon icon={faCheckCircle} /> Accept
                </CButton>
                <CButton color="danger" variant="outline" size="sm">
                  <FontAwesomeIcon icon={faTimesCircle} /> Reject
                </CButton>
              </>
            )}
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
)

// Prop Types Validation
RFQTable.propTypes = {
  data: PropTypes.array.isRequired, // data should be an array
  type: PropTypes.string.isRequired, // type should be a string
}

export default RFQ
