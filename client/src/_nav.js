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
    role_exclude: ['staff', 'vendor'],
    icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'RFQ Management',
        to: '/procurement/rfq-management',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Payments & Invoices',
        to: '/procurement/payments-invoices',
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'BID Management',
        to: '/procurement/bidding',
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
        name: 'Purchase Orders',
        to: '/procurement/purchase-orders',
        icon: <FontAwesomeIcon icon={faWarehouse} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Product Catalog',
        to: '/procurement/product-catalog',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Contract Management',
        to: '/procurement/contracts',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Notifications & Alerts',
        to: '/notifications',
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
        name: 'Vendors Registration',
        to: '/vendor/registration',
        icon: <FontAwesomeIcon icon={faUserAlt} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Vendors List',
        to: '/vendor/list',
        icon: <FontAwesomeIcon icon={faUserAlt} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Bid List',
        to: '/vendor/bid-list',
        icon: <FontAwesomeIcon icon={faSitemap} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'RFQ & Submissions',
        to: '/vendor/rfq-submissions',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Contract Management',
        to: '/vendor/contracts',
        icon: <FontAwesomeIcon icon={faFileText} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Payments & Invoices',
        to: '/vendor/payments-invoices',
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Communication Support',
        to: '/vendor/communication',
        icon: <FontAwesomeIcon icon={faBell} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Notifications & Alerts',
        to: '/vendor/notifications',
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
