import React from 'react'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDashboard,
  faWarehouse,
  faSitemap,
  faChartSimple,
  faFileText,
  faBox,
  faUserAlt,
  faChartLine,
  faBell,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: (
      <FontAwesomeIcon
        icon={faDashboard}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Dashboard Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Document Tracking',
    to: '/documentTracking',
    icon: (
      <FontAwesomeIcon
        icon={faFileText}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Document Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Procurement',
    to: '/procurement',
    icon: (
      <FontAwesomeIcon
        icon={faBox}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Procurement Icon"
      />
    ),
  },
  {
    component: CNavGroup,
    name: 'Vendor Management',
    icon: (
      <FontAwesomeIcon
        icon={faUserAlt}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Vendor Icon"
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Vendor Management',
        to: '/vendor',
        icon: (
          <FontAwesomeIcon
            icon={faUserAlt}
            className="nav-icon"
            size="xl"
            style={{ marginRight: '10px' }}
            aria-label="Vendor Icon"
          />
        ),
      },
      {
        component: CNavItem,
        name: 'Request Of Quotation',
        to: '/RFQ',
        icon: (
          <FontAwesomeIcon
            icon={faFileInvoiceDollar}
            className="nav-icon"
            size="xl"
            style={{ marginRight: '10px' }}
            aria-label="RFQ Icon"
          />
        ),
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Logistics',
    to: '/logistics',
    icon: (
      <FontAwesomeIcon
        icon={faChartSimple}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Logistics Icon"
      />
    ),
  },
  /** 
  {
    component: CNavItem,
    name: 'Warehouses',
    to: '/warehouse',
    icon: (
      <FontAwesomeIcon
        icon={faWarehouse}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Warehouses Icon"
      />
    ),
  },
  **/ // DONT REMOVE THE COMMENTS
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/inventory',
    icon: (
      <FontAwesomeIcon
        icon={faSitemap}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Inventory Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Analytics',
    to: '/analytics',
    icon: (
      <FontAwesomeIcon
        icon={faChartLine}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="Analytics Icon"
      />
    ),
  },
]

export default _nav
