import React from 'react'
import { CNavItem } from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList,
  faDashboard,
  faFileInvoice,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons'
const _nav = [
  {
    component: CNavItem,
    name: ' Dashboard',
    to: '/dashboard',
    icon: (
      <FontAwesomeIcon
        icon={faDashboard}
        customClassName="nav-icon"
        size="xl"
        style={{ marginRight: '10px' }}
      />
    ),
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: ' Invoice',
    to: '/invoice', // Use 'to' for navigation
    icon: (
      <FontAwesomeIcon
        icon={faFileInvoice}
        customClassName="nav-icon"
        size="xl"
        style={{ marginRight: '15px' }}
      />
    ),
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: ' Tracking Status',
    to: '/tracking',
    icon: (
      <FontAwesomeIcon
        icon={faTruckMoving}
        customClassName="nav-icon"
        size="l"
        style={{ marginRight: '12px' }}
      />
    ),
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: ' Inventory',
    to: '/inventory',
    icon: (
      <FontAwesomeIcon
        icon={faClipboardList}
        customClassName="nav-icon"
        size="xl"
        style={{ marginRight: '13px' }}
      />
    ),
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
]

export default _nav
