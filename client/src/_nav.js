import React from 'react'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDashboard,
  faWarehouse,
  faSitemap,
  faChartSimple,
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
    component: CNavTitle,
    name: 'SHIPMENT',
  },
  {
    component: CNavGroup,
    name: 'Management',
    icon: (
      <FontAwesomeIcon icon={faChartSimple} className="nav-icon" aria-label="Management Icon" />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Logistics',
        to: '/logistics',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'WAREHOUSE MANAGEMENT',
  },
  {
    component: CNavGroup,
    name: 'Warehouses',
    icon: <FontAwesomeIcon icon={faWarehouse} className="nav-icon" aria-label="Warehouses Icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Warehouse Management',
        to: '/warehouse',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'INVENTORY MANAGEMENT',
  },
  {
    component: CNavGroup,
    name: 'Inventory',
    icon: <FontAwesomeIcon icon={faSitemap} className="nav-icon" aria-label="Inventory Icon" />,
    items: [
      {
        component: CNavItem,
        name: 'WH1',
        to: '/WH1',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Sorting Management',
  },
  {
    component: CNavGroup,
    name: 'Sorting',
    icon: <FontAwesomeIcon icon={faSitemap} className="nav-icon" aria-label="Inventory Icon" />,
    items: [],
  },
]

export default _nav
