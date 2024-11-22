import React from 'react'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDashboard,
  faWarehouse,
  faSitemap,
  faChartSimple,
  faCog,
  faUser,
  faClipboard,
  faFileLines,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'SupplierProfile',
    to: './supplierprofile',
    icon: (
      <FontAwesomeIcon
        icon={faUser}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="User Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'OrdersSection',
    to: './orderssection',
    icon: (
      <FontAwesomeIcon
        icon={faClipboard}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="faClipboard Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Invoice and Payment Status',
    to: './status',
    icon: (
      <FontAwesomeIcon
        icon={faFileLines}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="FileLines Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Support/HelpDesk',
    to: './support',
    icon: (
      <FontAwesomeIcon
        icon={faQuestionCircle}
        className="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
        aria-label="faQuestionCircle Icon"
      />
    ),
  },
]

export default _nav
