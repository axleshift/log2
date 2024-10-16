import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilFile, cilTruck, cilHouse, cilClipboard } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Invoice',
    to: '/invoice', // Use 'to' for navigation
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Trucking Status',
    to: '/truckingstatus',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/inventory',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
]

export default _nav
