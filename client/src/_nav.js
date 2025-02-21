import React from 'react'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTachometerAlt,
  faWarehouse,
  faSitemap,
  faFileText,
  faBox,
  faUserAlt,
  faBell,
  faFileInvoiceDollar,
  faCog,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    role_exclude: [''],
    icon: (
      <FontAwesomeIcon
        icon={faTachometerAlt}
        className="nav-icon"
        size="xl"
        aria-label="Dashboard Icon"
      />
    ),
  },
  {
    component: CNavTitle,
    name: 'ACCESSIBLE BY ADMINS',
    role_exclude: [],
  },
  {
    component: CNavGroup,
    name: 'PROCUREMENT',
    role_exclude: ['staff', 'vendor', 'user'],
    icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Procurement',
        to: '/procurement',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'PR & RFQ Approval',
        to: '/procurement/rfq-management',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Direct Purchase & RFQ',
        to: '/procurement/directPurchase',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Purchase Order & Payment Tracking',
        to: '/procurement/payments-invoices',
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Shipment & Delivery Tracking',
        to: '/procurement/shipments',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Vendor Management',
        to: '/procurement/vendors',
        icon: <FontAwesomeIcon icon={faUserAlt} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Product Catalog',
        to: '/procurement/product-catalog',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Reports & Dashboard',
        to: '/procurement/Analytics',
        icon: <FontAwesomeIcon icon={faBell} className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'VENDORS',
    role_exclude: [],
  },
  {
    component: CNavGroup,
    name: 'Vendor Management',
    role_exclude: ['staff', 'user', 'buyer'],
    icon: <FontAwesomeIcon icon={faUserAlt} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'RFQ Announcements & Bidding',
        to: '/vendor/rfq-bidding',
        icon: <FontAwesomeIcon icon={faSitemap} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Order & Payment Tracking',
        to: '/vendor/order-payment',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Shipment & Delivery Updates',
        to: '/vendor/shipments-update',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Communication Support',
        to: '/vendor/communication',
        icon: <FontAwesomeIcon icon={faBell} className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'LOGISTICS',
    role_exclude: [],
  },
  {
    component: CNavItem,
    name: 'Logistics Dashboard',
    to: '/logistics/dashboard',
    role_exclude: ['staff', 'user', 'vendor', 'buyer'],
    icon: (
      <FontAwesomeIcon
        icon={faSitemap}
        className="nav-icon"
        size="xl"
        aria-label="Logistics Icon"
      />
    ),
  },
  {
    component: CNavTitle,
    name: 'INVENTORY MANAGEMENT',
    role_exclude: [],
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/inventory',
    role_exclude: ['staff', 'user', 'vendor', 'buyer'],
    icon: (
      <FontAwesomeIcon
        icon={faWarehouse}
        className="nav-icon"
        size="xl"
        aria-label="Inventory Icon"
      />
    ),
  },
  {
    component: CNavTitle,
    name: 'ANALYTICS',
    role_exclude: [],
  },
  {
    component: CNavGroup,
    name: 'SETTINGS',
    to: '/settings',
    role_exclude: ['staff', 'user', 'vendor', 'buyer'],
    icon: (
      <FontAwesomeIcon icon={faCog} className="nav-icon" size="xl" aria-label="Settings Icon" />
    ),
    items: [
      {
        component: CNavItem,
        name: 'General Settings',
        to: '/settings/general',
        icon: <FontAwesomeIcon icon={faCog} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'User Management',
        to: '/settings/user-management',
        icon: <FontAwesomeIcon icon={faUserAlt} className="nav-icon" />,
      },
    ],
  },
]

export default _nav
