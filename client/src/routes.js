import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const LogisticsDashboard = React.lazy(
  () => import('./views/Management/logistics/LogisticsDashboard'),
)
const WarehouseManagement = React.lazy(
  () => import('./views/Warehouses/warehouse/WarehouseManagement.js'),
)
const IncomingDetails = React.lazy(
  () => import('./views/Management/logistics/incoming/IncomingDetails.js'),
)
const OutgoingDetails = React.lazy(
  () => import('./views/Management/logistics/outgoing/OutgoingDetails.js'),
)
const Profile = React.lazy(
  () => import('./views/pages/profile/profile.js'),
)
const Inventory = React.lazy(
  () => import('./views/inventory/Inventory.js'),
)
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logistics', name: 'LogisticsDashboard', element: LogisticsDashboard, exact: true },
  { path: '/warehouse', name: 'WarehouseManagement', element: WarehouseManagement, exact: true },
  { path: '/incoming', name: 'IncomingDetails', element: IncomingDetails, exact: true },
  { path: '/outgoing', name: 'OutgoingDetails', element: OutgoingDetails, exact: true },
  { path: '/profile', name: 'Profile', element: Profile, exact: true },
  { path: '/inventory', name: 'Inventory', element: Inventory, exact: true},
]

export default routes
