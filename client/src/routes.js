import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const TrackingStatus = React.lazy(() => import('./views/tracking/TrackingStatus'));
const Inventory = React.lazy(() => import('./views/inventory/Inventory.js'))
const InvoiceForm = React.lazy(() => import('./views/invoice/InvoiceForm.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tracking', name: 'TrackingStatus', element: TrackingStatus, exact: true },
  { path: '/inventory', name: 'Inventory', element: Inventory, exact: true },
  { path: '/invoice', name: 'Invoice', element: InvoiceForm, exact: true },
]

export default routes
