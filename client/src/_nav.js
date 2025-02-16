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
    role_exclude: [''],
    icon: (
      <FontAwesomeIcon
        icon={faDashboard}
        className="nav-icon"
        size="xl"
        aria-label="Dashboard Icon"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Admin Dashboard',
    to: '/account/admin/pending-users',
    role_exclude: ['staff', 'user', 'vendor'],
    icon: (
      <FontAwesomeIcon
        icon={faChartSimple}
        className="nav-icon"
        size="xl"
        aria-label="Logistics Icon"
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
    role_exclude: ['staff', 'user', 'vendor'],
    icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Rfq Management',
        to: '/procurement/procure',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
      },
      /** {
        component: CNavItem,
        name: 'Purchase Management',
        to: '/procurement/purchaseManagement',
      },
      */
      {
        component: CNavItem,
        name: 'Payments',
        to: '/procurement/payments',
      },
      {
        component: CNavItem,
        name: 'BID Management',
        to: '/procurement/bidding',
      },
      {
        component: CNavItem,
        name: 'Vendor Management',
        to: '/procurement/vendors',
      },
      {
        component: CNavItem,
        name: 'PurchaseOrder Management',
        to: '/procurement/purchaseManagement',
      },
      {
        component: CNavItem,
        name: 'Product Catalog',
        to: '/procurement/productCatalog',
      },
      {
        component: CNavItem,
        name: 'Contract Management',
        to: '/procurement/contract',
      },
      {
        component: CNavItem,
        name: 'Notifications & Alerts',
        to: '/',
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
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Vendors',
        to: '/vendor/vendor-manage',
      },
      {
        component: CNavItem,
        name: 'PurchaseOrder Management',
        to: '/vendor/bidList',
      },
      {
        component: CNavItem,
        name: 'Bid List',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'RFQ & Submission',
        to: '/vendor/RFQ',
      },
      {
        component: CNavItem,
        name: 'Contract Management',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Payment & Invoices',
        to: '/t',
      },
      {
        component: CNavItem,
        name: 'Communication Support',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Notification & Alerts',
        to: '/',
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
    to: '/logistics',
    role_exclude: ['staff', 'user', 'vendor', 'buyer'],
    icon: (
      <FontAwesomeIcon
        icon={faChartSimple}
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
        icon={faSitemap}
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
    component: CNavTitle,
    name: 'SETTINGS',
    to: '/settings',
    role_exclude: ['staff', 'user', 'vendor', 'buyer'],
    icon: (
      <FontAwesomeIcon
        icon={faSitemap}
        className="nav-icon"
        size="xl"
        aria-label="Inventory Icon"
      />
    ),
  },
]

export default _nav
